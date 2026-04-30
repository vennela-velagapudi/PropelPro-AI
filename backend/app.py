from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prompts import proposal_prompt, summary_prompt, risk_prompt, difference_prompt, client_objection_prompt, rebuttal_suggestion_prompt
from llm import generate_text
from versioning import save_version, compare_versions, get_versions, get_client_history

import models
from database import engine
from auth import router as auth_router, get_current_user, UserResponse

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProposalInput(BaseModel):
    client: str
    industry: str
    budget: str
    services: str
    discovery_notes: str = ""

class SimulationInput(BaseModel):
    proposal: str
    industry: str

@app.post("/generate")
def generate(data: ProposalInput, current_user: UserResponse = Depends(get_current_user)):
    try:
        # Generate proposal
        prop = generate_text(proposal_prompt(data.dict()))

        # Generate summary
        summary = generate_text(summary_prompt(prop))

        # Generate risks
        risks = generate_text(risk_prompt(data.dict()))

        # Save version
        save_version(current_user.email, data.client, data.dict(), prop)

        return {
            "proposal": prop,
            "summary": summary,
            "risks": risks,
        }
    except Exception as e:
        # Common causes: missing API key, invalid key, or local LLM server not running.
        raise HTTPException(status_code=503, detail=f"LLM request failed: {type(e).__name__}: {e}")

@app.get("/compare/{client}")
def compare(client: str, current_user: UserResponse = Depends(get_current_user)):
    diff, summary = compare_versions(current_user.email, client)
    
    if diff == "At least 2 versions are needed to compare":
        return {"diff": diff, "summary": ""}
        
    old_ver, new_ver = get_versions(current_user.email, client)
    if old_ver and new_ver:
        old_str = old_ver["proposal"] if isinstance(old_ver, dict) else old_ver
        new_str = new_ver["proposal"] if isinstance(new_ver, dict) else new_ver
        try:
            llm_summary = generate_text(difference_prompt(old_str, new_str))
            summary += f"\n\n**Impact on Proposal:**\n{llm_summary}"
        except Exception as e:
            print(f"Failed to generate semantic summary: {e}")
            pass
            
    return {"diff": diff, "summary": summary}

@app.get("/history/{client}")
def history(client: str, current_user: UserResponse = Depends(get_current_user)):
    return {"history": get_client_history(current_user.email, client)}

@app.post("/simulate")
def simulate(data: SimulationInput, current_user: UserResponse = Depends(get_current_user)):
    try:
        objection = generate_text(client_objection_prompt(data.proposal, data.industry))
        rebuttal = generate_text(rebuttal_suggestion_prompt(data.proposal, objection))
        return {
            "objection": objection,
            "rebuttal": rebuttal
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM request failed: {type(e).__name__}: {e}")
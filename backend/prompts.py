def proposal_prompt(data):
    return f"""
Generate a professional sales proposal with this structure:
1. Title Page
2. Executive Summary
3. Problem Statement
4. Proposed Solution
5. Scope of Work
6. Timeline
7. Budget Breakdown
8. Risks and Assumptions
9. Conclusion

Client: {data['client']}
Industry: {data['industry']}
Budget: {data['budget']}
Services: {data['services']}
Discovery Notes (Voice of Customer): {data.get('discovery_notes', '')}

Tone: professional and persuasive. Ensure the proposal strictly aligns with the tone, pain points, and terminology mentioned in the Discovery Notes.
"""

def summary_prompt(proposal):
    return f"Summarize this proposal in 120 words:\n{proposal}"

def risk_prompt(data):
    return f"""
List risks and assumptions for:
Industry: {data['industry']}
Services: {data['services']}
Budget: {data['budget']}
"""

def difference_prompt(old, new):
    return f"""
Compare the following two versions of a proposal.
Briefly state what changed in the proposal text itself between the two versions (e.g. "The budget breakdown was updated to reflect the lower amount", "The timeline was extended"). 
Keep it extremely simple, very very short, and to the point. Do not list the raw input changes (like 'Budget changed to X'), ONLY explain how the actual proposal document was impacted.

Old Version:
{old}

New Version:
{new}
"""

def client_objection_prompt(proposal, industry):
    return f"""
Act as a tough but realistic client in the {industry} industry. 
You have just read the following sales proposal. Provide ONE specific, realistic objection or concern you have about it. 
It could be about the price, timeline, missing features, or risk.
Keep the objection to 2-3 sentences. Be direct and slightly skeptical.

Proposal:
{proposal}
"""

def rebuttal_suggestion_prompt(proposal, objection):
    return f"""
Act as an elite sales strategist. Your salesperson just received this objection from a client regarding their proposal:
"{objection}"

Provide a short, strategic piece of advice on how the salesperson should respond, and suggest an exact phrasing they could use.
Keep it under 4 sentences. Be highly actionable and persuasive.

Proposal Context:
{proposal}
"""
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def _default_model_for_base_url(base_url: str | None) -> str:
    # If we're pointing at a local OpenAI-compatible server (e.g. Ollama),
    # default to a local model name; otherwise default to an OpenAI model.
    if base_url and "localhost:11434" in base_url:
        return "llama3.2"
    return "gpt-4o-mini"


def generate_text(prompt: str) -> str:
    base_url = os.getenv("LLM_BASE_URL") or os.getenv("OPENAI_BASE_URL")
    api_key = os.getenv("OPENAI_API_KEY") or "ollama"
    model = os.getenv("LLM_MODEL") or os.getenv("OPENAI_MODEL") or _default_model_for_base_url(base_url)

    client = OpenAI(api_key=api_key, base_url=base_url) if base_url else OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    return response.choices[0].message.content
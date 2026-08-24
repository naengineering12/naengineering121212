import os
from dataclasses import dataclass
from typing import AsyncIterator

from openai import AsyncOpenAI


@dataclass
class UserMessage:
    text: str


@dataclass
class TextDelta:
    content: str


class StreamDone:
    pass


class LlmChat:
    def __init__(self, api_key: str, session_id: str = "", system_message: str = ""):
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message
        self.provider = "openai"
        self.model = "gpt-5.4"

    def with_model(self, provider: str, model: str):
        self.provider = provider
        self.model = model
        return self

    async def stream_message(self, message: UserMessage) -> AsyncIterator[object]:
        if self.provider != "openai":
            raise ValueError(f"Unsupported provider: {self.provider}")

        # Prefer a real OpenAI API key when one is configured in Vercel.
        # The old implementation always used EMERGENT_LLM_KEY first, which
        # can cause authentication failures when that variable is stale.
        api_key = os.environ.get("OPENAI_API_KEY") or self.api_key
        if not api_key:
            raise RuntimeError("No OpenAI API key configured")

        # Allow an OpenAI-compatible proxy/base URL when the deployment uses one.
        base_url = (
            os.environ.get("OPENAI_BASE_URL")
            or os.environ.get("OPENAI_API_BASE")
            or None
        )

        client_kwargs = {"api_key": api_key}
        if base_url:
            client_kwargs["base_url"] = base_url.rstrip("/")

        client = AsyncOpenAI(**client_kwargs)
        messages = []
        if self.system_message:
            messages.append({"role": "system", "content": self.system_message})
        messages.append({"role": "user", "content": message.text})

        try:
            stream = await client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
            )
            async for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta.content
                if delta:
                    yield TextDelta(delta)
            yield StreamDone()
        finally:
            await client.close()

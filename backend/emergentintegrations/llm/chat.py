from dataclasses import dataclass
from typing import AsyncIterator, Optional

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

        client = AsyncOpenAI(api_key=self.api_key)
        messages = []
        if self.system_message:
            messages.append({"role": "system", "content": self.system_message})
        messages.append({"role": "user", "content": message.text})

        stream = await client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=True,
        )
        try:
            async for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta.content
                if delta:
                    yield TextDelta(delta)
            yield StreamDone()
        finally:
            await client.close()

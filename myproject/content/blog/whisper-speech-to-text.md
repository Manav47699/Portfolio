---
title: Setting up OpenAI Whisper for speech-to-text
description: Get OpenAI's Whisper model transcribing audio locally, ready to plug into a FastAPI + Next.js app.
date: 2025-11-27
number: 3
repo: https://github.com/Manav47699/openai_whisper-tiny_fastapi_stt
tags: [ai, whisper, speech-to-text, fastapi]
---

Whisper is OpenAI's open-source speech recognition model. Even the `tiny` variant runs comfortably on a CPU, which makes it a good fit for adding voice input to a web app.

### Install ffmpeg

```bash
sudo apt install ffmpeg       # Whisper can't work without this
```

> [!NOTE]
> ffmpeg is a system-level tool that reads audio files, converts formats and extracts the raw audio Whisper needs.

### Install the Python dependencies

A virtual environment is recommended.

```bash
pip install openai-whisper
pip install torch --index-url https://download.pytorch.org/whl/cpu   # CPU-only build (much smaller)
# pip install torch                                                  # default build
```

> [!WARNING]
> Install whatever else your app needs on top of this (FastAPI, LangChain, etc.).

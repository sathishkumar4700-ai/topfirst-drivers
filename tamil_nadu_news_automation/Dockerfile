FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt pyproject.toml ./
RUN pip install --no-cache-dir -r requirements.txt && pip install -e .

COPY . .
ENV PYTHONUNBUFFERED=1
RUN mkdir -p data/output data/secrets

EXPOSE 8080
CMD ["python", "-m", "app.cli", "serve"]

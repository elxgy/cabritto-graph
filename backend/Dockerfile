FROM python:3.9-slim

WORKDIR /app

ENV FLASK_APP=src.main
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

COPY requirements.txt . 

RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y netcat-openbsd

COPY . /app/

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]
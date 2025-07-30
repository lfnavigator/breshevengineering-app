FROM python:3.10-slim-buster

WORKDIR /app

# Копируем backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Устанавливаем Gunicorn
RUN pip install gunicorn

# Копируем собранные статические файлы фронтенда
COPY frontend/dist ./frontend/dist

# Копируем основной файл приложения
COPY app.py ./app.py

# Открываем порт
EXPOSE 7860

# Запускаем приложение с Gunicorn
CMD ["gunicorn", "app:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:7860"]



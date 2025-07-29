FROM python:3.10-slim-buster

WORKDIR /app

# Копируем backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Копируем собранные статические файлы фронтенда
COPY frontend/dist ./frontend/dist

# Копируем основной файл приложения (бывший main.py)
COPY app.py ./app.py

# Устанавливаем uvicorn
RUN pip install uvicorn

# Открываем порт
EXPOSE 7860

# Запускаем приложение
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]


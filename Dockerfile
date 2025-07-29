FROM python:3.10-slim-buster

WORKDIR /app

# Копируем backend и устанавливаем зависимости
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Копируем frontend (собранные статические файлы)
COPY frontend/dist ./frontend/dist

# Копируем основной код backend
COPY backend/main.py ./backend/main.py

# Устанавливаем uvicorn
RUN pip install uvicorn

# Открываем порт
EXPOSE 8000

# Запускаем приложение
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]


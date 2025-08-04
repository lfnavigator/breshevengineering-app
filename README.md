---
title: AURA RotorCalc
emoji: 🌀
colorFrom: blue
colorTo: indigo
sdk: docker
sdk_version: "latest"
app_file: app.py
pinned: false
---

# AURA RotorCalc

Веб-приложение для расчета параметров газостатических подшипников с React фронтендом и FastAPI бэкендом.

## Структура проекта

```
AURA/
├── backend/         # FastAPI
│   └── requirements.txt
├── frontend/        # React (Vite)
│   ├── package.json
│   └── src/
├── app.py           # Основной файл FastAPI приложения
├── Dockerfile       # Инструкции для сборки Docker образа
└── README.md        # Этот файл
```

## Установка и запуск (локально)

### Бэкенд (FastAPI)

1.  Перейдите в папку `AURA`:
    ```bash
    cd AURA
    ```

2.  Установите зависимости:
    ```bash
    pip3 install -r backend/requirements.txt
    ```

3.  Запустите сервер:
    ```bash
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload
    ```

### Фронтенд (React)

1.  Перейдите в папку `AURA/frontend`:
    ```bash
    cd AURA/frontend
    ```

2.  Установите зависимости:
    ```bash
    pnpm install
    ```

3.  Запустите сервер разработки:
    ```bash
    pnpm run dev --host
    ```

## Развертывание на Hugging Face Spaces

Проект настроен для развертывания на Hugging Face Spaces с использованием Docker. Файл `Dockerfile` и `app.py` (бывший `main.py`) находятся в корневой директории `AURA`.

## Использование

1.  Откройте веб-интерфейс.
2.  Введите параметры подшипника в форму.
3.  Нажмите кнопку "Рассчитать".
4.  Результаты отобразятся в правой панели.

## Параметры ввода

-   **Alpha (°)**: Угол наклона
-   **a1**: Параметр a1
-   **mm**: Динамическая вязкость
-   **k**: Показатель адиабаты
-   **R_out (м)**: Внешний радиус
-   **R_inner (м)**: Внутренний радиус
-   **N**: Количество отверстий
-   **nd**: Параметр nd
-   **R1 (м)**: Радиус R1
-   **D (м)**: Диаметр отверстия
-   **Cc (м)**: Радиальный зазор
-   **Alpha_corr**: Коррекционный коэффициент
-   **pa (Па)**: Атмосферное давление
-   **ps (Па)**: Давление подачи

## Технологии

-   **Бэкенд**: FastAPI, Python, SciPy
-   **Фронтенд**: React, Vite, Tailwind CSS, shadcn/ui
-   **API**: REST API с CORS поддержкой

## API Документация

FastAPI автоматически генерирует документацию API, доступную по адресу `/docs` относительно корня API (например, `https://your-space-url.hf.space/docs`).


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import math
from math import pi, cos, sin, log, sqrt, e
from scipy.integrate import quad

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы
    allow_headers=["*"],  # Разрешить все заголовки
)

# Монтируем статические файлы фронтенда
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.get("/api", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head><title>AURA RotorCalc</title></head>
        <body>
            <h2>🌀 AURA RotorCalc API is running</h2>
            <p>Try <a href="/docs">/docs</a> to test the API interface.</p>
        </body>
    </html>
    """

class BearingInput(BaseModel):
    alpha: float = 30
    a1: float = 350
    mm: float = 1.8e-5
    k: float = 1.4
    R_out: float = 31.5e-3
    R_inner: float = 6e-3
    N: int = 24
    nd: int = 1
    R1: float = 12e-3
    D: float = 0.5e-3
    Cc: float = 25e-6
    alpha_corr: float = 1
    pa: float = 1e5
    ps: float = 5e5

@app.post("/api/calculate")
def calculate(input: BearingInput):
    try:
        radians_alpha = math.radians(input.alpha)
        Rx = sqrt(input.R_out**2 - input.R_inner**2)
        r_inner = input.R_inner / input.R_out
        r1 = input.R1 / input.R_out
        C = input.Cc

        p_a = input.pa / input.ps
        Pa = p_a**2

        B = 12 * input.mm * input.a1 * (2 / (input.k + 1)) ** ((input.k + 1) / (2 * (input.k - 1)))
        Fk = (2 / (input.k + 1)) ** ((input.k + 1) / (2 * (input.k + 1)))

        m_ = (input.alpha_corr * B * input.nd * input.N * input.D) / (C**2 * input.ps)
        zeta = log(r1 / r_inner) * (log(r1) / log(r_inner))

        p_d = sqrt(((p_a**2) + (m_ * zeta * sqrt(1 + (m_ * zeta)**2 - p_a**4))) / (1 + m_ * zeta)) * 1.1
        Pd = (Pa + m_ * zeta) / (1 + m_ * zeta)
        Q = (pi * (input.ps**2) * (C**3) * m_ * 3600) / (12 * input.mm * input.pa)

        c = sqrt((2 * abs(log(r1))) / (p_d**2 - p_a**2))
        delta = sqrt((log(r_inner) / log(r1)) - 1)

        def integrand_pd(x): return (math.e ** (-c * p_d)) * p_d
        phi_c_p_d, _ = quad(integrand_pd, 0, c * p_d)

        def integrand_pa(x): return (math.e ** (-c * p_a)) * p_a
        phi_c_p_a, _ = quad(integrand_pa, 0, c * p_a)

        def integrand_pd_delta(x): return (math.e ** (c * p_d * delta)) * p_d * delta
        psi_delta_p_d, _ = quad(integrand_pd_delta, 0, c * p_d * delta)

        def integrand_pa_delta(x): return (math.e ** (c * p_a * delta)) * p_a * delta
        psi_delta_p_a, _ = quad(integrand_pa_delta, 0, c * p_a * delta)

        omega1 = ((math.e ** ((c * p_a)**2)) * (phi_c_p_d - phi_c_p_a)) / c
        omega2 = ((math.e ** -((c * p_a * delta)**2)) * (psi_delta_p_d - psi_delta_p_a)) / (c * delta)
        omega_z = (pi * input.ps * (omega1 - (r_inner**2) * omega2) * (input.R_out**2 - input.R_inner**2)) / (1 - r_inner**2)
        Wzl = omega_z * sin(radians_alpha)

        return {
            "p_d": round(p_d, 3),
            "Q": round(Q, 3),
            "AxialLoadCapacity_N": round(Wzl, 3)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
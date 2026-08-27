"""FastAPI application entry point (ARCHITECTURE.md SS3).

Session 2 wires up the data (upload/EDA) routes and the error-handling
that every later session's routes reuse. Sessions 3/4 add models,
training, and prediction routers here.
"""
from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.errors import AppError
from app.routes import data

app = FastAPI(title="ML Integration Platform")

app.include_router(data.router)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=exc.to_dict())


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    # Normalise FastAPI's own request-validation errors into the same
    # single error shape (ARCHITECTURE.md SS6) rather than its default body.
    return JSONResponse(
        status_code=422,
        content={
            "error": True,
            "code": "request_validation_error",
            "message": "Request validation failed.",
            "details": {"errors": jsonable_encoder(exc.errors())},
        },
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

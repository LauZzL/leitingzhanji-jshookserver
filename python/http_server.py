from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/")
async def read_root():
    return "ok"

@app.post("/req")
async def handle_request(request: Request):
    body = await request.json()
    print(f"Request => {body}")
    return "ok"

@app.post("/res")
async def handle_response(request: Request):
    body = await request.json()
    print(f"Response => {body}")
    return "ok"


# run: uvicorn main:app --reload --port 3000

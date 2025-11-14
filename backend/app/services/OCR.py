import requests

@app.post("/ocr_api/")
async def ocr_api(file: UploadFile = File(...)):
    api_key = os.getenv("OCR_API_KEY")
    files = {"file": (file.filename, await file.read())}
    response = requests.post(f"https://huggingface.co/settings/tokens/new?tokenType=write", files=files, data={"apikey": api_key})
    return response.json()

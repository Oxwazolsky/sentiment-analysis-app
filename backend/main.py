from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io
from ml_service import predictor

app = FastAPI(title="Game Review Sentiment & Rating API", version="1.0.0")

# Setup CORS untuk mengizinkan request dari frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ganti dengan domain Vercel Anda nanti untuk keamanan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SingleReviewRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "API is running. Model status: " + ("Mock" if predictor.is_mock else "Loaded")}

@app.post("/api/predict/single")
def predict_single(request: SingleReviewRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Review text cannot be empty")
        
    result = predictor.predict_single(request.text)
    return result

@app.post("/api/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
    try:
        contents = await file.read()
        # Membaca CSV dari bytes
        df = pd.read_csv(io.BytesIO(contents))
        
        # Coba mencari kolom yang berisi teks ulasan
        # Prioritas nama kolom: 'content', 'review', 'text'
        text_col = None
        for col in ['content', 'review', 'text', 'ulasan']:
            if col in df.columns:
                text_col = col
                break
                
        # Jika tidak ketemu, gunakan kolom pertama yang bertipe object/string
        if text_col is None:
            for col in df.columns:
                if df[col].dtype == 'object':
                    text_col = col
                    break
                    
        if text_col is None:
            raise ValueError("Could not find a text column in the CSV")
            
        result = predictor.predict_batch(df, text_column=text_col)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Menjalankan server di port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)

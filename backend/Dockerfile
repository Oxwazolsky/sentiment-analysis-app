FROM python:3.11-slim

# Set up working directory
WORKDIR /code

# Copy requirements and install them
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy all the files to the container
COPY . /code

# Hugging Face Spaces mewajibkan aplikasi berjalan di port 7860
EXPOSE 7860

# Jalankan server FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

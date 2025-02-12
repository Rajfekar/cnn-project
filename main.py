from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = [
    # "http://localhost.tiangolo.com",
    # "https://localhost.tiangolo.com",
    # "http://localhost",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = "EfficientNetB3_model.keras"
model = tf.keras.models.load_model(model_path)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_byte = await file.read()
    image= Image.open(io.BytesIO(image_byte)).convert("RGB")
    image = image.resize((224, 224), Image.Resampling.BICUBIC)
    image_array = np.array(image)/255
    image_array = np.expand_dims(image_array, axis=0)
    # img=tf.keras.preprocessing.image.load_img(image,target_size=(224,224))
    # img=tf.keras.preprocessing.image.img_to_array(img)
    predictions=model.predict(image_array)
    class_lables= ['Lung squamous_cell_carcinoma', 'Lung_adenocarcinoma', 'Lung_benign_tissue'] 
    print(predictions)
    predictions_class = np.argmax(predictions, axis=1).tolist()
    return {"filename": file.filename, "predictions": class_lables[predictions_class[0]]}

@app.get("/")
def read_root():
    return {"message": "Model API is Live"}


# uvicorn main:app --reload --port 8001
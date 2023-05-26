from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import cv2
import imutils
from pydantic import BaseModel
import joblib

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model1 = tf.keras.models.load_model('xray-chest.h5')
model2 = tf.keras.models.load_model('BrainTumor.h5')  # Load your trained model

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image)

    image_array = image_array/255
    image_array = np.expand_dims(image_array , axis=0)
    image_array = np.expand_dims(image_array , axis=-1)     # add an extra dimension for the channels
    prediction = (model1.predict(image_array)[0][0] > 0.5).astype("int32")
    prediction = model1.predict(image_array)[0]
    print(prediction)
    predicted_class = 0
    if prediction>0.8:
        predicted_class = 1;
    else:
        predicted_class = 0;
    

    classes = ['Normal', 'Pneumonia']

    return {'prediction': classes[predicted_class]}


def crop_brain_contour(image, plot=False):
    
    # Convert the image to grayscale, and blur it slightly
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Threshold the image, then perform a series of erosions +
    # dilations to remove any small regions of noise
    thresh = cv2.threshold(gray, 45, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)

    # Find contours in thresholded image, then grab the largest one
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    c = max(cnts, key=cv2.contourArea)

    # Find the extreme points
    extLeft = tuple(c[c[:, :, 0].argmin()][0])
    extRight = tuple(c[c[:, :, 0].argmax()][0])
    extTop = tuple(c[c[:, :, 1].argmin()][0])
    extBot = tuple(c[c[:, :, 1].argmax()][0])

    # crop new image out of the original image using the four extreme points (left, right, top, bottom)
    new_image = image[extTop[1]:extBot[1], extLeft[0]:extRight[0]]
    return new_image





@app.post("/predict1")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    image = image.resize((240, 240))
    image_array = np.array(image)
    image_array = crop_brain_contour(image_array, plot=False)
    image_array = cv2.resize(image_array,(240, 240))
    image_array = image_array/255
    image_array = np.expand_dims(image_array , axis=0)
    
    
         # add an extra dimension for the channels
    prediction = (model2.predict(image_array)[0][0] > 0.5).astype("int32")
    prediction = model2.predict(image_array)[0]
    print(prediction)
    predicted_class = 0
    if prediction>0.5:
        predicted_class = 1;
    else:
        predicted_class = 0;
    

    classes = ['Normal', 'Tumor']

    return {'prediction': classes[predicted_class]}


class HeartDiseaseData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    

@app.post("/predict2")
def predict_heart_disease(data: HeartDiseaseData):
    model = joblib.load("heartmodel_updated.pkl")
    features = [data.age, data.sex, data.cp, data.trestbps, data.chol, data.fbs, data.restecg, data.thalach,
                data.exang, data.oldpeak]
    prediction = model.predict([features])
    return {"prediction": int(prediction[0])}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

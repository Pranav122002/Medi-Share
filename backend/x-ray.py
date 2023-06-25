from fastapi import FastAPI, UploadFile, File,Request


from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import cv2
import pandas as pd
import re
import csv
import imutils
from pydantic import BaseModel
import joblib
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from bs4 import BeautifulSoup

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model1 = tf.keras.models.load_model('xray-chest.h5')
model2 = tf.keras.models.load_model('BrainTumor.h5')  # Load your trained model
model4 = tf.keras.models.load_model('kidney_tumor_classification_model.h5')
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
        predicted_class = 1
    else:
        predicted_class = 0
    

    classes = ['No Pneumonia detected ', 'You may have Pneumonia']

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
    
    # Convert image to RGB format
    image = image.convert("RGB")
    
    image = image.resize((240, 240))
    image_array = np.array(image)
    image_array = crop_brain_contour(image_array, plot=False)
    image_array = cv2.resize(image_array, (240, 240))
    image_array = image_array / 255
    image_array = np.expand_dims(image_array, axis=0)
    
    prediction = (model2.predict(image_array)[0][0] > 0.5).astype("int32")
    predicted_class = 0 if prediction > 0.5 else 1
    
    classes = ['No Brain tumor detected', 'Brain Tumor Detected']

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









@app.post("/predict4")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image)

    image_array = image_array/255
    image_array = np.expand_dims(image_array , axis=0)
    image_array = np.expand_dims(image_array , axis=-1)     # add an extra dimension for the channels
    prediction = (model4.predict(image_array)[0][0] > 0.5).astype("int32")
    prediction = model4.predict(image_array)[0]
    print(prediction)
    predicted_class = 0
    if prediction>0.8:
        predicted_class = 1
    else:
        predicted_class = 0
    

    classes = ['No kidney stone detected.', 'You May have a kidney stone.']

    return {'prediction': classes[predicted_class]}












class SymptomData(BaseModel):
    symptoms: str

@app.post("/predict3")
def predict_condition(symptom_data: SymptomData):
    symptoms = symptom_data.symptoms
    if symptoms:
        clean_text = cleanText(symptoms)
        clean_lst = [clean_text]

        tfidf_vect = vectorizer.transform(clean_lst)
        prediction = model5.predict(tfidf_vect)
        predicted_cond = prediction[0]
        df = pd.read_csv(DATA_PATH)
        top_drugs = top_drugs_extractor(predicted_cond, df)
    
    
        print(top_drugs)
    return {"condition": predicted_cond, "recommendation": top_drugs}




MODEL_PATH = 'passmodel.pkl'
TOKENIZER_PATH ='tfidfvectorizer.pkl'
DATA_PATH ='output.csv'
vectorizer = joblib.load(TOKENIZER_PATH)
model5 = joblib.load(MODEL_PATH)
stop = stopwords.words('english')
lemmatizer = WordNetLemmatizer()

   


def cleanText(raw_review):
     
    review_text = BeautifulSoup(raw_review, 'html.parser').get_text()
    
    letters_only = re.sub('[^a-zA-Z]', ' ', review_text)
    
    words = letters_only.lower().split()
    
    meaningful_words = [w for w in words if not w in stop]
    
    lemmitize_words = [lemmatizer.lemmatize(w) for w in meaningful_words]
    
    return( ' '.join(lemmitize_words))


def top_drugs_extractor(condition,df):
    df_top = df[(df['rating']>=9)&(df['usefulCount']>=100)].sort_values(by = ['rating', 'usefulCount'], ascending = [False, False])
    drug_lst = df_top[df_top['condition']==condition]['drugName'].head(3).tolist()
    return drug_lst























from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import random
import time
import re
import pandas as pd

from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier,_tree
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.svm import SVC
import csv
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)


# Define the request body model for user input
class UserInput(BaseModel):
    message: str



@app.post("/chatbot")
def chatbot_response(request: Request, user_input: UserInput):
    user_message = user_input.message.lower()

    # Define bot responses based on user input
    if user_message == "hello":
        response = "Hello"
        
    elif user_message == "0":
        response = "0"
    elif user_message == "1":
        response = "1"
    elif user_message == "2":
        response = "2"
    elif user_message == "3":
        response = "3"
    elif user_message == "4":
        response = "4"
    elif user_message == "5":
        response = "5"
    elif user_message == "6":
        response = "6"
    elif user_message == "7":
        response = "7"
    else:
        response = "Sorry, I couldn't understand your input."
        
    sleep_time = random.uniform(0.5, 1.5)
    time.sleep(sleep_time)
    print(response)
    
    response = JSONResponse(content={"message": response})
    print(response)
    
    # Return the response as JSON
    return response 

class SymptomsInput(BaseModel):
    symptoms: str

@app.post("/predictionpage")
def symptoms(symptoms_input: SymptomsInput):
    symptoms_input = symptoms_input.symptoms
    if symptoms_input:
        clean_text = cleanText(symptoms_input)
        clean_lst = [clean_text]

        tfidf_vect = vectorizer.transform(clean_lst)
        prediction = model5.predict(tfidf_vect)
        predicted_cond = prediction[0]
        df = pd.read_csv(DATA_PATH)
        top_drugs = top_drugs_extractor(predicted_cond, df)
        print(top_drugs)
        print(predicted_cond)
    
    
    response = predicted_cond
    
    return JSONResponse(content={"message": response})
    








def get_symptoms_by_disease1(condition,df):
    drug_lst = df[df['prognosis']==condition]['Symptoms'].head(1).tolist()
    return drug_lst

DATA_PATH1 ='dataset.csv'
class DiseasesInput(BaseModel):
    diseases: str
@app.post("/symptoms")
def diseases(diseases_input: DiseasesInput):
    diseases_input = diseases_input.diseases
    df = pd.read_csv(DATA_PATH1)
    response = get_symptoms_by_disease1(diseases_input,df)
    print(response)
    
    return JSONResponse(content={"message": response})
    
    
    


def get_precautions_by_disease1(condition,df):
    drug_lst = df[df['Name']==condition]['Precautions'].head(1).tolist()
    return drug_lst

DATA_PATH2 ='precaution1.csv'
class PrecautionsInput(BaseModel):
    precautions: str
@app.post("/precautions")
def precautions(precautions_input: PrecautionsInput):
    precautions_input = precautions_input.precautions
    df = pd.read_csv(DATA_PATH2)
    response = get_precautions_by_disease1(precautions_input,df)
    print(response)
    
    
    
    return JSONResponse(content={"message": response})








def get_precautions_by_disease2(condition,df):
    drug_lst = df[df['Disease']==condition]['Description'].head(1).tolist()
    return drug_lst

DATA_PATH3 ='symptom_Description.csv'
class DiscriptionsInput(BaseModel):
    discriptions: str
@app.post("/discriptions")
def discriptions(discriptions_input: DiscriptionsInput):
    discriptions_input = discriptions_input.discriptions
    df = pd.read_csv(DATA_PATH3)
    response = get_precautions_by_disease2(discriptions_input,df)
    print(response)
    
    
    
    return JSONResponse(content={"message": response})






class MedicinesInput(BaseModel):
    medicines: str
@app.post("/medicines")
def medicines(medicines_input: MedicinesInput):
    medicines_input = medicines_input.medicines
    if medicines_input:
        clean_text = cleanText(medicines_input)
        clean_lst = [clean_text]

        tfidf_vect = vectorizer.transform(clean_lst)
        prediction = model5.predict(tfidf_vect)
        predicted_cond = prediction[0]
        df = pd.read_csv(DATA_PATH)
        top_drugs = top_drugs_extractor(predicted_cond, df)
        print(top_drugs)
        # print(predicted_cond)
    
    
    response = top_drugs
    
    return JSONResponse(content={"message": response})
    
    
    
    












def get_packet_by_disease(condition,df):
    manufacturer = df[df['name'].str.contains(condition, case=False)]['pack_size_label'].values
    if manufacturer[0] == [] :
        manufacturer = df[df['short_composition1'].str.contains(condition, case=False)]['pack_size_label'].values

    return manufacturer[0]


def get_manufacturer_name_by_disease(condition,df):
    manufacturer = df[df['name'].str.contains(condition, case=False)]['manufacturer_name'].values
    if manufacturer[0] == [] :
        manufacturer = df[df['short_composition1'].str.contains(condition, case=False)]['manufacturer_name'].values

    return manufacturer[0]

def get_price_name_by_disease(condition,df):
    manufacturer = df[df['name'].str.contains(condition, case=False)]['price'].values
    if manufacturer[0] == [] :
        manufacturer = df[df['short_composition1'].str.contains(condition, case=False)]['price'].values

    return manufacturer[0]

DATA_PATH4 ='A_Z_medicines_dataset_of_India1.csv'
class MedicineInput(BaseModel):
    medicine_name: str
@app.post("/medicine_market")
def medicine_market(medicine_name: MedicineInput):
    medicine_name = medicine_name.medicine_name
    df = pd.read_csv(DATA_PATH4)
    response = get_manufacturer_name_by_disease(medicine_name,df)
    response1 = get_price_name_by_disease(medicine_name,df)
    response2 = get_packet_by_disease(medicine_name,df)
    print(response)
    
    
    
    return {"message": {"manufacturer_name": response, "price": response1, "packet_size":response2}}
# Add other necessary API endpoints as needed











def get_substitute_by_medicine(condition,df):
    manufacturer = df[df['name'].str.contains(condition, case=False)]['combined_column'].values
    return manufacturer[0]

DATA_PATH5 ='new_file.csv'
class SubstitutesInput(BaseModel):
    substitute: str
@app.post("/substitutes")
def substitutes(substitutes_input: SubstitutesInput):
    substitutes_input = substitutes_input.substitute
    df = pd.read_csv(DATA_PATH5)
    response = get_substitute_by_medicine(substitutes_input,df)
    print(response)
    
    
    
    return JSONResponse(content={"message": response})











def get_sideeffect_by_medicine(condition,df):
    manufacturer = df[df['name'].str.contains(condition, case=False)]['combined_sideEffect'].values
    return manufacturer[0]

DATA_PATH6 ='new_file.csv'
class SideeffectInput(BaseModel):
    sideeffect: str
@app.post("/sideeffects")
def sideeffect(sideeffect_input: SideeffectInput):
    sideeffect_input = sideeffect_input.sideeffect
    df = pd.read_csv(DATA_PATH6)
    response = get_sideeffect_by_medicine(sideeffect_input,df)

    print(response)
    
    
    
    return JSONResponse(content={"message": response})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
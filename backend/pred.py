

# import pickle
# import streamlit as st
# from streamlit_option_menu import option_menu


# diabetes_model = pickle.load(
#     open('C:/Users/prana/Desktop/asdf/Medi-Share/backend/ml-models/diabetes_model.sav', 'rb'))

# diab_diagnosis = ''

# diab_prediction = diabetes_model.predict(
#     [[5,166,72,19,175,25.8,0.587,51]])

# if (diab_prediction[0] == 1):
#     diab_diagnosis = 'The person is diabetic'
# else:
#     diab_diagnosis = 'The person is not diabetic'




import pickle
import json


diabetes_model = pickle.load(open('C:/Users/prana/Desktop/asdf/Medi-Share/backend/ml-models/your_model.sav', 'rb'))

diab_diagnosis = ''

diab_prediction = diabetes_model.predict(
    [[5,166,72,19,175,25.8,0.587,51]])

if (diab_prediction[0] == 1):
    diab_diagnosis = 'The person is diabetic'
else:
    diab_diagnosis = 'The person is not diabetic'

# create a dictionary containing the prediction result
result = {'diagnosis': diab_diagnosis}

# convert the dictionary to a JSON string and print it to stdout
print(json.dumps(result))

import helpers
import pandas as pd
import numpy as np
import json
import os
from flask import Flask, render_template, redirect, url_for, session
from flask import request
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask_cors import CORS, cross_origin
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('File Uploading')

UPLOAD_FOLDER = 'E:/DBInternProject/InternProject/Json-Grid-View/test'
ALLOWED_EXTENSIONS = set(['txt', 'json'])

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Post method for URL

json_data = None
__CSV_FILE_NAME = 'generated_csv_file'
__EXCEL_FILE_NAME = 'generated_xlsx_file'
__SAME = '__SAME__'
__NULL = 'null'

@app.route('/url', methods=['POST'])
def url():
    global json_data

    # Step1 : Load Json from url to json_data
    seturl = request.json['seturl']
    load_status, json_data = helpers.load_url_json(URL=seturl)
    if load_status:
        print("\n"*5, "json data in main", json_data)
    else:
        print("Error :", json_data)
        json_data = None

    # Step2 : fill missing keys in the json data
    helpers.fill_missing(data=json_data, __NULL='null')
    print("\n"*5 , "filled missing data" , json_data)

    # Step3 : dfs hash to generate col list and hashtable
    col_list, hash_tab = helpers.dfsHash(data=json_data)

    # Step4 : create empty DataFrame for our table
    tempDF = pd.DataFrame( __SAME, index=np.arange(
        hash_tab[0][0]), columns=col_list)

    # Step5 : fill tempDF using dfs
    helpers.fill_data_frame(data=json_data, rinc=0, cinc=0, df=tempDF, hash=hash_tab)

    # Step6 : Generate .csv file
    tempDF.to_csv(__CSV_FILE_NAME + '.csv')
    return "post request made"

# Post method for JSON


@app.route('/json', methods=['POST'])
def Json():
    setJson = request.json['setJson']
    print(setJson)
    return "post request made"

# Post Method for File Upload


@app.route('/uploader', methods=['POST'])
def fileUpload():
    file = request.files['file']
    filename = secure_filename(file.filename)
    df = json.load(file)
    print("filename=", filename,  "df = ", df)
    return None


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)

# flask_cors.CORS(app, expose_headers='Authorization')

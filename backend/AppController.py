import os
import json
import requests
from flask import Flask,render_template, request, redirect ,url_for,session
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from flask_cors import CORS, cross_origin
import logging
from jsonparser import *

os.environ["SPARK_HOME"] = "E:/hadoop-env/spark-3.0.2-bin-hadoop2.7"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('File Uploading')

UPLOAD_FOLDER = 'E:/DBInternProject/InternProject/Json-Grid-View/test'
ALLOWED_EXTENSIONS = set(['txt','json'])

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Post method for URL
@app.route('/url', methods=['POST'])
def url():
    seturl=request.json['seturl']
    # print(requests.get(seturl).content)

    print(seturl)
    print("Calling json_to_hive...")
    json_to_hive()
    print("json_to_hive executed!!!")
    return "post request made"

# Post method for JSON
@app.route('/json', methods=['POST'])
def Json():
    setJson=request.json['setJson']
    print(setJson)
    # if(json.loads(setJson)):
    #     print("it is valid json")
    # else:
    #     print("not a valid json")
    print(setJson)
    return "post request made"

# Post Method for File Upload
@app.route('/uploader', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("Uploading the File")
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response="File Uploaded Succesfully"
    return response

if __name__== "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)

flask_cors.CORS(app, expose_headers='Authorization')

from logging import exception
from flask import Flask,jsonify,request
from flask_cors import CORS,cross_origin
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/upload' ,methods=['POST'])
@cross_origin()

def uploadFile():
    try:
        print("enter")
        type=request.form['input_type']
        print(type)
        if type=="file":
            file=request.files['File']
            df=json.load(file)
            print(df)
            print(file)
        if type=="url":
            url=request.form['Url']
            print(url)
        if type=="text":
            text=request.form['Json']
            print(text)
        response=jsonify(message="Api server is running")
    
        return response

    except Exception as e:
        print(e)
        return jsonify({'message:','error'})

if __name__== "__main__":
    app.run(debug=True)
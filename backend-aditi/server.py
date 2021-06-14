from flask import Flask, jsonify, request
from flask.helpers import send_file, send_from_directory
from flask_cors import CORS , cross_origin
import json
from flask_socketio import *
app = Flask(__name__)
socketio = SocketIO(app,cors_allowed_origins="*")


@socketio.on('connect')
def connected():
    print('connected')

@socketio.on('UserAdded')
def userAdded(message):
    print('User Added')
    emit('userAddedResponse', {'data': message}, broadcast=True)

@app.route('/api/upload', methods=['POST'])
@cross_origin()
def uploadFile():
    
    try:
        print("enter")
        type = request.form['input_type']
        print(type)
        progress=0
        for i in range (1,100):
            progress=i
            socketio.emit('progress', i, broadcast=True)

        # if type=="file":
        #      file = request.files['File']
        #      df = json.load(file)
        #     #  print(df)
        #      print(file)
        # if type == "url":
        #     url = request.form['Url']
        #     print(url)
        # if type == "text":
        #     text = request.form['Json']
        #     print(text)
        # response = jsonify(message="Api server is running")
        @socketio.on('connect')
        def connected():
            print('connected')
        # # Enable Access-Control-Allow-Origin
        # response.headers.add("Access-Control-Allow-Origin", "*")
        if progress == 99:
         return send_from_directory(directory="./", filename="saved_file.csv")
        
    
    except Exception as e:
        print(e)
        return jsonify({'message': 'error'}), 500

if __name__ == '__main__':
    socketio.run(app,debug=True)
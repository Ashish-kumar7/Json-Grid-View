from logging import exception
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS, cross_origin
import json
import urllib.request
import utilities 
import pandas as pd
# import numpy as np
import sqlalchemy
import time
import subprocess
from fastparquet import write, ParquetFile
from flask_socketio import *
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

# Constants
CSV_FILENAME = 'generatedCsvFile'
XLSX_FILENAME = 'generatedXlsxFile'
SQL_DB_NAME = 'generatedDB'
SQL_TAB_NAME = 'table001'

@socketio.on('connect')
def connected():
    print('connected')



@app.route('/api/upload', methods=['POST'])
@cross_origin()
def uploadFile():

    jsonData = {}
    socketio.emit('progress', 10, broadcas=True)
    try:
        print("form  : " , request.form)
        startTime = time.time()
        initTime = startTime

        extension = request.form['content_type']

        type = request.form['input_type']
        if type == "file":
            file = request.files['File']
            jsonData = json.load(file)
            socketio.emit('progress', 20, broadcast=True)
        if type == "url":
            url = request.form['Url']
            jsonData = json.load(urllib.request.urlopen(url))
            socketio.emit('progress', 20, broadcast=True)
        if type == "text":
            jsonData = json.loads(request.form['Json'])
            socketio.emit('progress', 20, broadcast=True)
            print(20)

        print("Time to load data : ", time.time() - startTime)
        # Json Loaded Successfully!
        # print(jsonData)

        startTime = time.time()
        socketio.emit('progress', 30, broadcast=True)
        print(30)
        columnList, tableSchema = utilities.GenTableSchema(jsonData)
        socketio.emit('progress', 40, broadcast=True)
        print("Time to gen schema : ", time.time() - startTime)
        # Generated columnList and schemaTree
        # print("columns : " , columnList)
        # print("schema Tree: ", tableSchema)

        # startTime = time.time()
        # DF = pd.DataFrame(columns=columnList)
        # print("Time to create empty df : ", time.time() - startTime)

        DataDict = {}
        startTime = time.time()
        socketio.emit('progress', 50, broadcast=True)
        utilities.WriteDict(DataDict, 0, '', jsonData)
        print("Time to create DataDict: ", time.time() - startTime)
        socketio.emit('progress', 60, broadcast=True)

        startTime = time.time()
        socketio.emit('progress', 70, broadcast=True)
        DF = pd.DataFrame.from_dict(DataDict, "index")
        print("Time to create DF from Dict: ", time.time() - startTime)

        # startTime = time.time()
        # utilities.WriteToDF(DF, jsonData, tableSchema)
        # print("Time to write to df : ", time.time() - startTime)
        # startTime = time.time()
        # Filled the table with values and 'null'
        # utilities.fillNaN(DF)
        # print("Time to fill nan: ", time.time() - startTime)
        # startTime = time.time()
        # Fill NaN with values above them

        # print(DF.head())
        # View DF.head()

        # Generate CSV
        if extension == "csv":
            startTime = time.time()
            DF.to_csv(CSV_FILENAME + '.csv')
            socketio.emit('progress', 80, broadcast=True)
            print("Time to gen csv : ", time.time() - startTime)
            return send_file(filename_or_fp =CSV_FILENAME + '.csv' )

        # Generate XLSX
        if extension == "excel":
            startTime = time.time()
            DF.to_excel(XLSX_FILENAME + '.xlsx')
            socketio.emit('progress', 80, broadcast=True)
            print("Time to gen xlsx : ", time.time() - startTime)
            return send_file(filename_or_fp =XLSX_FILENAME + '.xlsx',as_attachment=True, mimetype="EXCELMIME")

        # Generate SQL Database, Table
        if extension == "hive":
            startTime = time.time()
            sql_engine = sqlalchemy.create_engine(
                'sqlite:///' + SQL_DB_NAME + '.db', echo=False)
            sqlite_connection = sql_engine.connect()
            DF.to_sql(SQL_TAB_NAME, sqlite_connection, if_exists='fail')
            # print("\n\nTABLE\n")
            # print(engine.execute("SELECT * FROM " + tableName).fetchall())
            sqlite_connection.close()
            print("Time to gen db : ", time.time() - startTime)
            
            startTime = time.time()
            print("Total time taken : ", startTime - initTime)
            socketio.emit('progress', 80, broadcast=True)
            # code to convert csv file and saving it to hdfs
            # df = pd.read_csv('generatedCsvFile.csv')
            # df.to_parquet("/test_parquet", compression="GZIP")
            # hdfs_cmd = "hadoop fs -put /test_parquet /hbase/storedCSV"
            # subprocess.call(hdfs_cmd, shell=True)

            return send_file(filename_or_fp =SQL_DB_NAME + '.db')
        
        # response = jsonify(message="Api server is running")
        # return response


    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


if __name__ == "__main__":
    socketio.run(app,debug=True)

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
# from fastparquet import write, ParquetFile
from flask_socketio import *
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

# Constants

# File Constants
CSV_FILENAME = 'generatedCsvFile'
XLSX_FILENAME = 'generatedXlsxFile'
SQL_DB_NAME = 'generatedDB'
SQL_TAB_NAME = 'table001'


# Generation constants
JOINER_CHAR = '.'
JOIN_PAR_IN_COLS = True
REPEAT_IN_COL = True
ADD_INDEX_FOR_LIST = False
INDEX_FOR_LIST_SUFFIX = 'INDEX'  # Index colname = par + joiner + index_suffix
FILL_MISSING_WITH = 'null'
GEN_CROSS_TABLE = False

@socketio.on('connect')
def connected():
    print('connected')


@app.route('/api/upload', methods=['POST'])
@cross_origin()
def uploadFile():

    jsonData = {}
    socketio.emit('progress', 10, broadcas=True)
    try:
        print("form  : ", request.form)
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
        columnList, tableSchema, columnListOrd, tableSchemaOrd = utilities.GenTableSchema(
            jsonData, JOINER_CHAR=JOINER_CHAR,  ADD_INDEX_FOR_LIST=ADD_INDEX_FOR_LIST,
                            INDEX_FOR_LIST_SUFFIX=INDEX_FOR_LIST_SUFFIX)
        print("Time to gen schema : ", time.time() - startTime)
        socketio.emit('progress', 40, broadcast=True)
        # Generated columnList and schemaTree
        # print("columns : ", columnList)
        # print("schema Tree: ", tableSchema)
        # print("ord cols :" , columnListOrd)
        # print("schema Tree Ord: ", tableSchemaOrd)


        # startTime = time.time()
        # DF = pd.DataFrame(columns=columnList)
        # print("Time to create empty df : ", time.time() - startTime)

        # print("Joiner : ", JOINER_CHAR)
        # print("Repeat same value in col : ", REPEAT_IN_COL)
        # print("Add index for list : ", ADD_INDEX_FOR_LIST,
        #       " suffix :", INDEX_FOR_LIST_SUFFIX)
        # print("Join Par in Cols : ",  JOIN_PAR_IN_COLS)
        # print("Fill Missing with : ", FILL_MISSING_WITH)

        DataDict = {}
        startTime = time.time()
        socketio.emit('progress', 50, broadcast=True)
        # utilities.WriteDict(DataDict, 0, '', jsonData)
        utilities.WriteData(DataDict, jsonData, tableSchema, FILL_MISSING_WITH=FILL_MISSING_WITH, ADD_INDEX_FOR_LIST=ADD_INDEX_FOR_LIST,
                            INDEX_FOR_LIST_SUFFIX=INDEX_FOR_LIST_SUFFIX, GEN_CROSS_TABLE = GEN_CROSS_TABLE)
        # print(DataDict)
        print("Time to create DataDict: ", time.time() - startTime)
        socketio.emit('progress', 60, broadcast=True)

        startTime = time.time()
        socketio.emit('progress', 70, broadcast=True)
        # DF = pd.DataFrame.from_dict(DataDict, "index")
        # print("Time to create DF from Dict: ", time.time() - startTime)
        columnsOrder = columnListOrd
        DF = pd.DataFrame(list(DataDict.values()), columns=columnsOrder)
        print("Time to create DF from Dict in order: ", time.time() - startTime)

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
            return send_file(CSV_FILENAME + '.csv')

        # Generate XLSX
        if extension == "excel":
            startTime = time.time()
            DF.to_excel(XLSX_FILENAME + '.xlsx')
            socketio.emit('progress', 80, broadcast=True)
            print("Time to gen xlsx : ", time.time() - startTime)
            return send_file(XLSX_FILENAME + '.xlsx', as_attachment=True, mimetype="EXCELMIME")

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

            # code to convert csv file and saving it to hdfs
            # df = pd.read_csv('generatedCsvFile.csv')
            # df.to_parquet("/test_parquet", compression="GZIP")
            # hdfs_cmd = "hadoop fs -put /test_parquet /hbase/outputFileP"
            # subprocess.call(hdfs_cmd, shell=True)

            return send_file(SQL_DB_NAME + '.db')

        # response = jsonify(message="Api server is running")
        # return response

    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})

# @app.route('/api/convert', methods=['POST'])
# @cross_origin()
# def convertFile():

if __name__ == "__main__":
    socketio.run(app,debug=True)

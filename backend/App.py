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

app = Flask(__name__)
CORS(app)

# Constants
CSV_FILENAME = 'generatedCsvFile'
XLSX_FILENAME = 'generatedXlsxFile'
SQL_DB_NAME = 'generatedDB'
SQL_TAB_NAME = 'table001'





@app.route('/api/upload', methods=['POST'])
@cross_origin()
def uploadFile():

    jsonData = {}

    try:
        print("form  : " , request.form)
        startTime = time.time()
        initTime = startTime

        extension = request.form['content_type']

        type = request.form['input_type']
        if type == "file":
            file = request.files['File']
            jsonData = json.load(file)
        if type == "url":
            url = request.form['Url']
            jsonData = json.load(urllib.request.urlopen(url))
        if type == "text":
            jsonData = json.loads(request.form['Json'])

        print("Time to load data : ", time.time() - startTime)
        # Json Loaded Successfully!
        # print(jsonData)

        startTime = time.time()
        columnList, tableSchema = utilities.GenTableSchema(jsonData)
        print("Time to gen schema : ", time.time() - startTime)
        # Generated columnList and schemaTree
        # print("columns : " , columnList)
        # print("schema Tree: ", tableSchema)

        # startTime = time.time()
        # DF = pd.DataFrame(columns=columnList)
        # print("Time to create empty df : ", time.time() - startTime)

        DataDict = {}
        startTime = time.time()
        utilities.WriteDict(DataDict, 0, '', jsonData)
        print("Time to create DataDict: ", time.time() - startTime)

        startTime = time.time()
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
            print("Time to gen csv : ", time.time() - startTime)
            return send_file(filename_or_fp =CSV_FILENAME + '.csv' )

        # Generate XLSX
        if extension == "excel":
            startTime = time.time()
            DF.to_excel(XLSX_FILENAME + '.xlsx')
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
            
            # code to convert csv file and saving it to hdfs
            df = pd.read_csv('generatedCsvFile.csv')
            df.to_parquet("/test_parquet", compression="GZIP")
            hdfs_cmd = "hadoop fs -put /test_parquet /hbase/outputFileP"
            subprocess.call(hdfs_cmd, shell=True)

            return send_file(filename_or_fp =SQL_DB_NAME + '.db')
        
        # response = jsonify(message="Api server is running")
        # return response


    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


if __name__ == "__main__":
    app.run(debug=True)

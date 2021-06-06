from logging import exception
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
import urllib.request
import utilities
import pandas as pd
# import numpy as np
import sqlalchemy

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
        type = request.form['input_type']
        if type == "file":
            file = request.files['File']
            jsonData = json.load(file)
        if type == "url":
            url = request.form['Url']
            jsonData = json.load(urllib.request.urlopen(url))
        if type == "text":
            jsonData = json.loads(request.form['Json'])

        # Json Loaded Successfully!
        # print(jsonData)

        columnList, tableSchema = utilities.GenTableSchema(jsonData)
        # Generated columnList and schemaTree
        # print("columns : " , columnList)
        # print("schema Tree: ", tableSchema)

        DF = pd.DataFrame(columns=columnList)
        utilities.WriteToDF(DF, jsonData, tableSchema)
        # Filled the table with values and 'null'
        utilities.fillNaN(DF)
        # Fill NaN with values above them

        # print(DF.head())
        # View DF.head()

        # Generate CSV
        DF.to_csv(CSV_FILENAME + '.csv')

        # Generate XLSX
        DF.to_excel(XLSX_FILENAME + '.xlsx')

        # Generate SQL Database, Table
        sql_engine = sqlalchemy.create_engine(
            'sqlite:///' + SQL_DB_NAME + '.db', echo=True)
        sqlite_connection = sql_engine.connect()
        DF.to_sql(SQL_TAB_NAME, sqlite_connection, if_exists='fail')
        # print("\n\nTABLE\n")
        # print(engine.execute("SELECT * FROM " + tableName).fetchall())
        sqlite_connection.close()

        response = jsonify(message="Api server is running")
        return response

    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


if __name__ == "__main__":
    app.run(debug=True)

HADOOP_INSTALLED = False


from logging import exception
import re
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS, cross_origin
import json
import urllib.request

from numpy import ceil
from pandas.core.algorithms import unique
import utilities

if HADOOP_INSTALLED:
    import hadoopstorage

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
SHEET_NAME = 'Sheet1'

# Generation constants
JOINER_CHAR = '.'
JOIN_PAR_IN_COLS = True
REPEAT_IN_COL = True
ADD_INDEX_FOR_LIST = False
INDEX_FOR_LIST_SUFFIX = 'INDEX'  # Index colname = par + joiner + index_suffix
FILL_MISSING_WITH = 'null'
GEN_CROSS_TABLE = False
TABLE_TYPE = '1'

ROWS_PER_PAGE = 20
CURRENT_PAGE = 1
TOTAL_PAGES = 1



DF = ''
PreviewDF = ''
prevQueryCols = {}

HTML_PREV_STR = ''
jsonData ={}
tableSchema =''
columnListOrd =''
initTime=''


@socketio.on('connect')
def connected():
    print('connected with socketio')


@app.route('/api/upload', methods=['POST'])
@cross_origin()
def uploadFile():
    global jsonData 

    print("\n\n\n\nForm Data in /api/upload\n" , request.form)
    try:
        print("form  : ", request.form)
        startTime = time.time()
        global initTime
        initTime = startTime

        

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
        response = jsonify(message="File processed")
        return response

    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


def GenPageHTML(df, Page) :
    if Page > ceil(df.shape[0]/ROWS_PER_PAGE):
        return ''
    startRow = (Page-1) * ROWS_PER_PAGE
    endRow = min(df.shape[0] , startRow + ROWS_PER_PAGE)
    return DF.iloc[ startRow : endRow ][:].to_html(classes='mystyle')

def GenPageData(prevQueryCols, selected_col, selected_page, rows_per_page) :
    if not selected_col in prevQueryCols :
        # Load data here
        prevQueryCols[selected_col] = [pd.unique(PreviewDF)] # Showing only available data
        # prevQueryCols[q_selected_column] = [pd.unique(DF)] # Showing all data

    total_records= len(prevQueryCols[selected_col])
    total_pages = ceil( total_records/rows_per_page)
    if selected_page > total_pages :
        return []
    startIdx = (selected_page - 1) * rows_per_page
    endIdx = min( total_records, startIdx + rows_per_page )
    return prevQueryCols[selected_col][startIdx:endIdx]

@app.route('/api/process', methods=['POST'])
@cross_origin()
def processFile():
    print("process")
    print("\n\n\n\nForm Data in /api/process\n" , request.form)
    try:
        # Assign global variables based on received
        global DF
        global PreviewDF

        global JOINER_CHAR
        global JOIN_PAR_IN_COLS
        global SHEET_NAME
        global SQL_TAB_NAME
        global TABLE_TYPE
        global FILL_MISSING_WITH

        JOINER_CHAR = request.form['join_char']
        JOIN_PAR_IN_COLS = True if request.form['parentCol']=='true' else False
        SHEET_NAME = request.form['sheetName']
        SQL_TAB_NAME = request.form['tableName']
        FILL_MISSING_WITH = request.form['nullName']
        TABLE_TYPE = request.form['table_type']

        # Fill remaining based on TABLE_TYPE
        if TABLE_TYPE == '1' :
            ADD_INDEX_FOR_LIST = False
            GEN_CROSS_TABLE = False
        elif TABLE_TYPE == '2' :
            ADD_INDEX_FOR_LIST = False
            GEN_CROSS_TABLE = True
        elif TABLE_TYPE == '3' :
            ADD_INDEX_FOR_LIST = True
            GEN_CROSS_TABLE = False

        startTime = time.time()
        
        global tableSchema, columnListOrd
        columnList, tableSchema, columnListOrd, tableSchemaOrd, columnListOrdNoPar = utilities.GenTableSchema(
            jsonData, JOINER_CHAR=JOINER_CHAR,  ADD_INDEX_FOR_LIST=ADD_INDEX_FOR_LIST,
                            INDEX_FOR_LIST_SUFFIX=INDEX_FOR_LIST_SUFFIX)
        
        print("\n\n\n\nNoParCols",columnListOrdNoPar)
        print("Time to gen schema : ", time.time() - startTime)
        
        # Generated columnList and schemaTree
        # print("columns : ", columnList)
        print("schema Tree: ", tableSchema)
        # print("ord cols :" , columnListOrd)
        # print("schema Tree Ord: ", tableSchemaOrd)


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

        if not JOIN_PAR_IN_COLS : 
            # Remove parent names from columns
            DF.columns = columnListOrdNoPar
            
        print("Time to create DF from Dict in order: ", time.time() - startTime)

        PreviewDF = DF.copy()

        html_string = GenPageHTML(PreviewDF, 1)
        TOTAL_PAGES = ceil(PreviewDF.shape[0]/ROWS_PER_PAGE)
        response = jsonify(table=html_string, total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE, columns=columnListOrd) 
        return response
    
    
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})

@app.route('/api/page', methods=['POST'])
@cross_origin()
def returnDataFrame():
    print('page number')
    print()
    print('form\n\n\n\n\n' , request.form)
    try:
        page = int(request.form['page_number'])
        print(type(page))
        print(page)
        html_string = GenPageHTML(PreviewDF, page)
        response = jsonify(table=html_string,total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE) 
        return response
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})



@app.route('/api/uiquery', methods=['POST'])
@cross_origin()
def returnQueryData():
    global prevQueryCols
   
    print('page ui query')
    print()
    print('form\n\n\n\n\n' , request.form)
    try:
        q_selected_column = request.form['col_name']
        q_selected_page = request.form['page_no'] if 'page_no' in request.form else 1
        q_rows_per_page = request.form['rows_per_page']
        
        unique_data = GenPageData(prevQueryCols, selected_col = q_selected_column, selected_page=q_selected_page, rows_per_page=q_rows_per_page)
        response = jsonify(total_unique=len(prevQueryCols[q_selected_column]) , rows_per_page=q_rows_per_page, unique_data = unique_data) 
        return response
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


@app.route('/api/convert', methods=['POST'])
@cross_origin()
def convertFile():
    print("convert")
    print("\n\n\n\nForm Data in /api/convert\n" , request.form)
    try:
        extension = request.form['content_type']
        print(extension)
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
            DF.to_excel(XLSX_FILENAME + '.xlsx', sheet_name=SHEET_NAME)
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
            if HADOOP_INSTALLED :
                DF.to_csv( 'test.csv')
                hadoopstorage.saveFile(DF)
                # code to convert csv file and saving it to hdfs
                # df = pd.read_csv('generatedCsvFile.csv')
                # df.to_parquet("/test_parquet", compression="GZIP")
                # hdfs_cmd = "hadoop fs -put /test_parquet /hbase/storedCSV"
                # subprocess.call(hdfs_cmd, shell=True)

            return send_file(SQL_DB_NAME + '.db')

    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


if __name__ == "__main__":
    socketio.run(app,debug=True)
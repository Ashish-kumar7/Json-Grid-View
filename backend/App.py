from flask_socketio import *
import subprocess
import time
from numpy.lib.function_base import select
from pandas.core.base import SelectionMixin
import sqlalchemy
import pandas as pd
import os
import numpy as np
import utilities
from numpy.core.fromnumeric import reshape
from numpy import ceil
import urllib.request
import json
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request, send_file
import re
from logging import exception
from enum import unique
HADOOP_INSTALLED = False


if HADOOP_INSTALLED:
    import hadoopstorage

# import numpy as np
# from fastparquet import write, ParquetFile
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Constants

# File Constants
ELECTRON_PATH = ("..//backend//dist//App//" , "..//backend//" , "")[0] # path for prod, dev 
CSV_FILENAME = 'generatedCsvFile'
XLSX_FILENAME = 'generatedXlsxFile'
SQL_DB_NAME = 'generatedDB'
SQL_TAB_NAME = 'table001'
SHEET_NAME = 'Sheet1'

# Generation constants
JOINER_CHAR = '_'
JOIN_PAR_IN_COLS = True
REPEAT_IN_COL = True
ADD_INDEX_FOR_LIST = False
INDEX_FOR_LIST_SUFFIX = '_INDEX'  # Index colname = par + joiner + index_suffix
FILL_MISSING_WITH = 'null'
GEN_CROSS_TABLE = False
FILL_NA = ''
TABLE_TYPE = '1'

ROWS_PER_PAGE = 20
CURRENT_PAGE = 1
TOTAL_PAGES = 1

DF = ''
PreviewDF = ''
prevQueryCols = {}
queryDict = {}

HTML_PREV_STR = ''
jsonData = {}
tableSchema = ''
columnListOrd = ''
initTime = ''


@socketio.on('connect')
def connected():
    print('connected with socketio')

# Custom JSON Encoder for Numpy data types


class NumpyEncoder(json.JSONEncoder):
    """ Custom encoder for numpy data types """

    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
                            np.int16, np.int32, np.int64, np.uint8,
                            np.uint16, np.uint32, np.uint64)):

            return int(obj)

        elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
            return float(obj)

        elif isinstance(obj, (np.complex_, np.complex64, np.complex128)):
            return {'real': obj.real, 'imag': obj.imag}

        elif isinstance(obj, (np.ndarray,)):
            return obj.tolist()

        elif isinstance(obj, (np.bool_)):
            return bool(obj)

        elif isinstance(obj, (np.void)):
            return None

        return json.JSONEncoder.default(self, obj)


app.json_encoder = NumpyEncoder


@app.route('/api/upload', methods=['POST'])
@cross_origin()
def uploadFile():
    global jsonData

    # Delete the existing files
    try : 
        utilities.DeleteIfExists(ELECTRON_PATH + SQL_DB_NAME + '.db')
        utilities.DeleteIfExists(ELECTRON_PATH + CSV_FILENAME + '.csv')
        utilities.DeleteIfExists(ELECTRON_PATH + XLSX_FILENAME + '.xlsx')
    except Exception as e :
        print("Exception while deleting " , e)

    # Added delay of 5 seconds to avoid conflict between deleting old files and writing new files
    # time.sleep(3)
    print("All files deleted !!!")
    print("\n\n\n\nForm Data in /api/upload\n", request.form)
    try:
        print("form  : ", request.form)
        # with open(ELECTRON_PATH + "Form.txt") as file : 
        #     file.write(request.form)
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
        response = jsonify(message="Error: " + str(e))
        return response


@app.route('/api/process', methods=['POST'])
@cross_origin()
def processFile():
    print("process")
    print("\n\n\n\nForm Data in /api/process\n", request.form)
    try:
        # Assign global variables based on received
        socketio.emit('progress', 10, broadcast=True)
        global DF
        global PreviewDF

        global JOINER_CHAR
        global JOIN_PAR_IN_COLS
        global SHEET_NAME
        global SQL_TAB_NAME
        global TABLE_TYPE
        global FILL_MISSING_WITH
        global prevQueryCols
        prevQueryCols = {}

        JOINER_CHAR = "_"
        JOIN_PAR_IN_COLS = True if request.form['parentCol'] == 'true' else False
        SHEET_NAME = request.form['sheetName']
        SQL_TAB_NAME = request.form['tableName']
        FILL_MISSING_WITH = request.form['nullName']
        TABLE_TYPE = request.form['table_type']

        # Fill remaining based on TABLE_TYPE
        if TABLE_TYPE == '1':
            ADD_INDEX_FOR_LIST = False
            GEN_CROSS_TABLE = False
        elif TABLE_TYPE == '2':
            ADD_INDEX_FOR_LIST = False
            GEN_CROSS_TABLE = True
        elif TABLE_TYPE == '3':
            ADD_INDEX_FOR_LIST = True
            GEN_CROSS_TABLE = False

        startTime = time.time()
        socketio.emit('progress', 20, broadcast=True)
        global tableSchema, columnListOrd
        columnList, tableSchema, columnListOrd, tableSchemaOrd, columnListOrdNoPar = utilities.GenTableSchema(
            jsonData, JOINER_CHAR=JOINER_CHAR,  ADD_INDEX_FOR_LIST=ADD_INDEX_FOR_LIST,
            INDEX_FOR_LIST_SUFFIX=INDEX_FOR_LIST_SUFFIX)

        print("\n\n\n\nNoParCols", columnListOrdNoPar)
        print("Time to gen schema : ", time.time() - startTime)
        socketio.emit('progress', 30, broadcast=True)
        # Generated columnList and schemaTree
        # print("columns : ", columnList)
        print("schema Tree: ", tableSchema)
        # print("ord cols :" , columnListOrd)
        # print("schema Tree Ord: ", tableSchemaOrd)

        DataDict = {}
        startTime = time.time()
        socketio.emit('progress', 40, broadcast=True)
        # utilities.WriteDict(DataDict, 0, '', jsonData)
        utilities.WriteData(DataDict, jsonData, tableSchema, FILL_MISSING_WITH=FILL_MISSING_WITH, ADD_INDEX_FOR_LIST=ADD_INDEX_FOR_LIST,
                            INDEX_FOR_LIST_SUFFIX=INDEX_FOR_LIST_SUFFIX, GEN_CROSS_TABLE=GEN_CROSS_TABLE)
        # print(DataDict)
        socketio.emit('progress', 60, broadcast=True)
        print(60)
        print("Time to create DataDict: ", time.time() - startTime)

        startTime = time.time()

        # DF = pd.DataFrame.from_dict(DataDict, "index")
        # print("Time to create DF from Dict: ", time.time() - startTime)
        columnsOrder = columnListOrd

        DF = pd.DataFrame(list(DataDict.values()), columns=columnsOrder)
        DF.fillna(FILL_NA, inplace=True)
        if not JOIN_PAR_IN_COLS:
            # Remove parent names from columns
            DF.columns = columnListOrdNoPar

        print("Time to create DF from Dict in order: ", time.time() - startTime)
        socketio.emit('progress', 80, broadcast=True)
        print(80)
        PreviewDF = DF.copy()

        startTime = time.time()
        sql_engine = sqlalchemy.create_engine(
            'sqlite:///' + ELECTRON_PATH + SQL_DB_NAME + '.db', echo=False)
        sqlite_connection = sql_engine.connect()

        print("Conenction Made to SQL")
        DF.to_sql(SQL_TAB_NAME, sqlite_connection, if_exists='fail')

        print("\n\nData Saved in TABLE!! \n")
        # print(engine.execute("SELECT * FROM " + tableName).fetchall())
        sqlite_connection.close()
        print("Time to gen db : ", time.time() - startTime)

        startTime = time.time()
        print("Total time taken : ", startTime - initTime)
        socketio.emit('progress', 90, broadcast=True)
        
        # html_string = utilities.GenPageHTML(df = PreviewDF, Page=1, ROWS_PER_PAGE=ROWS_PER_PAGE)
        TOTAL_PAGES = ceil(PreviewDF.shape[0]/ROWS_PER_PAGE)
        # table = PreviewDF.iloc[startRow : endRow][:].to_dict()

        tableCols = []
        for c in columnListOrd :
            tableCols.append({'key' : c , 'name' : c})
        
        tableRows = []
        utilities.GenReactDataGridRows(tableRows, PreviewDF, ROWS_PER_PAGE, SELECTED_PAGE=1)
        # print(tableRows)

        response = jsonify(tableRows=tableRows, tableCols=tableCols,
                           total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE, columns=columnListOrd)

        print(response)
        return response

    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


@app.route('/api/page', methods=['POST'])
@cross_origin()
def returnDataFrame():
    print('page number')
    print()
    print('form\n\n\n\n\n', request.form)
    try:
        page = int(request.form['page_number'])
        # html_string = utilities.GenPageHTML(
        #     df=PreviewDF, Page=page, ROWS_PER_PAGE=ROWS_PER_PAGE)

        tableCols = []
        for c in columnListOrd :
            tableCols.append({'key' : c , 'name' : c})

        tableRows = []
        utilities.GenReactDataGridRows(tableRows, PreviewDF, ROWS_PER_PAGE, SELECTED_PAGE = page)
        # print(tableRows)

        response = jsonify(
            tableRows=tableRows, tableCols=tableCols, total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE)

        return response
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


@app.route('/api/uniqueValues', methods=['POST'])
@cross_origin()
def returnQueryData():
    global prevQueryCols

    print('page ui query')
    print()
    print('form\n\n\n\n\n', request.form)
    try:
        q_selected_column = request.form['col_name']
        q_selected_page = int(
            request.form['page_number']) if 'page_number' in request.form else 1
        # q_rows_per_page = int(request.form['rows_per_page'])
        unique_data = utilities.GenPageData(prevQueryCols=prevQueryCols, PreviewDF=PreviewDF,
                                            selected_col=q_selected_column, selected_page=q_selected_page, rows_per_page=10)
        print("unique_data", unique_data)
        for i in unique_data:
            print(i, type(i))
        response = jsonify(total_unique=len(
            prevQueryCols[q_selected_column]), rows_per_page=10, unique_data=unique_data)
        print(response)
        return response
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


@app.route('/api/queryForm', methods=['POST'])
@cross_origin()
def queryUsingDict():
    global prevQueryCols
    global PreviewDF

    print('page queryForm')
    print()
    print('queryDict \n\n\n\n\n', json.loads(request.form['dict']))
    try:
        queryDict = json.loads(request.form['dict'])
        PreviewDF = utilities.queryUsingDict(df=DF, queryDict=queryDict)

        # html_string = utilities.GenPageHTML(
        #     df=PreviewDF, Page=1, ROWS_PER_PAGE=ROWS_PER_PAGE)

        tableCols = []
        for c in columnListOrd :
            tableCols.append({'key' : c , 'name' : c})

        tableRows = []
        utilities.GenReactDataGridRows(tableRows, PreviewDF, ROWS_PER_PAGE, SELECTED_PAGE = 1)
        

        response = jsonify(
            tableRows=tableRows, tableCols=tableCols, total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE)

        return response
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


@app.route('/api/searchValues', methods=['POST'])
@cross_origin()
def searchValueInCol():
    global prevQueryCols
    global PreviewDF

    print('search Value Form')
    print()
    print('form \n\n\n\n\n', request.form)
    try:
        SEARCH_TOTAL_RECORDS = 20
        SEARCH_ROWS_PER_PAGE = 20
        s_selected_col = request.form['col_name']
        s_search_val = request.form['search_val']

        # Load Data here
        if not s_selected_col in prevQueryCols:
            prevQueryCols[s_selected_col] = list(pd.unique(DF[s_selected_col]))

        s_res_set = set([val for val in prevQueryCols[s_selected_col] if str(
            val).startswith(s_search_val)])
        print("result set", s_res_set)

        SEARCH_TOTAL_RECORDS = len(s_res_set)
        return jsonify(unique_data=list(s_res_set), total_unique=SEARCH_TOTAL_RECORDS, rows_per_page=SEARCH_ROWS_PER_PAGE)
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})

@app.route('/api/searchRecord', methods=['POST'])
@cross_origin()
def searchRecords():
    global prevQueryCols
    global PreviewDF

    print('search Value Form')
    print()
    print('form \n\n\n\n\n', request.form)
    try:
        s_selected_col = request.form['col_name']
        s_search_val = request.form['search_val']

        PreviewDF = utilities.queryUsingForm(df=DF, colName =s_selected_col, select_val =s_search_val )

        # html_string = utilities.GenPageHTML(
        #     df=PreviewDF, Page=1, ROWS_PER_PAGE=ROWS_PER_PAGE)

        tableCols = []
        for c in columnListOrd :
            tableCols.append({'key' : c , 'name' : c})

        tableRows = []
        utilities.GenReactDataGridRows(tableRows, PreviewDF, ROWS_PER_PAGE, SELECTED_PAGE = 1)
        

        response = jsonify(
            tableRows=tableRows, tableCols=tableCols, total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE)

        return response
        
    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})

@app.route('/api/convert', methods=['POST'])
@cross_origin()
def convertFile():
    print("convert")
    print(type(DF))
    print("\n\n\n\nForm Data in /api/convert\n", request.form)
    useDF = ''
    try:
        extension = request.form['content_type']
        # data_type = int(request.form['data_type'])

        print(extension)
        # Generate CSV
        if extension == "csv":
            startTime = time.time()

            # if data_type == 1:
            DF.to_csv(ELECTRON_PATH + CSV_FILENAME + '.csv')
            # else:
            #     PreviewDF.to_csv(CSV_FILENAME + '.csv')

            socketio.emit('progress', 80, broadcast=True)
            print("Time to gen csv : ", time.time() - startTime)
        
            return send_file(ELECTRON_PATH + CSV_FILENAME + '.csv')

        # Generate XLSX
        if extension == "excel":
            startTime = time.time()

            # if data_type == 1:
            DF.to_excel(ELECTRON_PATH + XLSX_FILENAME + '.xlsx', sheet_name=SHEET_NAME)
            # else:
            #     PreviewDF.to_excel(XLSX_FILENAME + '.xlsx',
            #                        sheet_name=SHEET_NAME)

            socketio.emit('progress', 80, broadcast=True)
            print("Time to gen xlsx : ", time.time() - startTime)
            print("generated path = " , ELECTRON_PATH + XLSX_FILENAME + '.xlsx')
            return send_file(ELECTRON_PATH + XLSX_FILENAME + '.xlsx', as_attachment=True, mimetype="EXCELMIME")

        # Generate SQL Database, Table
        if extension == "hive":

            # startTime = time.time()
            # sql_engine = sqlalchemy.create_engine(
            #     'sqlite:///' + ELECTRON_PATH + SQL_DB_NAME + '.db', echo=False)
            # sqlite_connection = sql_engine.connect()

            # print("Conenction Made to SQL")

            # if data_type == 1 :
            #     DF.to_sql(SQL_TAB_NAME, sqlite_connection, if_exists='fail')
            # else :
            #     PreviewDF.to_sql(SQL_TAB_NAME, sqlite_connection, if_exists='fail')

            # print("\n\nTABLE\n")
            # # print(engine.execute("SELECT * FROM " + tableName).fetchall())
            # sqlite_connection.close()
            # print("Time to gen db : ", time.time() - startTime)

            # startTime = time.time()
            # print("Total time taken : ", startTime - initTime)
            socketio.emit('progress', 80, broadcast=True)
            
            if HADOOP_INSTALLED:
                DF.to_csv('test.csv')
                hadoopstorage.saveFile(DF)

                # code to convert csv file and saving it to hdfs
                # df = pd.read_csv('generatedCsvFile.csv')
                # df.to_parquet("/test_parquet", compression="GZIP")
                # hdfs_cmd = "hadoop fs -put /test_parquet /hbase/storedCSV"
                # subprocess.call(hdfs_cmd, shell=True)
            socketio.emit('progress', 80, broadcast=True)
            return send_file(ELECTRON_PATH + SQL_DB_NAME + '.db')

    except Exception as e:
        print(e)
        return jsonify({'message:', 'error'})


@app.route('/api/query', methods=['POST'])
@cross_origin()
def fetchQueryData():
    print("fetch")
    print("\n\n\n\nForm Data in /api/convert\n", request.form['query_text'])
    global PreviewDF
    try:
        queryText = request.form['query_text']
        startTime = time.time()
        sql_engine = sqlalchemy.create_engine(
            'sqlite:///' + ELECTRON_PATH + SQL_DB_NAME + '.db', echo=False)
        sqlite_connection = sql_engine.connect()
        # DF.to_sql(SQL_TAB_NAME, sqlite_connection, if_exists='fail')
        # print("\n\nTABLE\n")
        # print(engine.execute("SELECT * FROM " + tableName).fetchall())

        PreviewDF = pd.read_sql_query(queryText, sqlite_connection)
        # PreviewDF = DF.copy()

        # print(DF.head())
        print(PreviewDF.head())

        sqlite_connection.close()
        print("Time to gen db : ", time.time() - startTime)

        page = 1
        # html_string = utilities.GenPageHTML(
        #     df=PreviewDF, Page=page, ROWS_PER_PAGE=ROWS_PER_PAGE)
        # response = jsonify(
        #     table=html_string, total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE)
        tableCols = []
        for c in columnListOrd :
            tableCols.append({'key' : c , 'name' : c})

        tableRows = []
        utilities.GenReactDataGridRows(tableRows, PreviewDF, ROWS_PER_PAGE, SELECTED_PAGE = page)
        response = jsonify(
            tableRows=tableRows, tableCols=tableCols, total_records=PreviewDF.shape[0], rows_per_page=ROWS_PER_PAGE)

        return response

    except Exception as e:
        print(e)
        return jsonify(message="Error: " + str(e))

# API to check if the table already existed in the db.Would be useful while storing all the tables without deleting.
# @app.route('/api/check-table', methods=['POST'])
# @cross_origin()
# def saveData():
#     print("checkTable")
#     print("\n\n\n\nForm Data in /api/check-table\n" , request.form)
#     try:
#         tableNameInput = request.form['tableName']
#         startTime = time.time()
#         sql_engine = sqlalchemy.create_engine(
#             'sqlite:///' + ELECTRON_PATH + SQL_DB_NAME + '.db', echo=False)
#         sqlite_connection = sql_engine.connect()
#         print("Conenction Made to SQL")

#         tableExists = sql_engine.dialect.has_table(sqlite_connection, tableNameInput)
#         print("Exists.........")
#         print(tableExists)
#         sqlite_connection.close()

#         if(tableExists):
#             return jsonify(message="Error: Table " + tableNameInput + " already exists. Please select another table name!")
#         else:
#             return jsonify(message = "New Table!")

#     except Exception as e:
#         print("SQLError: ")
#         print(e)
#         response = jsonify(message="Error: " + str(e))
#         return response


if __name__ == "__main__":
    app.run(debug=True, port = 50000)

# Imports
import numpy as np
import pandas as pd
from collections import OrderedDict
import time

# Global Constants
__reqCols = set()
__colTree = {"": set()}
__colTreeOrd = OrderedDict()
__reqColsOrd = []
__reqColsOrdNoPar = []
__NULL = 'null'

__JOINER_CHAR = '.'

__tableSchema = {}
__addedColumns = set()
__FILL_MISSING_WITH = 'null'
__ADD_INDEX_FOR_LIST = False
__INDEX_FOR_LIST_SUFFIX = 'INDEX'


def isScalarData(data):
    if data == None:
        return True
    return np.isscalar(data)


def isListOfDict(data):
    if not type(data) is list:
        return False
    for x in data:
        if not type(x) is dict:
            return False
    return True


def isScalarList(data):
    if not type(data) is list:
        return False

    return not isListOfDict(data)


def isScalar(data):
    return isScalarData(data) or isScalarList(data)


def dfsGenCol(data, pref):
    global __colTree
    global __colTreeOrd
    global __reqCols
    global __reqColsOrd
    global __reqColsOrdNoPar
    if isListOfDict(data):
        if __ADD_INDEX_FOR_LIST:
            colName = (pref + __JOINER_CHAR +
                       __INDEX_FOR_LIST_SUFFIX) if pref != "" else __INDEX_FOR_LIST_SUFFIX
            if colName not in __colTree[pref]:
                __colTreeOrd[pref].append(colName)
                __colTree[pref].add(colName)
            if colName not in __reqCols:
                __reqColsOrd.append(colName)
                __reqColsOrdNoPar.append(colName)
                __reqCols.add(colName)

        for x in data:
            dfsGenCol(x, pref)

    elif type(data) is dict:
        for x in data:
            colName = str(x) if (pref == "") else (
                pref + __JOINER_CHAR + str(x))
            if colName not in __colTree[pref]:
                __colTreeOrd[pref].append(colName)
                __colTree[pref].add(colName)
            # print(__colTree)
            if isScalar(data[x]):
                if colName not in __reqCols:
                    __reqColsOrd.append(colName)
                    __reqColsOrdNoPar.append(x)
                    __reqCols.add(colName)
                # print(__reqCols)
            else:
                __colTree[colName] = set()
                __colTreeOrd[colName] = []
                dfsGenCol(data[x], colName)
    else:
        print("Something went wrong!!!")


def GenTableSchema(data, JOINER_CHAR='.',  ADD_INDEX_FOR_LIST=False,
                   INDEX_FOR_LIST_SUFFIX='Index'):
    global __colTree
    global __colTreeOrd
    global __reqCols
    global __reqColsOrd
    global __reqColsOrdNoPar
    global __JOINER_CHAR
    global __ADD_INDEX_FOR_LIST
    global __INDEX_FOR_LIST_SUFFIX

    __JOINER_CHAR = JOINER_CHAR
    __ADD_INDEX_FOR_LIST = ADD_INDEX_FOR_LIST
    __INDEX_FOR_LIST_SUFFIX = INDEX_FOR_LIST_SUFFIX
    __colTree = {"": set()}
    __colTreeOrd = OrderedDict()
    __colTreeOrd[''] = []
    __reqCols = set()
    __reqColsOrd = []
    __reqColsOrdNoPar = []
    dfsGenCol(data, '')
    return (__reqCols, __colTree, __reqColsOrd, __colTreeOrd, __reqColsOrdNoPar)


def Write(cdf, row, pref, colTree, data, __NULL='null'):
    if isListOfDict(data):
        for x in data:
            Write(cdf, row, pref, colTree, x, __NULL)
            row = len(cdf)

    elif type(data) is dict:
        # print("data = " , data)
        for x in colTree[pref]:
            colName = str(x)  # if (pref=="")  else (pref + '.' + str(x) )
            # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]
            # Available cols
            if not colName in colTree:
                # print("writing " , colName , noPreCol)
                if not noPreCol in data:
                    cdf.loc[row, colName] = __NULL
                    # print(row, colName , "fill null")
                    continue

                towrt = str(data[noPreCol])
                if towrt.isnumeric():
                    cdf.at[row, colName] = data[noPreCol]
                else:
                    cdf.at[row, colName] = towrt
                # print(row , colName , " = " , towrt)
            else:
                if not noPreCol in data:
                    Write(cdf, row, colName, colTree, {}, __NULL)
                else:
                    Write(cdf, row, colName, colTree, data[noPreCol], __NULL)


def WriteToDF(cdf, data, colTree):
    Write(cdf, 0, '', colTree, data, __NULL='null')


def fillNaN(df):
    R, C = df.shape
    r, c = 1, 0
    while r < R:
        c = 0
        while c < C:
            if pd.isnull(df.iloc[r, c]):
                df.iloc[r, c] = df.iloc[r-1, c]
            c += 1
        r += 1


def WriteDict_NaN_NoIndex(d, row, pref, data):
    reqRows = 0
    if isListOfDict(data):
        for x in data:
            curRows = WriteDict_NaN_NoIndex(d, row, pref, x)
            reqRows += curRows
            row += curRows

    elif type(data) is dict:

        # print("data = " , data)
        for x in data:
            colName = str(x) if (pref == "") else (
                pref + __JOINER_CHAR + str(x))
            if isScalar(data[x]):
                reqRows = max(reqRows, 1)
                towrt = str(data[x])
                if row not in d:
                    d[row] = {}
                if towrt.isnumeric():
                    d[row][colName] = data[x]
                else:
                    d[row][colName] = towrt
                # print(row , colName , " = " , towrt)
            else:
                reqRows = max(reqRows, WriteDict_NaN_NoIndex(
                    d, row, colName, data[x]))
    return reqRows


def WriteDict_NoIndex(d, row, pref, data):
    reqRows = 0
    if isListOfDict(data):
        for x in data:
            curRows = WriteDict_NoIndex(d, row, pref, x)
            reqRows += curRows
            row += curRows

    elif type(data) is dict:

        # print("data = " , data)
        for x in __tableSchema[pref]:
            colName = x  # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]

            if x in __tableSchema:
                # Recur further
                if noPreCol in data:
                    reqRows = max(reqRows, WriteDict_NoIndex(
                        d, row, colName, data[noPreCol]))
                else:
                    reqRows = max(reqRows, WriteDict_NoIndex(
                        d, row, colName, {}))
            else:
                reqRows = max(reqRows, 1)
                if row not in d:
                    d[row] = {}
                if noPreCol in data:
                    towrt = str(data[noPreCol])
                    if towrt.isnumeric():
                        d[row][colName] = data[noPreCol]
                    else:
                        d[row][colName] = towrt
                else:
                    d[row][colName] = __FILL_MISSING_WITH
    return reqRows


def WriteDict_Index(d, row, pref, data):
    global __addedColumns
    reqRows = 0
    if isListOfDict(data):
        startRow = row
        listIdx = 0
        colName = pref + __JOINER_CHAR + \
            __INDEX_FOR_LIST_SUFFIX if pref != "" else __INDEX_FOR_LIST_SUFFIX
        for x in data:
            curRows = WriteDict_Index(d, row, pref, x)
            reqRows += curRows
            row += curRows

            for i in range(curRows):
                if (i+startRow) not in d:
                    d[i+startRow] = {}
                d[i + startRow][colName] = listIdx
            listIdx += 1
            startRow += curRows
            __addedColumns.add(colName)

        # for i in range(reqRows):
        #     if (i+startRow) not in d:
        #         d[i+startRow] = {}
        #     d[i + startRow][pref + __JOINER_CHAR + __INDEX_FOR_LIST_SUFFIX] = i

    elif type(data) is dict:

        # print("data = " , data)
        for x in __tableSchema[pref]:
            colName = x  # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]

            if x in __tableSchema:
                # Recur further
                if noPreCol in data:
                    reqRows = max(reqRows, WriteDict_Index(
                        d, row, colName, data[noPreCol]))
                else:
                    reqRows = max(reqRows, WriteDict_Index(
                        d, row, colName, {}))
            else:
                reqRows = max(reqRows, 1)
                if row not in d:
                    d[row] = {}
                if noPreCol in data:
                    towrt = str(data[noPreCol])
                    if towrt.isnumeric():
                        d[row][colName] = data[noPreCol]
                    else:
                        d[row][colName] = towrt
                elif colName not in __addedColumns:
                    d[row][colName] = __FILL_MISSING_WITH
    return reqRows


# Generate Cross Table

"""
Generate Schema Dictionary for generating cross product table
"""
def GenCrossSchema(pref,prefId, data, schema):
    reqRows = 0
    if isListOfDict(data):
        reqRows = 0
        idx = 0
        for x in data:
            colName = pref + __JOINER_CHAR + \
                str(idx) if pref != '' else str(idx)
            curRows = GenCrossSchema(pref, colName, x, schema)
            reqRows += curRows
            idx += 1
        schema[prefId] = reqRows

    else :
        reqRows = 1
        # print("data = " , data)
        for x in __tableSchema[pref]:
            colName = x 
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]
            newPrefId = prefId + __JOINER_CHAR + noPreCol if prefId !='' else noPreCol
            if prefId == 'features.45503.geometry' :
                print(pref , prefId, colName, noPreCol, newPrefId)
            if x in __tableSchema:
                # Recur further
                if prefId == 'features.45503.geometry' :
                    print("x " , x)
                if noPreCol in data:
                    reqRows *= GenCrossSchema(colName,newPrefId, data[noPreCol], schema)
                else:
                    reqRows *= GenCrossSchema(colName,newPrefId, {}, schema)
            else:
                reqRows *= 1
                schema[newPrefId] = 1
        schema[prefId] = reqRows
    # else:
    #     print("error in generating schema\n: pref\n", pref,"\ntype\n", type(data))
    return reqRows

# Generate cross product dictionary
def GenCrossDict(pref,prefId, row, Dict, data, schema):
    global __isList
    reqRows = 0
    if isListOfDict(data):
        idx = 0
        for x in data:
            colName = pref + __JOINER_CHAR + \
                str(idx) if pref != '' else str(idx)
            curRows = GenCrossDict(pref, colName,row,Dict, x, schema)
            row += schema[colName]
            idx+=1

    else:
        reqRows = 1
        # print("data = " , data)
        initRow = row
        for x in __tableSchema[pref]:
            colName = x  # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]
            newPrefId = prefId + __JOINER_CHAR + noPreCol if prefId !='' else noPreCol
            row = initRow
            if x in __tableSchema:
                # Recur further
                
                if (not data is None) and (noPreCol in data):
                    for i in range(schema[prefId] // schema[newPrefId]) : 
                        GenCrossDict(colName,newPrefId,row, Dict,data[noPreCol], schema)
                        row += schema[newPrefId]
                else:
                    for i in range(schema[prefId] // schema[newPrefId]) :
                        GenCrossDict(colName,newPrefId,row, Dict,{}, schema)
                        row += schema[newPrefId]
            else:
                towrt = __FILL_MISSING_WITH
                if (not data is None) and (noPreCol in data):
                    towrt = str(data[noPreCol])
                    if towrt.isnumeric():
                        towrt = int(towrt)
                for i in range(schema[prefId] // schema[newPrefId]) : 
                    if not (row+i) in Dict  :
                        Dict[row +i] = {}
                    Dict[row + i][colName] = towrt 
    # else:
    #     print("error in gen cross data dict: pref\n", pref,"\ntype\n", type(data))


def WriteData(DataDict, Data, tableSchema, FILL_MISSING_WITH='null', ADD_INDEX_FOR_LIST=False,
              INDEX_FOR_LIST_SUFFIX='INDEX', GEN_CROSS_TABLE = False):

    global __tableSchema
    global __FILL_MISSING_WITH
    global __ADD_INDEX_FOR_LIST
    global __INDEX_FOR_LIST_SUFFIX

    __tableSchema = tableSchema
    __FILL_MISSING_WITH = FILL_MISSING_WITH
    __ADD_INDEX_FOR_LIST = ADD_INDEX_FOR_LIST
    __INDEX_FOR_LIST_SUFFIX = INDEX_FOR_LIST_SUFFIX

    if GEN_CROSS_TABLE :
        crossSchema = {}
        startTime = time.time()
        GenCrossSchema( '' ,'', Data, crossSchema)
        print("time to gen cross schema" , time.time() - startTime)
        startTime = time.time()
        GenCrossDict('' ,'', 0,DataDict, Data, crossSchema)
        print("time to gen cross schema" , time.time() - startTime)
    else : 
        if ADD_INDEX_FOR_LIST:
            __addedColumns = set()
            WriteDict_Index(DataDict, 0, '', Data)
        else:
            WriteDict_NoIndex(DataDict, 0, '', Data)




def GenPageHTML(df, Page, ROWS_PER_PAGE) :
    if Page > np.ceil(df.shape[0]/ROWS_PER_PAGE):
        return ''
    startRow = (Page-1) * ROWS_PER_PAGE
    endRow = min(df.shape[0] , startRow + ROWS_PER_PAGE)
    return df.iloc[ startRow : endRow ][:].to_html(classes='mystyle')

def Encode(obj) :
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
    
    else :
        return obj
def GenPageData(PreviewDF, prevQueryCols, selected_col, selected_page, rows_per_page) :
    print('in gen page data')
    if not selected_col in prevQueryCols :
        # Load data here
        # print('load data for ', selected_col)
        prevQueryCols[selected_col] = list(pd.unique(PreviewDF[selected_col]))
        # prevQueryCols[selected_col] = list()
        # tmp = list(pd.unique(PreviewDF[selected_col])) 
        # for obj in tmp :
        #     prevQueryCols[selected_col].append( Encode(obj) )

    total_records= len(prevQueryCols[selected_col])
    total_pages = int(np.ceil( total_records/rows_per_page))
    if selected_page > total_pages :
        return []
    startIdx = (selected_page - 1) * rows_per_page
    endIdx = min( total_records, startIdx + rows_per_page )
    return prevQueryCols[selected_col][startIdx:endIdx]



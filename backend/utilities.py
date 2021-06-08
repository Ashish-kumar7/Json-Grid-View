# Imports
import numpy as np
import pandas as pd
from collections import OrderedDict

# Global Constants
__reqCols = set()
__colTree = {"": set()}
__colTreeOrd = OrderedDict()
__reqColsOrd = []
__NULL = 'null'

__JOINER_CHAR = '.'

__tableSchema = {}
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
    if isListOfDict(data):
        if __ADD_INDEX_FOR_LIST : 
            colName = (pref + __JOINER_CHAR + __INDEX_FOR_LIST_SUFFIX) if pref!="" else __INDEX_FOR_LIST_SUFFIX
            if colName not in __colTree[pref] :
                __colTreeOrd[pref].append(colName)
                __colTree[pref].add( colName )
            if colName not in __reqCols :
                __reqColsOrd.append(colName)
                __reqCols.add(colName)
                
        for x in data:
            dfsGenCol(x, pref)
        

    elif type(data) is dict:
        for x in data:
            colName = str(x) if (pref == "") else (
                pref + __JOINER_CHAR + str(x))
            if colName not in __colTree[pref] :
                __colTreeOrd[pref].append(colName)
                __colTree[pref].add(colName)
            # print(__colTree)
            if isScalar(data[x]):
                if colName not in __reqCols :
                    __reqColsOrd.append(colName)
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
    dfsGenCol(data, '')
    return (__reqCols, __colTree, __reqColsOrd, __colTreeOrd)


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
    reqRows = 0
    if isListOfDict(data):
        startRow = row
        for x in data:
            curRows = WriteDict_Index(d, row, pref, x)
            reqRows += curRows
            row += curRows
        for i in range(reqRows):
            if (i+startRow) not in d:
                d[i+startRow] = {}
            d[i + startRow][pref + __JOINER_CHAR + __INDEX_FOR_LIST_SUFFIX] = i

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
                else:
                    d[row][colName] = __FILL_MISSING_WITH
    return reqRows


def WriteData(DataDict, Data, tableSchema, FILL_MISSING_WITH='null', ADD_INDEX_FOR_LIST=False,
              INDEX_FOR_LIST_SUFFIX='INDEX'):

    global __tableSchema
    global __FILL_MISSING_WITH
    global __ADD_INDEX_FOR_LIST
    global __INDEX_FOR_LIST_SUFFIX

    __tableSchema = tableSchema
    __FILL_MISSING_WITH = FILL_MISSING_WITH
    __ADD_INDEX_FOR_LIST = ADD_INDEX_FOR_LIST
    __INDEX_FOR_LIST_SUFFIX = INDEX_FOR_LIST_SUFFIX

    if ADD_INDEX_FOR_LIST:
        WriteDict_Index(DataDict, 0, '', Data)
    else:
        WriteDict_NoIndex(DataDict, 0, '', Data)

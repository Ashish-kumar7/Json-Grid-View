# Imports
import numpy as np
import pandas as pd

# Global Constants
__reqCols = set()
__colTree = {"": set()}
__NULL = 'null'


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
    global __reqCols
    if isListOfDict(data):
        for x in data:
            dfsGenCol(x, pref)
    elif type(data) is dict:
        for x in data:
            print("x is ", x)
            colName = str(x) if (pref == "") else (pref + '.' + str(x))
            __colTree[pref].add(colName)
            print(__colTree)
            if isScalar(data[x]):
                __reqCols.add(colName)
                print(__reqCols)
            else:
                __colTree[colName] = set()
                dfsGenCol(data[x], colName)
    else:
        print("Something went wrong!!!")


def GenTableSchema(data):
    global __colTree
    global __reqCols
    __colTree = {"": set()}
    __reqCols = set()
    dfsGenCol(data, '')
    return (__reqCols, __colTree)


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

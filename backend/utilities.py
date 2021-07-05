# Imports
import numpy as np
from numpy.core.overrides import ARRAY_FUNCTION_ENABLED
from numpy.lib.function_base import select
import pandas as pd
from collections import OrderedDict
import time
import os

# Global Constants
__reqCols = set()
__colTree = {"": set()}
__colTreeOrd = OrderedDict()
__reqColsOrd = []
__reqColsOrdNoPar = []

__JOINER_CHAR = '.'

__tableSchema = {}
__addedColumns = set()
__FILL_MISSING_WITH = 'null'
__ADD_INDEX_FOR_LIST = False
__INDEX_FOR_LIST_SUFFIX = 'INDEX'

# isScalarData(data):
#     Working:    Checks if data is scalar.
#     Parameters: data: (list, dict, str, int, float, None)
#     Returns:    bool: True or False
def isScalarData(data):
    if data == None:
        return True
    return np.isscalar(data)

# isListOfDict(data):
#     Working:    Checks if data is list-of-dict.
#     Parameters: data: (list, dict, str, int, float, None)
#     Returns:    bool: True or False
def isListOfDict(data):
    if not type(data) is list:
        return False
    for x in data:
        if not type(x) is dict:
            return False
    return True

# isScalarList(data):
#     Working:    Checks if data is scalar-list.
#     Parameters: data: (list, dict, str, int, float, None)
#     Returns:    bool: True or False
def isScalarList(data):
    if not type(data) is list:
        return False

    return not isListOfDict(data)


# isScalar(data):
#     Working:    Checks if data is scalar(written-as-it-is in table) 
#                 or iterable( recurred further )
#     Parameters: data: (list, dict, str, int, float, None)
#     Returns:    bool: True or False
def isScalar(data):
    return isScalarData(data) or isScalarList(data)

# dfsGenCol(data , pref):
#     Working:    Generates column-header-names and table-schema using depth-first-search
#     Parameters: data:   dict    :   json-data
#                 pref:   str     :   prefix-for-column-headers
#     Returns:
#         None
#     Updates:  __colTree , __colTreeOrd, __reqCols, __reqColsOrd, __reqColsOrdNoPar  
def dfsGenCol(data, pref):
    global __colTree
    global __colTreeOrd
    global __reqCols
    global __reqColsOrd
    global __reqColsOrdNoPar

    # If 'data' is-list-of-dict then we recur 
    # and fill values 'one-below-other'
    if isListOfDict(data):
        if __ADD_INDEX_FOR_LIST:

            # Name for column-header
            colName = (pref + __JOINER_CHAR +
                       __INDEX_FOR_LIST_SUFFIX) if pref != "" else __INDEX_FOR_LIST_SUFFIX
            
            # Check if it is a new column-name
            if colName not in __colTree[pref]:
                __colTreeOrd[pref].append(colName)
                __colTree[pref].add(colName)
            
            # Check if it is a new column-name
            if colName not in __reqCols:
                __reqColsOrd.append(colName)
                __reqColsOrdNoPar.append(colName)
                __reqCols.add(colName)

        # Recur for childe
        for x in data:
            dfsGenCol(x, pref)

    # If 'data' is-dict then we recur 
    # and fill values 'one-beside-other'
    elif type(data) is dict:
        for x in data:
            # Name for column-header
            colName = str(x) if (pref == "") else (
                pref + __JOINER_CHAR + str(x))
            
            # Check if colName if new column-name
            if colName not in __colTree[pref]:
                __colTreeOrd[pref].append(colName)
                __colTree[pref].add(colName)
            
            # If scalar then don't recur
            if isScalar(data[x]):
                if colName not in __reqCols:
                    __reqColsOrd.append(colName)
                    __reqColsOrdNoPar.append(x)
                    __reqCols.add(colName)

            # If not-scalar then recur
            else:
                __colTree[colName] = set()
                __colTreeOrd[colName] = []
                dfsGenCol(data[x], colName)
    else:
        # Control should never reach here!
        print("Something went wrong!!!")


# GenTableSchema(data , pref):
    # Working:    Generates column-header-names and table-schema by calling dfsGenCol
    # Parameters: data:   dict    :   json-data
    #             JOINER_CHAR: str 
    #             ADD_INDEX_FOR_LIST : bool
    #             INDEX_FOR_LIST_SUFFIX : str
    # Returns:(__reqCols, __colTree, __reqColsOrd, __colTreeOrd, __reqColsOrdNoPar)
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



# WriteDict_NoIndex(d, row, pref, data) : 
#     Working:    Writes data in dict by performing depth-first-search
#                 No extra Index columns are added
#     Parameters: d:    Python-dict  
#                 row:    int     :to keep track of row in dict
#                 pref:   str     :to keep track of column-header
#                 data:   dict    :json-data
#     Returns: int : number of rows required to write data
def WriteDict_NoIndex(d, row, pref, data):
    reqRows = 0
    if isListOfDict(data):
        for x in data:
            curRows = WriteDict_NoIndex(d, row, pref, x)
            reqRows += curRows
            row += curRows

    elif type(data) is dict:

        for x in __tableSchema[pref]:
            colName = x  # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]

            if x in __tableSchema:
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

# WriteDict_Index(d, row, pref, data): 
#     Working:    Writes data in dict by performing depth-first-search
#                 Extra Index columns are added
#     Parameters: d:    Python-dict  
#                 row:    int     :to keep track of row in dict
#                 pref:   str     :to keep track of column-header
#                 data:   dict    :json-data
#     Returns: int : number of rows required to write data
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

    elif type(data) is dict:

        for x in __tableSchema[pref]:
            colName = x  # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]

            if x in __tableSchema:
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

# GenCrossSchema(pref, prefId, data, schema): 
#     Working:    Generates schema for Cross-product-table by performing depth-first-search
#     Parameters: pref:   str     :to keep track of column-header
#                 prefid: str     :to keep track of list-indexes-after-dfs
#                 data:   dict    :json-data
#                 schema: dict    :cross-product-table schema
#     Returns: int : number of rows required to write data
def GenCrossSchema(pref, prefId, data, schema):
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

    else:
        reqRows = 1
        for x in __tableSchema[pref]:
            colName = x
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]
            newPrefId = prefId + __JOINER_CHAR + noPreCol if prefId != '' else noPreCol
            if x in __tableSchema:
                if noPreCol in data:
                    reqRows *= GenCrossSchema(colName,
                                              newPrefId, data[noPreCol], schema)
                else:
                    reqRows *= GenCrossSchema(colName, newPrefId, {}, schema)
            else:
                reqRows *= 1
                schema[newPrefId] = 1
        schema[prefId] = reqRows
    return reqRows

# GenCrossDict(pref, prefId, row, Dict, data, schema): 
#     Working:    Generates data-dict for Cross-product-table by performing depth-first-search
#     Parameters: pref:   str     :to keep track of column-header
#                 prefid: str     :to keep track of list-indexes-after-dfs
#                 row:    int     :to keep track of row in Dict
#                 Dict:   dict    :data-dict for generating dataframe 
#                 data:   dict    :json-data
#                 schema: dict    :cross-product-table schema
#     Returns: None
def GenCrossDict(pref, prefId, row, Dict, data, schema):
    reqRows = 0
    if isListOfDict(data):
        idx = 0
        for x in data:
            colName = pref + __JOINER_CHAR + \
                str(idx) if pref != '' else str(idx)
            curRows = GenCrossDict(pref, colName, row, Dict, x, schema)
            row += schema[colName]
            idx += 1

    else:
        reqRows = 1
        initRow = row
        for x in __tableSchema[pref]:
            colName = x  # Name of col without prefix
            noPreCol = x[1 + len(pref) if pref != "" else len(pref):]
            newPrefId = prefId + __JOINER_CHAR + noPreCol if prefId != '' else noPreCol
            row = initRow
            if x in __tableSchema:
                if (not data is None) and (noPreCol in data):
                    for i in range(schema[prefId] // schema[newPrefId]):
                        GenCrossDict(colName, newPrefId, row,
                                     Dict, data[noPreCol], schema)
                        row += schema[newPrefId]
                else:
                    for i in range(schema[prefId] // schema[newPrefId]):
                        GenCrossDict(colName, newPrefId, row, Dict, {}, schema)
                        row += schema[newPrefId]
            else:
                towrt = __FILL_MISSING_WITH
                if (not data is None) and (noPreCol in data):
                    towrt = str(data[noPreCol])
                    if towrt.isnumeric():
                        towrt = int(towrt)
                for i in range(schema[prefId] // schema[newPrefId]):
                    if not (row+i) in Dict:
                        Dict[row + i] = {}
                    Dict[row + i][colName] = towrt

# WriteData(DataDict, Data, tableSchema, FILL_MISSING_WITH='null', ADD_INDEX_FOR_LIST=False,
#               INDEX_FOR_LIST_SUFFIX='INDEX', GEN_CROSS_TABLE=False): 
#     Working:    Fills DataDict by calling appropriate functions depending on parameters
#     Parameters: DataDict:   dict    :to store row-data for generating DataFrame
#                 Data:       dict    :json-data
#                 tableSchema:dict    :table-schema for performing depth-first-search
#                 FILL_MISSING_WITH:      str : value used for filling missing-values
#                 ADD_INDEX_FOR_LIST:     bool: if True extra INDEX columns are added to table
#                 INDEX_FOR_LIST_SUFFIX:  str : suffix for added-index-columns 
#                 GEN_CROSS_TABLE:        bool: if True, cross-product-table is generated
#     Returns: None
def WriteData(DataDict, Data, tableSchema, FILL_MISSING_WITH='null', ADD_INDEX_FOR_LIST=False,
              INDEX_FOR_LIST_SUFFIX='INDEX', GEN_CROSS_TABLE=False):

    global __tableSchema
    global __FILL_MISSING_WITH
    global __ADD_INDEX_FOR_LIST
    global __INDEX_FOR_LIST_SUFFIX

    __tableSchema = tableSchema
    __FILL_MISSING_WITH = FILL_MISSING_WITH
    __ADD_INDEX_FOR_LIST = ADD_INDEX_FOR_LIST
    __INDEX_FOR_LIST_SUFFIX = INDEX_FOR_LIST_SUFFIX

    if GEN_CROSS_TABLE:
        crossSchema = {}
        GenCrossSchema('', '', Data, crossSchema)
        GenCrossDict('', '', 0, DataDict, Data, crossSchema)
    else:
        if ADD_INDEX_FOR_LIST:
            __addedColumns = set()
            WriteDict_Index(DataDict, 0, '', Data)
        else:
            WriteDict_NoIndex(DataDict, 0, '', Data)

# queryUsingDict(df, queryDict): 
#     Working:    applies multi-select queries on df
#     Parameters: df:         dataframe:  dataframe for applying queries
#                 queryDict:  dict:       contains column-names and selected-values     
#     Returns:    dataframe:   dataframe after applying queries
def queryUsingDict(df, queryDict):
    for colName, valList in queryDict.items() : 
        if len(valList) != 0:
            df = df.loc[ df[colName].isin(valList) ]
    return df

# queryUsingForm(df, queryDict): 
#     Working:    applies auto-complete queries on df, case-insensitive
#     Parameters: df:         dataframe:  dataframe for applying queries
#                 queryDict:  dict:       contains column-names and text-to-complete    
#     Returns:    dataframe:   dataframe after applying queries
def queryUsingForm(df, queryDict):
    for colName, colVal in queryDict.items():
        if colVal != "":
            # df = df.loc[df[colName].astype(str).str.lower().str.startswith(colVal.lower(), na=False)]
            df = df.loc[df[colName].astype(str).str.lower().str.contains(colVal.lower(), na=False)]
    return df

# DeleteIfExists(FileName): 
#     Working:    deletes file if it exists
#     Parameters: FileName:         str:  name of the file to delete
#     Returns:    None
def DeleteIfExists(FileName):
    if os.path.exists(FileName):
        os.remove(FileName)

# GenReactDataGridRows(tableRows, df, ROWS_PER_PAGE, SELECTED_PAGE): 
#     Working:    generate row-dict for React-Data-Grid
#     Parameters: tableRows:      dict:       row-dict for react-data-grid
#                 df:             dataframe:  for reading data
#                 ROWS_PER_PAGE:  int:        number of rows to display per page
#                 SELECTED_PAGE:  int:        selected page
#     Returns:    None
def GenReactDataGridRows(tableRows, df, ROWS_PER_PAGE, SELECTED_PAGE):
    startRow = (SELECTED_PAGE - 1) * ROWS_PER_PAGE
    endRow = min(df.shape[0], startRow + ROWS_PER_PAGE)
    for idx in range(startRow, endRow):
        tableRows.append(df.iloc[idx][:].to_dict())

    # Convert data to string since react-data-grid causes problems with other dtypes
    for tableRow in tableRows:
        for colName in tableRow:
            tableRow[colName] = str(tableRow[colName])


def splitAttributeUsingDict(PreviewDF, queryDict, keepColOrder = True) :
    oldColOrder = list(PreviewDF.columns)
    for colName in queryDict:
        delim = queryDict[colName]['separator']
        splitColList = queryDict[colName]['columns']
        splits = int(queryDict[colName]['split'])
        if delim != "":
            # Split and return error if k splits not possible
            # PreviewDF[splitColList] = PreviewDF[colName].str.split(
            #     delim, n=splits-1, expand=True)
            # PreviewDF.drop([colName], axis=1, inplace=True)

            # Split and fill None if k splits not possible
            exploded = (
                PreviewDF[ colName ].str.split( delim , expand=True, n= splits-1 )
                .rename(columns={k: col for k, col in enumerate(splitColList)})
            )
            PreviewDF = PreviewDF.join(exploded)
            PreviewDF.drop([colName] , axis = 1, inplace= True)

    # Reorder columns 
    if keepColOrder : 
        newColOrder = []
        for col in oldColOrder : 
            if (col in queryDict) and queryDict[col]['separator'] != "" : 
                newColOrder.extend(queryDict[col]['columns'])
            else :
                newColOrder.append(col)
        print(PreviewDF.head())
        PreviewDF = PreviewDF[newColOrder]
        print(PreviewDF.head())
    
    print("return", PreviewDF.head())
    
    return pd.DataFrame(PreviewDF)

# ------------------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------------------
# --------------- Unused Functions----------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------------------

# GenPageData(PreviewDF, prevQueryCols, selected_col, selected_page, rows_per_page): 
#     Working:    returns unique values from selected_page for selected_col
#     Parameters: PreviewDF:      dataframe:  dataframe for reading unique values
#                 prevQueryCols:  dict:       cache for previous queries      
#                 selected_col:   str:        selected column
#                 selected_page:  int:        selected page
#                 rows_per_page:  int:        number of unique values per page
#     Returns:    list:   list of unique values
# def GenPageData(PreviewDF, prevQueryCols, selected_col, selected_page, rows_per_page):
#     if not selected_col in prevQueryCols:
#         prevQueryCols[selected_col] = list(pd.unique(PreviewDF[selected_col]))

#     total_records = len(prevQueryCols[selected_col])
#     total_pages = int(np.ceil(total_records/rows_per_page))
#     if selected_page > total_pages:
#         return []
#     startIdx = (selected_page - 1) * rows_per_page
#     endIdx = min(total_records, startIdx + rows_per_page)
#     return prevQueryCols[selected_col][startIdx:endIdx]

# ------------------------------------------------------------------------------------------------------------------

# Encode(obj): 
#     Working:    Convert numpy data-types to python data-types
#     Parameters: obj:   any-data-type    : data to convert
#     Returns: converted-obj
# def Encode(obj):
#     if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
#                         np.int16, np.int32, np.int64, np.uint8,
#                         np.uint16, np.uint32, np.uint64)):

#         return int(obj)

#     elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
#         return float(obj)

#     elif isinstance(obj, (np.complex_, np.complex64, np.complex128)):
#         return {'real': obj.real, 'imag': obj.imag}

#     elif isinstance(obj, (np.ndarray,)):
#         return obj.tolist()

#     elif isinstance(obj, (np.bool_)):
#         return bool(obj)

#     elif isinstance(obj, (np.void)):
#         return None

#     else:
#         return obj

# ------------------------------------------------------------------------------------------------------------------

# GenPageHTML(df, Page, ROWS_PER_PAGE): 
#     Working:    Convert data-frame to html
#     Parameters:   df  :   dataframe   : data to convert
#                   Page:   int         : page number
#                   ROWS_PER_PAGE: int  : number of rows on each page  
#     Returns: converted-obj
# def GenPageHTML(df, Page, ROWS_PER_PAGE):
#     if Page > np.ceil(df.shape[0]/ROWS_PER_PAGE):
#         return ''
#     startRow = (Page-1) * ROWS_PER_PAGE
#     endRow = min(df.shape[0], startRow + ROWS_PER_PAGE)
#     return df.iloc[startRow: endRow][:].to_html(classes='mystyle')

# ------------------------------------------------------------------------------------------------------------------

# WriteDict_NaN_NoIndex(d, row, pref, data) : 
#     Working:    Writes data in dict by performing depth-first-search
#                 fills nan values with __FILL_MISSING_WITH
#                 No extra Index columns are added
#     Parameters: d:    Python-dict  
#                 row:    int     :to keep track of row in dict
#                 pref:   str     :to keep track of column-header
#                 data:   dict    :json-data
#     Returns: int : number of rows required to write data
# def WriteDict_NaN_NoIndex(d, row, pref, data):
#     reqRows = 0
#     if isListOfDict(data):
#         for x in data:
#             curRows = WriteDict_NaN_NoIndex(d, row, pref, x)
#             reqRows += curRows
#             row += curRows

#     elif type(data) is dict:

#         for x in data:
#             colName = str(x) if (pref == "") else (
#                 pref + __JOINER_CHAR + str(x))
#             if isScalar(data[x]):
#                 reqRows = max(reqRows, 1)
#                 towrt = str(data[x])
#                 if row not in d:
#                     d[row] = {}
#                 if towrt.isnumeric():
#                     d[row][colName] = data[x]
#                 else:
#                     d[row][colName] = towrt
#             else:
#                 reqRows = max(reqRows, WriteDict_NaN_NoIndex(
#                     d, row, colName, data[x]))
#     return reqRows

# ------------------------------------------------------------------------------------------------------------------

# fillNaN(df) :
#     Working:    Copies df.iloc[r-1, c] if df.iloc[r, c] is NaN
#     Parameters: df:    Pandas-dataframe 
#     Returns: None
# def fillNaN(df):
#     R, C = df.shape
#     r, c = 1, 0
#     while r < R:
#         c = 0
#         while c < C:
#             if pd.isnull(df.iloc[r, c]):
#                 df.iloc[r, c] = df.iloc[r-1, c]
#             c += 1
#         r += 1

# ------------------------------------------------------------------------------------------------------------------

# Write(cdf, row, pref, colTree, data, __NULL='null'):
#     Working:    Writes data in Pandas-dataframe by performing depth-first-search
#     Parameters: cdf:    Pandas-dataframe   
#                 row:    int     :to keep track of row in df 
#                 pref:   str     :to keep track of column-header
#                 colTree:dict    :table-schema to perform dfs
#                 data:   dict    :json-data
#                 __NULL: str     :used to fill missing-values
#     Returns:None
# def Write(cdf, row, pref, colTree, data, __NULL='null'):
#     if isListOfDict(data):
#         for x in data:
#             Write(cdf, row, pref, colTree, x, __NULL)
#             row = len(cdf)

#     elif type(data) is dict:
#         for x in colTree[pref]:
#             colName = str(x)  # if (pref=="")  else (pref + '.' + str(x) )
#             # Name of col without prefix
#             noPreCol = x[1 + len(pref) if pref != "" else len(pref):]
#             # Available cols
#             if not colName in colTree:
#                 if not noPreCol in data:
#                     cdf.loc[row, colName] = __NULL
#                     continue

#                 towrt = str(data[noPreCol])
#                 if towrt.isnumeric():
#                     cdf.at[row, colName] = data[noPreCol]
#                 else:
#                     cdf.at[row, colName] = towrt
#             else:
#                 if not noPreCol in data:
#                     Write(cdf, row, colName, colTree, {}, __NULL)
#                 else:
#                     Write(cdf, row, colName, colTree, data[noPreCol], __NULL)

#------------------------------------------------------------------------------------------------------------------

# WriteToDF(cdf, data, colTree) :
#     Working:    Writes data in Pandas-dataframe by calling Write
#     Parameters: cdf:    Pandas-dataframe   
#                 colTree:dict    :table-schema to perform dfs
#                 data:   dict    :json-data
#     Returns: None
# def WriteToDF(cdf, data, colTree):
#     Write(cdf, 0, '', colTree, data, __NULL='null')

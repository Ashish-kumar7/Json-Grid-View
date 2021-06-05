import json
import urllib.request
import numpy as np

# HIDDEN CONSTANTS
__callVar = 0
__NULL = ''
__SAME = '__SAME__'


# loads json from url
def load_url_json(URL):
    try:
        req = urllib.request.urlopen(URL)
        json_data = json.load(req)
        return (True, json_data)
    except:
        return (False, "Failed to load json from url!!!")

# fills missing entries into the json object


def fill_missing(data, __NULL=''):
    if type(data) is dict:
        for x in data:
            fill_missing(data[x], __NULL)
        return

    if type(data) is list:
        flag = True
        for x in data:
            if not type(x) is dict:
                flag = False
                break
        if not flag:
            return

        columns = set()
        for x in data:
            fill_missing(x, __NULL)
            for y in x:
                columns.add(y)

        for x in data:
            for y in columns:
                if y not in x:
                    x[y] = __NULL
    return None

# utility to tell if data is list of dictionaries


def isListOfDict(data):
    if not type(data) is list:
        return False
    for x in data:
        if not type(x) is dict:
            return False
    return True

# utility to tell if data is scalar value


def isScalarData(data):
    if data == None:
        return True
    return np.isscalar(data)

# utility to tell if data is scalar(non-iterable) list ie. [[] ,[] ,[]]


def isScalarList(data):
    if not type(data) is list:
        return False
    return not isListOfDict(data)

# utility to tell if data is


def isScalar(data):
    return isScalarData(data) or isScalarList(data)

# gen_hash_schema_helper to fill Hashtable and generate table Schema


def gen_hash_schema_helper(data, hash):
    global __callVar
    tr, tc = 0, 0
    hash.append((tr, tc))  # temporary
    current_call = __callVar
    colList = []
    if isListOfDict(data):
        for x in data:
            __callVar += 1
            cnode = gen_hash_schema_helper(x, hash)
            tr += cnode[0]
            tc = max(tc, cnode[1])
            if len(colList) == 0:
                colList = cnode[2]
    elif type(data) is dict:
        for x in data:
            if isScalar(data[x]):
                tc += 1
                tr = max(tr, 1)
                colList.append(x)
            else:
                __callVar += 1
                cnode = gen_hash_schema_helper(data[x], hash)
                tc += cnode[1]
                tr = max(tr, cnode[0])
                for col in cnode[2]:
                    colList.append(str(x) + '.' + str(col))
    hash[current_call] = (tr, tc)
    print("\n"*3,current_call,  "hash = " , hash)
    return (tr, tc, colList)


def dfsHash(data):
    global __callVar
    __callVar = 0
    hash = []
    tr, tc, col_list = gen_hash_schema_helper(data, hash)
    return col_list, hash


# fill the dataframe using helper function

def fill_data_frame_helper(data, rinc, cinc, df, hash):
    global __callVar
    if isListOfDict(data):
        for x in data:
            __callVar += 1
            tcall = __callVar
            fill_data_frame_helper(x, rinc, cinc, df, hash)
            rinc += hash[tcall][0]

    elif type(data) is dict:
        for x in data:
            if isScalar(data[x]):
                towrt = str(data[x])
                if towrt.isnumeric():
                    df.iat[rinc, cinc] = data[x]
                else:
                    df.iat[rinc, cinc] = towrt
                cinc += 1
            else:
                __callVar += 1
                tcall = __callVar
                fill_data_frame_helper(data[x], rinc, cinc, df, hash)
                cinc += hash[tcall][1]


def fill_data_frame(data, rinc, cinc, df, hash):
    global __callVar
    __callVar = 0
    fill_data_frame_helper(data, rinc, cinc, df, hash)



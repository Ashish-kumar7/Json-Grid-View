# from pyspark.sql import SparkSession

# import os
# os.environ["HADOOP_USER_NAME"] = "hdfs"
# os.environ["PYTHON_VERSION"] = "3.5.2"
# os.environ["JAVA_HOME"] = "C:\Progra~1\Java\jdk-12.0.1"
# os.environ["SPARK_HOME"] = "C:\Spark"

# sparkSession = SparkSession.builder.appName("example-pyspark-read-and-write").getOrCreate()
# sc = sparkSession.sparkContext
# # Create data
# data = [('First', 1), ('Second', 2), ('Third', 3), ('Fourth', 4), ('Fifth', 5)]
# df = sparkSession.createDataFrame(data)

# # Write into HDFS
# df.write.csv("hdfs://cluster/user/hdfs/test/example.csv")

# # Read from HDFS
# df_load = sparkSession.read.csv('hdfs://cluster/user/hdfs/test/example.csv')
# df_load.show()



# # importing the package
# from snakebite.client import Client
  
# # the below line create client connection to the HDFS NameNode
# client = Client('localhost', 9000)
  
# # create directories mentioned in mkdir() methods first argument i.e. in List format
# for p in client.mkdir(['/demo/demo1', '/demo2'], create_parent=True):
#             print(p)

# from hdfs import InsecureClient
# client = InsecureClient('http://host:port', user='ann')

# from json import dump, dumps
# records = [
#   {'name': 'foo', 'weight': 1},
#   {'name': 'bar', 'weight': 2},
# ]

# # As a context manager:
# with client.write('data/records.jsonl', encoding='utf-8') as writer:
#   dump(records, writer)

# # Or, passing in a generator directly:
# client.write('data/records.jsonl', data=dumps(records), encoding='utf-8')

# import requests
# from json import dumps
# params = (
# ('op', 'CREATE')
# )
# data = dumps("file")  # some file or object - also tested for pickle library
# response = requests.put('http://localhost:9000/path', params=params, data=data)

# import requests

# params = (
#     ('op', 'CREATE'),
# )

# response = requests.put('https://localhost:50070', params=params, )


# This code is for hdfs 
import subprocess

hdfs_cmd = "hadoop fs -put sample2.json /hbase/trial"

subprocess.call(hdfs_cmd, shell=True)
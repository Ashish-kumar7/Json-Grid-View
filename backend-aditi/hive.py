# import pyodbc

# import pandas as pd 

# with pyodbc.connect("DSN=Hive", autocommit=True) as conn:
    
#     print("connect")

# from pyspark import SparkContext, SparkConf
# from pyspark.sql import SQLContext
# from pyspark.sql import Row
# from pyspark.sql import HiveContext
# from pyspark.sql.functions import *

# hive_context = HiveContext(sc)
# sqlContext = SQLContext(sc)

import os
import pandas as pd
os.environ["JAVA_HOME"] = "C:\Progra~1\Java\jdk-12.0.1"
os.environ["SPARK_HOME"] = "C:\Spark"
import findspark
findspark.init()

from pyspark.sql import SparkSession
spark = SparkSession.builder \
    .master("local[*]") \
    .appName("Learning_Spark") \
    .getOrCreate()
# spark = SparkSession.builder \
#  .appName('Hi there') \
#  .master('spark://n.n.n.n:7077') \
#  .enableHiveSupport() \
#  .config('spark.sql.hive.thriftServer.singleSession', True) \
#  .getOrCreate()

sc = spark.sparkContext

# from pyspark.sql import Row
# from pyspark.sql import HiveContext
# sqlContext = HiveContext(sc)
# test_list = [('A', 25),('B', 20),('C', 25),('D', 18)]
# rdd = sc.parallelize(test_list)
# people = rdd.map(lambda x: Row(name=x[0], age=int(x[1])))
# schemaPeople = sqlContext.createDataFrame(people)
# # Register it as a temp table
# sqlContext.registerDataFrameAsTable(schemaPeople, "test_table")
# sqlContext.sql("show tables").show()

# sqlContext.sql("Select * from test_table").show()

from pyspark.sql import HiveContext
hiveCtx = HiveContext(sc)
df = hiveCtx.read.option("multiLine","true").json("sample2.json")
df.printSchema()
# df.write.csv("hdfs://cluster/user/hdfs/test/example.csv")
# df_load = spark.read.csv('hdfs://cluster/user/hdfs/test/example.csv')
# df_load.show()
df.write.save('file', format='parquet', mode='append')
from pyspark.sql import SQLContext
sqlContext = SQLContext(sc)
print("hhh")
sqlContext.read.format('parquet').load('file') 
# import subprocess

# hdfs_cmd = "hadoop fs -put file /hbase/file"

# subprocess.call(hdfs_cmd, shell=True)
print("hhh")
from pyspark.sql import functions as sf

# df.withColumn("address", sf.explode(sf.col("address"))).select("address.city").show()
df1 = df.withColumn("number", sf.explode(sf.col("phoneNumbers"))).drop("phoneNumbers")

df2 = df1.select("address.*","age","firstName","gender","lastName","number.*")
df2.show()
# df.to_csv("file2.csv")
# csv = spark.read.csv('/spark-warehouse/file2.csv')
# print(type(csv))

# df2.write.saveAsTable("sample")
# spark.sql("select * from sample").show()
# df2.write.format("avro").save("/zipcodes.avro")
# df2.write.parquet("/tmp/zipcodes.parquet")
# import org.apache.spark.sql.hive.HiveContext;

# HiveContext sqlContext = new org.apache.spark.sql.hive.HiveContext(sc.sc())
# df2.write().mode("overwrite").saveAsTable("schemaName.tableName")


# df_pd = df2.toPandas()

# # Store result
# df_pd.to_csv("/content/pandas_preprocessed_data.csv")
# ex1.registerTempTable("ex1")
# results = hiveCtx.sql("SELECT firstName FROM ex1").show()

# import os
# from os.path import abspath
# os.environ["JAVA_HOME"] = "C:\Progra~1\Java\jdk-12.0.1"
# os.environ["SPARK_HOME"] = "C:\Spark"
# import findspark
# findspark.init()
# from pyspark.sql import SparkSession
# from pyspark.sql import Row
# # $example off:spark_hive$


# if __name__ == "__main__":
#     # $example on:spark_hive$
#     # warehouse_location points to the default location for managed databases and tables
#     warehouse_location = abspath('spark-warehouse')

#     spark = SparkSession \
#         .builder \
#         .appName("Python Spark SQL Hive integration example") \
#         .config("spark.sql.warehouse.dir", warehouse_location) \
#         .enableHiveSupport() \
#         .getOrCreate()

#     # spark is an existing SparkSession
#     spark.sql("CREATE TABLE src (key INT, value STRING) USING hive")
#     spark.sql("LOAD DATA LOCAL INPATH 'examples/src/main/resources/kv1.txt' INTO TABLE src")

#     # Queries are expressed in HiveQL
#     spark.sql("SELECT * FROM src").show()
#     # +---+-------+
#     # |key|  value|
#     # +---+-------+
#     # |238|val_238|
#     # | 86| val_86|
#     # |311|val_311|
#     # ...

#     # Aggregation queries are also supported.
#     spark.sql("SELECT COUNT(*) FROM src").show()
#     # +--------+
#     # |count(1)|
#     # +--------+
#     # |    500 |
#     # +--------+

#     # The results of SQL queries are themselves DataFrames and support all normal functions.
#     sqlDF = spark.sql("SELECT key, value FROM src WHERE key < 10 ORDER BY key")

#     # The items in DataFrames are of type Row, which allows you to access each column by ordinal.
#     stringsDS = sqlDF.rdd.map(lambda row: "Key: %d, Value: %s" % (row.key, row.value))
#     for record in stringsDS.collect():
#         print(record)
#     # Key: 0, Value: val_0
#     # Key: 0, Value: val_0
#     # Key: 0, Value: val_0
#     # ...

#     # You can also use DataFrames to create temporary views within a SparkSession.
#     Record = Row("key", "value")
#     recordsDF = spark.createDataFrame([Record(i, "val_" + str(i)) for i in range(1, 101)])
#     recordsDF.createOrReplaceTempView("records")

#     # Queries can then join DataFrame data with data stored in Hive.
#     spark.sql("SELECT * FROM records r JOIN src s ON r.key = s.key").show()
#     # +---+------+---+------+
#     # |key| value|key| value|
#     # +---+------+---+------+
#     # |  2| val_2|  2| val_2|
#     # |  4| val_4|  4| val_4|
#     # |  5| val_5|  5| val_5|
#     # ...
#     # $example off:spark_hive$

#     spark.stop()
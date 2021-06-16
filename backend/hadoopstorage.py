import os
import pandas as pd

# Add the appropriate locations of the Hadoop and Java.

os.environ["JAVA_HOME"] = "C:\Progra~1\Java\jdk-12.0.1"
os.environ["SPARK_HOME"] = "C:\Spark"

# os.environ["JAVA_HOME"] = "C:/Progra~1/Java/jdk1.8.0_65"
# os.environ["SPARK_HOME"] = "E:/hadoop-env/spark-3.0.2-bin-hadoop2.7"

import findspark
findspark.init()

from pyspark.sql import SparkSession
spark = SparkSession.builder \
    .master("local[*]") \
    .appName("Learning_Spark") \
    .getOrCreate()

from pyspark.sql import HiveContext
sc = spark.sparkContext
hiveCtx = HiveContext(sc)

# 1. convert into csv than load it using spark and save the dataframe into hdfs
# 2. save the csv file into hdfs
# 3. directly store data frame into hdfs 

def saveFile(DF):
    # df = spark.createDataFrame(DF)
    # DF.to_csv('test.csv')
    df = spark.read.format('csv') \
                .option('header',True) \
                .option('multiLine', True) \
                .load('test.csv')

    # add the appropriate localhost URL

    df.write.format("parquet").mode("overwrite").save("hdfs://localhost:9000/testFile.parquet")
    df_load = spark.read.load('hdfs://localhost:9000/testFile.parquet')
    # df.write.format("parquet").mode("overwrite").save("hdfs://0.0.0.0:19000/testFile1.parquet")
    # df_load = spark.read.load('hdfs://0.0.0.0:19000/testFile1.parquet')
    df_load.show()

# string - long data type error
# def sqlQuery(query,DF):
#     PDF =spark.createDataFrame(DF)
#     PDF.createOrReplaceTempView("table1")
#     PDF = spark.sql(query)
#     return PDF.toPandas()

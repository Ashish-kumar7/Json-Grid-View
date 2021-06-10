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
    df.write.format("parquet").mode("overwrite").save("hdfs://localhost:9000/testFile.parquet")
    df_load = spark.read.load('hdfs://localhost:9000/testFile.parquet')
    df_load.show()
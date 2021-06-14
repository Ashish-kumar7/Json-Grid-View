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

df = spark.read.csv('saved_file.csv')
print(type(df))
df.show()
# df.write.format("ORC").saveAsTable("db_bdp")

df1 = spark.read.format('csv') \
                .option('header',True) \
                .option('multiLine', True) \
                .load('saved_file.csv')
df1.show()
# df.write.saveAsTable("table1")
# df.write.format("ORC").save("table2")
# df.write.save('file', format='parquet', mode='append')
# df.write.csv("hdfs://localhost:9000/example.csv")
# Read from HDFS
df_load = spark.read.csv('hdfs://localhost:9000/example.csv')
df_load.show()
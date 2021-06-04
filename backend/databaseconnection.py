import os
os.environ["SPARK_HOME"] = "E:/hadoop-env/spark-3.0.2-bin-hadoop2.7"

import findspark
findspark.init()
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
from pyspark.sql import HiveContext

def save_to_hive(df):
	spark = SparkSession.builder.appName("DF from Nested JSON").getOrCreate()
	print(spark.sparkContext.appName)

	df.replace('', None).show()

	sc = spark.sparkContext
	sqlContext = HiveContext(sc)

	# Save df to a new table in Hive
	df.write.mode("overwrite").saveAsTable("test_table")
	print("Data saved in Hive!")

    #show all tables in Hive
	print("Showing all tables in Hive:")
	sqlContext.sql("show tables").show()

    #Show data from table in hive
	print("Showing data from Hive:")
	sqlContext.sql("Select * from test_table").show()

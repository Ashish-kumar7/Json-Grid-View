import os 

import pandas as pd

from subprocess import PIPE, Popen


# define path to saved file
file_name = "saved_file.csv"

# create a pandas.DataFrame
sales = {'account': ['Jones LLC', 'Alpha Co', 'Blue Inc'], 'Jan': [150, 200, 50]}
df = pd.DataFrame.from_dict(sales)

# save your pandas.DataFrame to csv (this could be anything, not necessarily a pandas.DataFrame)
df.to_csv(file_name)

# create path to your username on hdfs
print(os.sep)
hdfs_path = os.path.join(os.sep, 'user', 'Aditi ', file_name)

# put csv into hdfs
put = Popen(["hadoop", "fs", "-put", file_name, hdfs_path], stdin=PIPE, bufsize=-1)
put.communicate()
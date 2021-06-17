# Json-Grid-View

This project fetches the JSON in different ways and parses it into tabular form and saves it into HDFS.

<details>
	  <summary>Requirements to run the project</summary>

	  > 1. node
	  > 2. python
	  > 3. java(Optional)
	  > 4. hadoop(Optional)
</details>



<details>
  <summary>Installation</summary>
  
  
	> 1. Download Zip file and Extract it

	**Install python libraries**
	> 2. Open new cmd window
	> 3. cd *path to extracted Json-Grid-View folder*
	> 5. cd backend 
	> 5. pip install -r requirements.txt

	**Install Node**
	  Step 1: Download Node.js Installer
	    In a web browser, navigate to https://nodejs.org/en/download/. 
	    Click the Windows Installer button to download the latest default version. The Node.js installer includes the NPM package manager.

	Step 2: Install Node.js and NPM from Browser
	  1. Once the installer finishes downloading, launch it. 
	     Open the downloads link in your browser and click the file. Or, browse to the location where you have saved the file and double-click it to launch.

	  2. The system will ask if you want to run the software – click Run.

	  3. You will be welcomed to the Node.js Setup Wizard – click Next.

	  4. On the next screen, review the license agreement. Click Next if you agree to the terms and install the software.

	  5. The installer will prompt you for the installation location. Leave the default location, unless you have a specific need to install it somewhere else – then click Next.

	  6. The wizard will let you select components to include or remove from the installation. Again, unless you have a specific need, accept the defaults by clicking Next.

	  7. Finally, click the Install button to run the installer. When it finishes, click Finish.

	Step 3: Verify Installation
	  Open a command prompt (or PowerShell), and enter the following:

		node -v
		The system should display the Node.js version installed on your system. 

		npm -v
		The system should display the npm version installed on your system.

	<details>
		  <summary>Install Hadoop and Java</summary>
		  Install Hadoop 2.9.1 on Windows 10 platform. (Setting up a Single Node Hadoop Cluster)

		  Prerequistes:
		  JAVA: You need to install the Java 8 package on your system.
		  HADOOP: You require Hadoop 2.9.1 package.

		  Step 1. Download the hadoop 2.9.1 from the link provided below:
		  Hadoop Download Link: https://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-2.9.1/hadoop-2.9.1.tar.gz

		  Step 2. Create a folder path as below and copy the downloaded msi into this folder.
		  Path: ‘C:/Hadoop/hadoop-2.9.1’

		  Step 3.Then download the windows compatible binaries from the git hub repo.
		  Link:- https://github.com/ParixitOdedara/Hadoop

		  Step 4.Extract the zip and copy all the files present under bin folder to C:\Hadoop\hadoop-2.9.1\bin.
		  Replace the existing files as well.
		  Go to C:/Hadoop/hadoop-2.9.1 and create a folder ‘data’. 
		  Inside the ‘data’ folder create two folders ‘datanode’ and ‘namenode’.

		  Step 5.Now Setting up the Environment Variables for your Machine.
		  To set these variables, go to My Computer or This PC. 
		  Right click --> Properties --> Advanced System settings --> Environment variables.
		  Click New to create a new environment variables.

		  Environment variables to be set:

		  HADOOP_HOME=”C:\Hadoop\hadoop-2.9.1″
		  HADOOP_BIN=”C:\Hadoop\hadoop-2.9.1\bin”
		  JAVA_HOME=<JDK installation location>”

		  Just to validate the above setting, open new cmd and check the output.
		  -- echo %HADOOP_HOME%
		      This should return "C:\Hadoop\hadoop-2.9.1".
		  -- echo %HADOOP_BIN%
		      This should return "C:\Hadoop\hadoop-2.9.1\bin".

		  To configure the hadoop on Windows10 we have to edit below mention files in the extracted location.

		      1. hadoop-env.cmd
		      2. core-site.xml
		      3. hdfs-site.xml
		      4. mapred-site.xml

		  Step 6.Edit hadoop-env.cmd
		  File location:- C:\Hadoop\hadoop-2.9.1\etc\hadoop\hadoop-env.cmd
		  Need to add:-
		      set HADOOP_PREFIX=%HADOOP_HOME%
		      set HADOOP_CONF_DIR=%HADOOP_PREFIX%\etc\hadoop
		      set YARN_CONF_DIR=%HADOOP_CONF_DIR%
		      set PATH=%PATH%;%HADOOP_PREFIX%\bin

		  Step 7.Edit core-site.xml
		  File Location:- C:\Hadoop\hadoop-2.9.1\etc\hadoop\core-site.xml 
		  Need to add:-
		  ( content within <configuration> </configuration> tags.)
		   <configuration>
		     <property>
		       <name>fs.default.name</name>
		       <value>hdfs://0.0.0.0:19000</value>
		     </property>
		  </configuration>

		  Step 8.Edit hdfs-site.xml 
		  File Location:- C:\Hadoop\hadoop-2.9.1\etc\hadoop\hdfs-site.xml.
		  Need to add:- 
		      (below content within <configuration> </configuration> tags.)
		   <configuration>
		     <property>
			<name>dfs.replication</name>
			<value>1</value>
		     </property>
		     <property>
			<name>dfs.namenode.name.dir</name>
			<value>C:\Hadoop\hadoop-2.9.1\data\namenode</value>
		     </property>
		     <property>
			<name>dfs.datanode.data.dir</name>
			<value>C:\Hadoop\hadoop-2.9.1\data\datanode</value>
		     </property>
		  </configuration>

		  Step 9.Edit mapred-site.xml
		  File location:- C:\Hadoop\hadoop-2.9.1\etc\hadoop\mapred-site.xml
		  Need to add:- 
		      (below content within <configuration> </configuration> tags. 
		      If you don’t see mapred-site.xml then open mapred-site.xml.template file 
		      and rename it to mapred-site.xml )
		   <configuration>
		     <property>
			<name>mapreduce.job.user.name</name>
			<value>%USERNAME%</value>
		     </property>
		     <property>
			<name>mapreduce.framework.name</name>
			<value>yarn</value>
		     </property>
		     <property>
			<name>yarn.apps.stagingDir</name>
			<value>/user/%USERNAME%/staging</value>
		     </property>
		     <property>
			<name>mapreduce.jobtracker.address</name>
			<value>local</value>
		     </property>
		  </configuration>

		  Step 10.Additional Configuration:- 

		  Check if:
		      C:\Hadoop\hadoop-2.9.1\etc\hadoop\slaves file is present, 
		      if that file not available create the file called slave and insert localhost.

		  Note:
		      One most common issue one can get is illegal character Exception.
		      This occurs when someone has a space in the name of their PC.
		      In this we need to open the hadoop-env.cmd and do the following changes.

		      File location:- C:\Hadoop\hadoop-2.9.1\etc\hadoop\hadoop-env.cmd
		      set HADOOP_IDENT_STRING="The name of your PC without Spacebar"

		  Step 11.Node formatting
		  To format the node, open the cmd and execute the below command:
		      --hadoop namenode -format

		  Step 12.To enable the hadoop open the CMD as Administrator and type below command. 
		      -- start-all.cmd
		      It will open 4 new windows cmd terminals for 4 daemon processes, namely :
		      --namenode
		      --datanode
		      --nodemanager
		      --resourcemanager

		  -- To access Resource Manager go to http://localhost:8088 from your web browser.

		  -- To access Node Manager go to http://localhost:8042 from your web browser.

		  -- To access Name Node go to  http://localhost:50070 from your web browser.

		  -- To access Data Node go to http://localhost:50075 from your web browser.


		  Reference :- https://hadoop.apache.org/
	  </details>
  </details>
	
<details>
	<summary>How to Run</summary>

	**Run Backend**
	> 1. Open a new cmd window
	> 2. cd *path to Json-Grid-View folder*
	> 3. cd backend
	> 4. python App.py

	**Run Frontend**
	> 5. Open a new cmd window
	> 6. cd *path to Json-Grid-View folder*
	> 7. cd frontend
	> 8. npm install
	> 9. npm start

	Json-Grid-View should automatically open in your browser, if it doesn't enter http://localhost:3000/ in your browser!!!
</details>
# Features

**There are three different ways to parse the JSON**
- via URL
- via JSON in text box
- via JSON file upload


![Finished App](UI.gif)

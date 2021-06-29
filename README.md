# Json-Grid-View

This project fetches the JSON in different ways and parses it into tabular form and saves it into HDFS.

### Steps to generate production application: [Link](docs/electronProduction.md)

<details>
	  <summary>Requirements to run the project</summary>

	  > 1. node
	  > 2. python
	  > 3. java(Optional)
	  > 4. hadoop(Optional)
</details>

### Installation Steps: [Link](docs/installation.md)

	
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

### Excel Functionality
![Gif](Screenshots/excel.gif)
	
### Homepage
![Screenshot](Screenshots/homepage.png)

### Upload Json
**There are three different ways to parse the JSON**

![Screenshot](Screenshots/uploadJson.png)
	
- via URL
- via JSON in text box
- via JSON file upload
	
<p float="left">
  <img src="Screenshots/uploadJsonFile.png" width="32%" />
  <img src="Screenshots/jsonUrl.png" width="32%" /> 
  <img src="Screenshots/jsonEditor.png" width="32%" />
</p>

### Customize Table
**User can customize the table using the CustomizeTable Page**

![Screenshot](Screenshots/customizeTable.png)

### New Preview Page
![Screenshot](Screenshots/newPreviewPage.png)
<!-- ### Preview of the table generated 
- implemented paging for large files
<p float="left">
  <img src="Screenshots/tablePreviewPage1.png" width="49%" />
  <img src="Screenshots/tablePreviewPage2.png" width="49%" /> 
</p> -->

<!-- ### Perform Queries using UI
- Select columns to load unique values of selected column
- Select from unique values (implemented paging)
- Enter text in SearchBox to perform a StartsWith search on selected column

<p float="left">
  <img src="Screenshots/uiQuery.png" width="49%" />
  <img src="Screenshots/uiQuerySelected.png" width="49%" /> 
</p>

**Click Query to generate preview after performing query**
	
<p float="left">
  <img src="Screenshots/clickUiQuery.png" width="49%" />
  <img src="Screenshots/uiQueryResults.png" width="49%" /> 
</p> -->
	
### Perform Queries using SQL
- Enter Sql and click fetch

<!-- <p float="left">
  <img src="Screenshots/sqlQueryPage.png" width="49%" />
  <img src="Screenshots/sqlQueryResult.png" width="49%" /> 
</p> -->

### Validate and Download corrected json
- Click 'Json Checker' in the nav-bar

![Screenshot](Screenshots/jsonValidator.png)

### Download Options
- User can download 
	- Normal Data, data as it is
	- Preview Data, data generated after querying.
	
### Formats available
- Download Xlsx file
- Download Csv file
- Save to Hadoop and Download Sql Db file
	

<!-- ![Screenshot](Screenshots/downloadOptions.png)
	
### Example download : Download without query, download after query

<p float="left">
  <img src="Screenshots/fullDataXlsx.png" width="49%" />
  <img src="Screenshots/queryDataXlsx.png" width="49%" /> 
</p> -->
	
### SQL table
	
![Screenshot](Screenshots/sqlData.png)
	

<!-- ![Finished App](UI.gif) -->

import "./NewPreviewPage.css";
import initialDataFrame from "../../global_variable";
import PaginationP from "../../components/pagination/Pagination";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import Navbar from "../../components/navbar/Navbar";
import { Row, Col, Container } from "react-bootstrap";
import Button from "../../components/button/Button";
import { ProgressBar } from "react-bootstrap";
import io from "socket.io-client";
import { useHistory } from "react-router";

// initialization of connection between server and client
const socket = io("http://localhost:5000/");
//used to download file after conversion
var FileDownload = require("js-file-download");

// Excel column properties
const defaultColumnProperties = {
  filterable: true,
  resizable: true,
  width: 120,
};

const selectors = Data.Selectors;

//Filter for excel
const { MultiSelectFilter } = Filters;

// function to handle autocomplete filter -  stores search value to process on whole data
const handleFilterChange = (filter) => (filters) => {
  initialDataFrame.searchColauto[filter.column.key] = filter.filterTerm;
  console.log(initialDataFrame.searchColauto);
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

// function to handle multiselect filter of excel
function getValidFilterValues(rows, columnId) {
  return rows
    .map((r) => r[columnId])
    .filter((item, i, a) => {
      return i === a.indexOf(item);
    });
}

// function for rows of excel
function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}

// styling of components using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  num: {
    marginLeft: "30%",
    marginRight: "30%",
    padding: "1%",
  },
  numval: {
    padding: "4%",
    marginLeft: "10%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root2: {
    "& div.react-grid-Header": {
      backgroundColor: "#212342",
    },
    "& div.react-grid-Canvas": {
      backgroundColor: "#212342",
    },
    "& div.react-grid-Main": {
      color: "white",
      backgroundColor: "#212342",
    },
    "& div.react-grid-Toolbar": {
      backgroundColor: "black",
    },
    "& button.btn": {
      backgroundColor: "yellow",
    },
    "& div.react-grid-HeaderCell": {
      color: "white",
      backgroundColor: "#212529",
    },
    "& div.react-grid-Cell": {
      backgroundColor: "#2c3034",
      "&:hover": {
        background: "blue",
      },
    },
    "& div.react-grid-Row": {
      "& div.react-grid-Cell": {
        backgroundColor: "#2c3034",
        "&:hover": {
          background: "black",
          cursor: "pointer",
        },
      },
    },
  },
}));

const NewPreviewPage = () => {
  // for re-rendering react components without reloading the page
  let [, setState] = useState();
  // store initial total number of records of dataframe
  const [resultTotalRecords, setResultTotalRecords] = useState(
    initialDataFrame.records
  );
  //store rows of excel for autocomplete filter
  const [gridRows, setGridRows] = useState(initialDataFrame.dfrow);
  //store rows of excel multiselect filter
  const [gridRows1, setGridRows1] = useState(initialDataFrame.dfrow);
  //store columns of excel for autocomplete filter
  const [gridCols, setGridCols] = useState(initialDataFrame.dfcol);
  //store columns of excel for multiselect filter
  const [gridCol1, setGridCol1] = useState(initialDataFrame.dfcol);
  //boolean variable to decide which filter to show on ui
  const [showFilter, setShowFilter] = useState(true);
  const [showFilter1, setShowFilter1] = useState(false);
  // initialization for using styling made using makeStyles
  const classes = useStyles();
  // filters for grid for autocomplete filter
  const [filters, setFilters] = useState({});
  const filteredRows = getRows(gridRows, filters);
  // filters for grid for multiselect filter
  const [filters2, setFilters2] = useState({});
  const filteredRows2 = getRows(gridRows, filters2);
  // store first 1000 rows of dataframe
  const [resultRows, setResultRows] = useState(initialDataFrame.rows);
  // store download content of file when received from backend
  const [downloadContent, setDownloadContent] = useState("");
  // Text to show on download button which changes depending upon the conversion chosen
  const [downloadText, setDownloadText] = useState("Download");
  // it stores extension of file to download
  const [fileExtension, setFileExtension] = useState("");
  // used to show and hide download button
  const [showDownload, setShowDownload] = useState(false);
  // variable to store percentage of progress bar
  const [uploadPercentage, setUploadPercentage] = useState(0);
  // once a button is clicked  it is used to set disable property for button
  const [disable, setDisable] = useState(false);
  // to change the button id to disableButton when disable variable is set true
  const [buttonId, setButtonId] = useState("uploadButton");
  // store query to perform on whole data
  const [query, setQuery] = useState("");
  // display table name for performing sql query
  const [tableName, setTableName] = useState(initialDataFrame.tableName);
  // to redirect to another page
  let history = useHistory();

  // checks if data is undefined (after reloading), it redirects to home page
  if (gridCols == undefined) {
    window.location.reload();
    history.push("/");
  }

  // for checking if page is reloaded or not - if reloaded display an alert
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  // function called when autocomplete filter button is clicked
  const filterhandler = () => {
    // sets the grid according to autocomplete filter
    const newCol2 = gridCols;
    for (var i = 0; i < gridCols.length; i++) {
      delete newCol2[i]["filterRenderer"];
    }
    setGridCols(newCol2);
    setGridCol1(newCol2);
    console.log(gridCols);
    setShowFilter(true);
    setShowFilter1(false);
    setState({});
  };

  // function called when multiselect filter button is clicked
  const filter1handler = () => {
    //sets the grid according to multiselect filter
    const newCol2 = gridCols;
    for (var i = 0; i < gridCols.length; i++) {
      newCol2[i]["filterRenderer"] = MultiSelectFilter;
    }
    setGridCol1(newCol2);
    console.log(gridCol1);
    setShowFilter1(true);
    setShowFilter(false);
    setState({});
  };

  // listening from backend to update progress bar value
  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  // page change function for df preview , called when page number is clicked from paging tab
  const onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    console.log("currentPage " + currentPage);
    // sends page number to backend
    const formData = new FormData();
    formData.set("page_number", currentPage);
    axios
      .post("http://localhost:5000/api/page", formData)
      .then((response) => {
        // receives 1000 records for the page number which was sent to backend
        setGridCols(response.data.tableCols);
        setGridCol1(response.data.tableCols);
        setGridRows(response.data.tableRows);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // this function is called when any of the convert button is clicked
  const handleConversion = (val) => {
    if (disable) {
      console.log("disable true");
    } else {
      setDisable(true);
      setButtonId("disableButton");
      setUploadPercentage(10);
      const formData = new FormData();
      formData.set("content_type", val);
      // formData.set("data_type" , dataType);
      if (val == "excel") {
        setFileExtension("output.xlsx");
        setDownloadText("Download Excel");
      } else if (val == "csv") {
        setFileExtension("output.csv");
        setDownloadText("Download CSV");
      } else {
        setFileExtension("output.db");
        setDownloadText("Download DB");
      }
      // send data according to button clicked
      axios
        .post("http://localhost:5000/api/convert", formData, {
          responseType: "blob",
        })
        .then((response) => {
          // receives file from backend to download
          setDisable(false);
          setButtonId("uploadButton");
          setUploadPercentage(100);
          setTimeout(() => {
            setUploadPercentage(0);
          }, 1000);
          
          console.log(response.data);
          setDownloadContent(response.data);
          setShowDownload(true);
        })
        .catch((err) => {
          setDisable(false);
          setButtonId("uploadButton");
          console.log(err);
          setUploadPercentage(0);
        });
    }
  };

  // function called when download button is clicked
  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  // stores query when it is typed on input box
  const queryhandler = (e) => {
    setQuery(e.target.value);
  };

  //function called when fetch button is clicked to get result of query
  const onFetchButtonClick = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("query_text", query);
    axios
      .post("http://localhost:5000/api/query", formData)
      .then((response) => {
        console.log(response);
        if (
          response.data &&
          response.data.message &&
          response.data.message.startsWith("Error")
        ) {
          alert(response.data.message);
        } else {
          setGridRows(response.data.tableRows);
          setGridCols(response.data.tableCols);
          setGridCol1(response.data.tableCols);
          setResultTotalRecords(response.data.total_records);
          setResultRows(response.data.rows_per_page);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // function called when reset button is clicked
  const resetHandler = () => {
    const formData = new FormData();
    formData.set("reset", "true");
    axios
      .post("http://localhost:5000/api/dataReset", formData)
      .then((response) => {
        //resets the data in grid to initial dataframe
        setGridRows(response.data.tableRows);
        setResultTotalRecords(response.data.total_records);
        setResultRows(response.data.rows_per_page);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // function for searching in whole data
  const searchhandler = () => {
    const formData = new FormData();
    // storing values selected in multiselect filter and sending it to backend to process on whole data
    var searchObj = {};
    try {
      var list = document.getElementsByClassName(
        "Select has-value is-clearable is-searchable Select--multi"
      );
      for (var i = 0; i < list.length; i++) {
        var input = list[i].getElementsByTagName("input");
        for (var j = 0; j < input.length - 1; j++) {
          var columnName = input[j].getAttribute("name").substring(7);
          if (!(columnName in searchObj)) searchObj[columnName] = new Set();
          searchObj[columnName].add(input[j].getAttribute("value"));
        }
      }

      // converting set to array to avoid problem in processing in backend
      for (let columnName in searchObj) {
        searchObj[columnName] = Array.from(searchObj[columnName]);
      }
    } catch (error) {
      console.log(error);
    }
    // send data according to filter selected
    if (showFilter) {
      formData.set("filter_type", "autoComplete");
      formData.set(
        "search_dict_auto",
        JSON.stringify(initialDataFrame.searchColauto)
      );
    } else {
      formData.set("filter_type", "multiSelect");
      formData.set("search_dict_multi", JSON.stringify(searchObj));
    }

    axios
      .post("http://localhost:5000/api/searchRecord", formData)
      .then((response) => {
        setGridRows(response.data.tableRows);
        setResultTotalRecords(response.data.total_records);
        setResultRows(response.data.rows_per_page);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="newpreview">
      <Navbar></Navbar>
      <div className="searchmenu">
        <p>
          After selecting the filters click here to search in all records and
          reset data to initial if needed.
        </p>
        <Row>
          <Col lg="11" className="left">
            <Row>
              <Col lg="1" xs="2">
                <Button
                  title={"Search"}
                  classId={"workButton"}
                  id={"btn2"}
                  clickFunc={searchhandler}
                ></Button>
              </Col>
              <Col lg="1" xs="2">
                <Button
                  title={"Reset"}
                  classId={"workButton"}
                  id={"btn1"}
                  clickFunc={resetHandler}
                ></Button>
              </Col>
              <Col lg="10 " xs="8">
                <Row>
                  <Col lg="8" xs="2"></Col>
                  <Col lg="2" xs="5">
                    <Button
                      title={"AutoComplete"}
                      classId={"filterButton"}
                      id={"btn3"}
                      clickFunc={filterhandler}
                    ></Button>
                  </Col>
                  <Col lg="2" xs="5">
                    <Button
                      title={"MultiSelect"}
                      classId={"filterButton"}
                      id={"btn3"}
                      clickFunc={filter1handler}
                    ></Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className={classes.root2}>
              {showFilter ? (
                <ReactDataGrid
                  columns={gridCols.map((c) => ({
                    ...c,
                    ...defaultColumnProperties,
                  }))}
                  rowGetter={(i) => filteredRows[i]}
                  rowsCount={filteredRows.length}
                  minHeight={480}
                  toolbar={<Toolbar enableFilter={true} />}
                  onAddFilter={(filter) =>
                    setFilters(handleFilterChange(filter))
                  }
                  onClearFilters={() => setFilters({})}
                  getValidFilterValues={(columnKey) =>
                    getValidFilterValues([], columnKey)
                  }
                  onColumnResize={(idx, width) =>
                    console.log(`Column ${idx} has been resized to ${width}`)
                  }
                />
              ) : (
                <></>
              )}
              {showFilter1 ? (
                <ReactDataGrid
                  columns={gridCol1.map((c) => ({
                    ...c,
                    ...defaultColumnProperties,
                  }))}
                  rowGetter={(i) => filteredRows2[i]}
                  rowsCount={filteredRows2.length}
                  minHeight={456}
                  toolbar={<Toolbar enableFilter={true} />}
                  onAddFilter={(filter) =>
                    setFilters2(handleFilterChange(filter))
                  }
                  onClearFilters={() => setFilters2({})}
                  getValidFilterValues={(columnKey) =>
                    getValidFilterValues(gridRows1, columnKey)
                  }
                  onColumnResize={(idx, width) =>
                    console.log(`Column ${idx} has been resized to ${width}`)
                  }
                />
              ) : (
                <></>
              )}
            </div>
            <div className={classes.num}>
              <PaginationP
                key={resultTotalRecords}
                totalRecords={resultTotalRecords}
                pageLimit={resultRows}
                pageNeighbours={1}
                onPageChanged={onPageChanged}
              />
            </div>

            <Container className="queryInside">
              <Row>
                <Row className="query">
                  <form>
                    <label>Table-name: {tableName}</label>
                    <input
                      type="text"
                      placeholder="Type your SQL query"
                      onChange={(event) => queryhandler(event)}
                    />
                    <button onClick={onFetchButtonClick}>Fetch</button>
                  </form>
                </Row>
              </Row>
            </Container>
          </Col>
          <Col lg="1" className="right">
            <Container>
              <Row>
                <Col lg="12" sm="4" xs="4">
                  <Button
                    title={"Convert to Excel"}
                    classId={buttonId}
                    clickFunc={() => handleConversion("excel")}
                  ></Button>
                </Col>
                <Col lg="12" sm="4" xs="4">
                  <Button
                    title={"Convert To CSV"}
                    classId={buttonId}
                    clickFunc={() => handleConversion("csv")}
                  ></Button>
                </Col>
                <Col lg="12" sm="4" xs="4">
                  <Button
                    title={"Convert To DB"}
                    classId={buttonId}
                    clickFunc={() => handleConversion("hive")}
                  ></Button>
                </Col>
              </Row>
            </Container>
            {uploadPercentage > 0 && (
              <div className="progressbar">
                <ProgressBar
                  now={uploadPercentage}
                  striped={true}
                  animated
                  label={`${uploadPercentage}%`}
                  variant="success"
                />
              </div>
            )}
            {showDownload ? (
              <Button
                title={downloadText}
                classId={"downloadButton"}
                clickFunc={downloadFile}
              ></Button>
            ) : (
              <p></p>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NewPreviewPage;

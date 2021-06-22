import "./NewPreviewPage.css";
import SplitPane, { Pane } from "react-split-pane";
import initialDataFrame from "../../global_variable";
import PaginationP from "../../components/pagination/Pagination";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Dropdown } from "semantic-ui-react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import Navbar from "../../components/navbar/Navbar";
import { Row, Col, Container } from "react-bootstrap";
import Button from "../../components/button/Button";
import IconBox from "../../components/iconbox/IconBox";
import {
  faDatabase,
  faFileCsv,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import io from "socket.io-client";

const socket = io("http://localhost:5000/");

var FileDownload = require("js-file-download");

// const columns = initialDataFrame.dfcol;

// const rows = initialDataFrame.dfrow;

const defaultColumnProperties = {
  filterable: true,
  width: 120,
};

const selectors = Data.Selectors;

const { AutoCompleteFilter, MultiSelectFilter } = Filters;

const handleFilterChange = (filter) => (filters) => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getValidFilterValues(rows, columnId) {
  return rows
    .map((r) => r[columnId])
    .filter((item, i, a) => {
      return i === a.indexOf(item);
    });
}

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}

// style
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  num: {
    // color:'black',
    // backgroundColor:'#00b0ff',
    marginLeft: "30%",
    marginRight: "30%",
    padding: "1%",
  },
  numval: {
    padding: "4%",
    marginLeft: "10%",
  },
  root2: {
    "& div.react-grid-Header": {
      // borderColor: "white",
      backgroundColor: "#212342",
    },
    "& div.react-grid-Canvas": {
      // borderColor: "white",
      backgroundColor: "#212342",
    },
    "& div.react-grid-Main": {
      // outlineColor:"yellow",
      color: "white",
      backgroundColor: "#212342",
      // color: theme.palette.text.color
    },
    "& div.react-grid-Toolbar": {
      backgroundColor: "black",
      // borderColor: "yellow",
      // color: theme.palette.text.color
    },
    "& button.btn": {
      backgroundColor: "yellow",
      // color: theme.palette.text.color
    },
    "& div.react-grid-HeaderCell": {
      color: "white",
      backgroundColor: "#212529",

      // color: theme.palette.text.color
    },
    "& div.react-grid-Cell": {
      backgroundColor: "#2c3034",
      "&:hover": {
        background: "blue",
      },
      // color: theme.palette.text.color
    },
    "& div.react-grid-Row": {
      "& div.react-grid-Cell": {
        backgroundColor: "#2c3034",
        "&:hover": {
          background: "black",
          cursor: "pointer",
        },
      },

      // color: theme.palette.text.color
    },
  },
}));

const NewPreviewPage = () => {
  // console.log("new preview page");
  // console.log(initialDataFrame.dfrow);
  let [, setState] = useState();
  const [resultTotalRecords, setResultTotalRecords] = useState(
    initialDataFrame.records
  );
  const [selectedPage, setSelectedPage] = useState(1);
  const [gridRows, setGridRows] = useState(initialDataFrame.dfrow);
  const [gridRows1, setGridRows1] = useState(initialDataFrame.dfrow);
  const [gridCols, setGridCols] = useState(initialDataFrame.dfcol);
  const [gridCol1, setGridCol1] = useState(initialDataFrame.dfcol);

  const [showFilter, setShowFilter] = useState(true);
  const [showFilter1, setShowFilter1] = useState(false);

  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const filteredRows = getRows(gridRows, filters);
  const [filters2, setFilters2] = useState({});
  const filteredRows2 = getRows(gridRows, filters2);
  // const [table, setTable] = useState(initialDataFrame.df);

  // console.log(resultTotalRecords);
  const [resultRows, setResultRows] = useState(initialDataFrame.rows);
  let colWithIdx = [];
  const [selectedIndex, setSelectedIndex] = useState(1);

  const [downloadContent, setDownloadContent] = useState("");
  const [downloadText, setDownloadText] = useState("Download");
  const [fileExtension, setFileExtension] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [disable ,setDisable ]= useState(false);
  const [buttonId,setButtonId] = useState("uploadButton");

  const [query,setQuery] = useState("");
  const [fetchClicked, setFetchClicked] = useState(false);

  const filterhandler = () => {
    const newCol2 = gridCols;
    for (var i = 0; i < gridCols.length; i++) {
      delete newCol2[i]["filterRenderer"];
    }
    setGridCols(newCol2);
    console.log(gridCols);
    setShowFilter(true);
    setShowFilter1(false);
    setState({});
  };

  const filter1handler = () => {
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

  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  // page change function for df preview
  const onPageChanged = (data) => {
    if(fetchClicked) {
      setFetchClicked(false);
    } else {
      const { currentPage, totalPages, pageLimit } = data;
      // console.log(currentPage);
      const offset = (currentPage - 1) * pageLimit;
      const formData = new FormData();
      formData.set("page_number", currentPage);
      axios
        .post("http://localhost:5000/api/page", formData)
        .then((response) => {
          // console.log(response);
          // console.log("result total records " + resultTotalRecords);
          // initialDataFrame.dfrow = response.data.tableRows;
          // initialDataFrame.dfcol = response.data.tableCols;

          setGridCols(response.data.tableCols);
          setGridRows(response.data.tableRows);
          // setTable(response.data.table);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleConversion = (val) => {
    if(disable){
      console.log("disable true");
    }
    else{
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
    axios
      .post("http://localhost:5000/api/convert", formData, {
        responseType: "blob",
      })
      .then((response) => {
        setDisable(false);
          setButtonId("uploadButton");
        setUploadPercentage(100);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
        setDownloadContent(response.data);
        console.log(response);
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

  // download content
  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  const queryhandler = (e) => {
    setQuery(e.target.value);
  };

  //On fetchButtonClick
  const onFetchButtonClick = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("query_text", query);
    setFetchClicked(true);

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

          setResultTotalRecords(response.data.total_records);
          setResultRows(response.data.rows_per_page);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="newpreview">
      <Navbar></Navbar>
      <div >
      <Row>
        <Col lg="11" className="left">
          <div className="filterButton">
            <button onClick={filterhandler}>AutoComplete</button>
            <button onClick={filter1handler}>MultiSelect</button>
          </div>
          <div  className={classes.root2}>
            {showFilter?(
               <ReactDataGrid
           
               columns={gridCols.map((c) => ({
                 ...c,
                 ...defaultColumnProperties,
               }))}
               rowGetter={(i) => filteredRows[i]}
               rowsCount={filteredRows.length}
               minHeight={456}
               
               toolbar={<Toolbar enableFilter={true} />}
               onAddFilter={(filter) => setFilters(handleFilterChange(filter))}
               onClearFilters={() => setFilters({})}
               getValidFilterValues={columnKey => getValidFilterValues([], columnKey)}
             />
            ):<></>}
           {showFilter1?(
               <ReactDataGrid
           
               columns={gridCol1.map((c) => ({
                 ...c,
                 ...defaultColumnProperties,
               }))}
               rowGetter={(i) => filteredRows2[i]}
               rowsCount={filteredRows2.length}
               minHeight={456}
               
               toolbar={<Toolbar enableFilter={true} />}
               onAddFilter={(filter) => setFilters2(handleFilterChange(filter))}
               onClearFilters={() => setFilters2({})}
               getValidFilterValues={columnKey => getValidFilterValues(gridRows1, columnKey)}
             />
            ):<></>}
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
                <input type="text" placeholder="Type your SQL query" onChange = {(event)=>queryhandler(event)} />
                
                <button onClick={onFetchButtonClick}>Fetch</button>
                </form>
                {/* <Button
                title={"Fetch"}
                classId={"queryButton"}
                clickFunc={ onFetchButtonClick}
                ></Button> */}
                
            </Row>
          </Row>
        </Container>
        </Col>
        <Col lg="1">
        {/* <Container className="queryInside">
          <Row>
            <Row className="query">
              
                <input type="text" placeholder="Type your SQL query" onChange = {(event)=>queryhandler(event)} />
                
                <button onClick={onFetchButtonClick}>Fetch</button> */}

                {/* <Button
                title={"Fetch"}
                classId={"queryButton"}
                clickFunc={ onFetchButtonClick}
                ></Button> */}
                
            {/* </Row>
          </Row>
        </Container> */}
        <Container>
         
          <Row>
            <Col lg="12">
              {/* <IconBox iconType={faFileExcel} size={"1x"}></IconBox> */}
              <Button
                title={"Convert to Excel"}
                classId={buttonId}
                clickFunc={() => handleConversion("excel")}
              ></Button>
            </Col>
            <Col lg="12">
              {/* <IconBox iconType={faFileCsv} size={"1x"}></IconBox> */}
              <Button
                title={"Convert To CSV"}
                classId={buttonId}
                clickFunc={() => handleConversion("csv")}
              ></Button>
            </Col>
            <Col lg="12">
              {/* <IconBox iconType={faDatabase} size={"1x"}></IconBox> */}
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

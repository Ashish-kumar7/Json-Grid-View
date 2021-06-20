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
import { faDatabase, faFileCsv, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import io from 'socket.io-client'
const socket = io("http://localhost:5000/");

var FileDownload = require("js-file-download");

// const columns = initialDataFrame.dfcol;

// const rows = initialDataFrame.dfrow;

const defaultColumnProperties = {
  filterable: true,
  width: 120,
};

const selectors = Data.Selectors;

const handleFilterChange = (filter) => (filters) => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

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
    padding: "2%",
  },
  numval: {
    padding: "4%",
    marginLeft: "10%",
  },
  root2: {
    "& div.react-grid-Canvas": {
      // borderColor: "white",
      backgroundColor: "#212342",
    },
    "& div.react-grid-Main": {
      // outlineColor:"yellow",
      color: "white",
      backgroundColor: "black",
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
      '&:hover': {
        background: "blue",
     },
      // color: theme.palette.text.color
    },
    "& div.react-grid-Row": {
      "& div.react-grid-Cell": {
      
        backgroundColor: "#2c3034",
        '&:hover': {
          background: "black",
          cursor:"pointer"
       },
      },
     
     
      // color: theme.palette.text.color
    },
    
    
  },
}));


 

const NewPreviewPage = () => {
  // console.log("new preview page");
  // console.log(initialDataFrame.dfrow);
  const [resultTotalRecords, setResultTotalRecords] = useState(
    initialDataFrame.records
  );
  const [selectedPage, setSelectedPage] = useState(1);
  const [gridRows, setGridRows] = useState(initialDataFrame.dfrow);
  const [gridCols, setGridCols] = useState(initialDataFrame.dfcol);

  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const filteredRows = getRows(gridRows, filters);
  // const [table, setTable] = useState(initialDataFrame.df);
 
    // console.log(resultTotalRecords);
  const [resultRows, setResultRows] = useState(initialDataFrame.rows);
  let colWithIdx = [];
  const [selectedIndex, setSelectedIndex] = useState(1);

  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  // page change function for df preview
  const onPageChanged = (data) => {
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
  };

  const handleConversion = (val) => {
    setUploadPercentage(10);
    const formData = new FormData();
    formData.set("content_type", val);
    // formData.set("data_type" , dataType);
    if (val == "excel") {
      setFileExtension("output.xlsx");
    } else if (val == "csv") {
      setFileExtension("output.csv");
    } else {
      setFileExtension("output.db");
    }
    axios
      .post("http://localhost:5000/api/convert", formData, {
        responseType: "blob",
      })
      .then((response) => {
        setUploadPercentage(100);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
        setDownloadContent(response.data);
        console.log(response);
        setShowDownload(true);
      })
      .catch((err) => {
        console.log(err);
        setUploadPercentage(0);
      });
  };

  // download content
  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  

  return (
    <div className="newpreview">
      <Navbar></Navbar>
      <div >
      <Row>
        <Col lg="9" className="left">
          <div  className={classes.root2}>
            <ReactDataGrid
           
              columns={initialDataFrame.dfcol.map((c) => ({
                ...c,
                ...defaultColumnProperties,
              }))}
              rowGetter={(i) => filteredRows[i]}
              rowsCount={filteredRows.length}
              minHeight={550}
              
              toolbar={<Toolbar enableFilter={true} />}
              onAddFilter={(filter) => setFilters(handleFilterChange(filter))}
              onClearFilters={() => setFilters({})}
            />
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
        </Col>
        <Col lg="3">
        <Container>
         
          <Row>
            <Col lg="4">
              <IconBox iconType={faFileExcel} size={"1x"}></IconBox>
              <Button
                title={"Convert to Excel"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("excel")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faFileCsv} size={"1x"}></IconBox>
              <Button
                title={"Convert To CSV"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("csv")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faDatabase} size={"1x"}></IconBox>
              <Button
                title={"Save to Hive"}
                classId={"uploadButton"}
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
            title={"Download"}
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

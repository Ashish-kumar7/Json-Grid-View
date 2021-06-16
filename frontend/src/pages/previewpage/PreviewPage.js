import "./PreviewPage.css";
import "./dataframeStyle.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "../../components/button/Button";
import IconBox from "../../components/iconbox/IconBox";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Pagination from '@material-ui/lab/Pagination';
import Navbar from "../../components/navbar/Navbar";
import PaginationP from "../../components/pagination/Pagination";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SelectedValues from "../../components/selectedvaluespreview/SelectedValues";
import initialDataFrame from "../../global_variable";
import IOSSwitch from "../../material-styles";
import Checkbox from "@material-ui/core/Checkbox";
import "./dataframeStyle.css";
import "./PreviewPage.css";

var FileDownload = require("js-file-download");
var parse = require("html-react-parser");

// style
const useStyles = makeStyles((theme) => ({
  // root: {
  //   "& > *": {
  //     marginTop: theme.spacing(2),
  //   },
  //   width: "40%",
  //   backgroundColor: "white",
  //   marginLeft: "30%",
  //   marginRight: "30%",
  // },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  num: {
    // color:'black',
    // backgroundColor:'#00b0ff',
    marginLeft: "36%",
    marginRight: "30%",
    padding: "2%",
  },
}));

const PreviewPage = (props) => {
  const classes = useStyles();
  let [, setState] = useState();
  console.log("preview pageeeeeee");

  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [showDownload, setShowDownload] = useState(false);

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [table, setTable] = useState(initialDataFrame.df);
  const [formDisplay, setFormDisplay] = useState(false);
  const [uniqueRowsPerPage, setUniqueRowsPerPage] = useState(1);
  const [uniqueTotalRecords, setUniqueTotalRecords] = useState(1);
  const [resultTotalRecords, setResultTotalRecords] = useState(
    initialDataFrame.records
  );
  const [resultRows, setResultRows] = useState(initialDataFrame.rows);
  const [showValue, setShowValue] = useState(false);
  // unique 20 values of a particular column
  let [values, setValues] = useState([]);

  // boolean array corresponding to unique values to maintain checkbox display
  // let initcheck2 = {};
  // dictionary to store column name and selected values
  const dictIntermediate = {};
  for (var i = 0; i < initialDataFrame.cols.length; i++) {
    dictIntermediate[initialDataFrame.cols[i]] = new Set();
    // initcheck2[initialDataFrame.cols[i]] = new Array(20).fill(false);
  }
  let [dict, setDict] = useState(dictIntermediate);
  // const [check2, setCheck2] = useState(initcheck2);

  // index to know which column is selected
  const [selectedIndex, setSelectedIndex] = useState(1);
  // column names stored with index
  let colWithIdx = [];

  // const [check,setCheck] = useState(initCheck);

  // variables for search bar
  const [searchValues, setSearchValues] = useState([]);
  const [searchval, setSearchval] = useState("");
  const [showSearchValue, setShowSearchValue] = useState(false);

  // create dictionary to store selected values for columns

  // function to download file
  const handleConversion = (val) => {
    const formData = new FormData();
    formData.set("content_type", val);
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

  // toggle switch for showing form
  const switchhandler = () => {
    if (formDisplay) {
      setFormDisplay(false);
    } else {
      setFormDisplay(true);
    }
  };

  // index to get col name

  // index to get col name
  // page change function for df preview
  const onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    console.log(currentPage);
    const offset = (currentPage - 1) * pageLimit;
    const formData = new FormData();
    formData.set("page_number", currentPage);
    axios
      .post("http://localhost:5000/api/page", formData)
      .then((response) => {
        console.log(response);
        setTable(response.data.table);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onUniqueValuePageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    console.log(currentPage);

    // const newcheck3 = check2;
    // for(var j =0;j<check2[colWithIdx[selectedIndex]].length;j++){
    //   newcheck3[colWithIdx[selectedIndex]][j]=false;
    //  }
    // setCheck2(newcheck3);
    // setState({});
    let newval = [];
    // console.log(check2[colWithIdx[selectedIndex]]);
    // console.log(dict[colWithIdx[selectedIndex]]);
    const formData = new FormData();
    formData.set("col_name", colWithIdx[selectedIndex]);
    formData.set("page_number", currentPage);
    axios
      .post("http://localhost:5000/api/uniqueValues", formData)
      .then((response) => {
        // receive  20 unique values

        //  console.log(response.data.unique_data);
        newval = response.data.unique_data;
        console.log("New val");
        console.log(newval);
        setValues(newval);
        // console.log(values);
        // const newcheck2 = check2;
        // for (var k = 0; k < newval.length; k++) {
        //   if (dict[colWithIdx[selectedIndex]].has(newval[k])) {
        //     console.log("jjjjjjjjjjjjjjjjjjjjjj");
        //     console.log(newval[k]);
        //     newcheck2[colWithIdx[selectedIndex]][k] = true;
        //   } else {
        //     newcheck2[colWithIdx[selectedIndex]][k] = false;
        //   }
        // }
        // setCheck2(newcheck2);
        // console.log(check2[colWithIdx[selectedIndex]]);
        // console.log(dict[colWithIdx[selectedIndex]]);

        setUniqueTotalRecords(response.data.total_unique);
        // console.log("unique total "  + uniqueTotalRecords );
        // console.log("rowsPerPage " + uniqueRowsPerPage);
        setUniqueRowsPerPage(response.data.rows_per_page);

        console.log("values");
        console.log(values);
      })

      .catch((err) => {
        console.log(err);
      });

    setState({});
  };

  const handleListItemClick = (event, index) => {
    console.log(colWithIdx[index]);
    //  initCheck =new Array(values.length).fill(false);
    //  setCheck(initCheck);
    // index selected for column name
    setSelectedIndex(index);
    const formData = new FormData();
    formData.set("col_name", colWithIdx[index]);
    formData.set("page_number", 1);
    axios
      .post("http://localhost:5000/api/uniqueValues", formData)
      .then((response) => {
        // receive first 20 unique values

        setValues(response.data.unique_data);
        setUniqueTotalRecords(response.data.total_unique);
        // console.log("unique total "  + uniqueTotalRecords );
        // console.log("rowsPerPage " + uniqueRowsPerPage);
        setUniqueRowsPerPage(response.data.rows_per_page);
        setShowValue(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //  setDict(dictIntermediate);

  const handleValueToggle = (event, num) => {
    // const newcheck = check2;
    if (dict[colWithIdx[selectedIndex]].has(values[num])) {
      // newcheck[colWithIdx[selectedIndex]][num] = false;
      const newdict = dict;
      newdict[colWithIdx[selectedIndex]].delete(values[num]);
      // setCheck2(newcheck);
      setDict(newdict);
    } else {
      // newcheck[colWithIdx[selectedIndex]][num] = true;
      const newdict = dict;
      newdict[colWithIdx[selectedIndex]].add(values[num]);
      // setCheck2(newcheck);
      setDict(newdict);
    }
    // console.log(initCheck)

    setState({});
  };

  const handleSearchValueToggle = (event, num) => {
    // const newcheck = check2;
    if (dict[colWithIdx[selectedIndex]].has(searchValues[num])) {
      // newcheck[colWithIdx[selectedIndex]][num] = false;
      const newdict = dict;
      newdict[colWithIdx[selectedIndex]].delete(searchValues[num]);
      // setCheck2(newcheck);
      setDict(newdict);
    } else {
      // newcheck[colWithIdx[selectedIndex]][num] = true;
      const newdict = dict;
      newdict[colWithIdx[selectedIndex]].add(searchValues[num]);
      // setCheck2(newcheck);
      setDict(newdict);
    }
    // console.log(initCheck)

    setState({});
  };

  const searchvaluehandler = (e) => {
    // console.log(e.target.value);
    setSearchval(e.target.value);
    // console.log("value = " + searchval);
  };

  const searchhandler = () => {
    const formData = new FormData();
    formData.set("col_name", colWithIdx[selectedIndex]);
    formData.set("search_val", searchval);
    console.log("value = " + searchval);
    axios
      .post("http://localhost:5000/api/searchValues", formData)
      .then((response) => {
        // set  search values
        console.log("search results arrived!!");
        console.log(response);
        setSearchValues(response.data.unique_data);
        console.log("ddddddddddddddd" +searchValues);
        // setUniqueTotalRecords(response.data.total_unique);
        // console.log("unique total "  + uniqueTotalRecords );
        // console.log("rowsPerPage " + uniqueRowsPerPage);
        // setUniqueRowsPerPage(response.data.rows_per_page);
        // setShowValue(true);
      })
      .catch((err) => {
        console.log(err);
      });
      
  };

  // create list to display all columns
  let colList = [];

  for (var i = 0; i < initialDataFrame.cols.length; i++) {
    // dictIntermediate[initialDataFrame.cols[i]] = new Set();
    let number = i;
    colWithIdx[number] = initialDataFrame.cols[i];
    colList.push(
      <ListItem
        button
        selected={selectedIndex === number}
        onClick={(event) => handleListItemClick(event, number)}
      >
        <ListItemText className="textList" primary={initialDataFrame.cols[i]} />
      </ListItem>
    );
  }

  // create list to display unique values of column
  let valueList = [];
  for (var i = 0; i < values.length; i++) {
    let number = i;

    valueList.push(
      <ListItem
        key={values[number]}
        dense
        button
        onClick={(event) => handleValueToggle(event, number)}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={dict[colWithIdx[selectedIndex]].has(values[number])}
            tabIndex={-1}
            disableRipple
            key={values[number]}
          />
        </ListItemIcon>
        <ListItemText primary={values[number]} />
      </ListItem>
    );
  }

  let searchList = [];
  for (var q = 0; q < searchValues.length; q++) {
    let number = q;

    searchList.push(
      <ListItem key={searchValues[number]} dense button onClick={(event)=> handleSearchValueToggle(event,number)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={dict[colWithIdx[selectedIndex]].has(searchValues[number])}
            tabIndex={-1}
            disableRipple
            key={searchValues[number]}
          />
        </ListItemIcon>
        <ListItemText primary={searchValues[number]} />
      </ListItem>
    );
  }

 

  const submithandler = () => {
    const formData = new FormData();

    console.log("sending ");
    console.log(dict);
    var queryDict = {};
    for (var key in dict) {
      if (dict[key].size > 0) {
        queryDict[key] = Array.from(dict[key]);
      }
    }
    console.log("gen query dict");
    console.log(queryDict);

    console.log(JSON.stringify(queryDict));
    formData.set("dict", JSON.stringify(queryDict));
    axios
      .post("http://localhost:5000/api/queryForm", formData)
      .then((response) => {
        // receive data frame
        console.log("Response after query using dict");
        console.log(response);
        setResultRows(response.data.rows_per_page);
        setResultTotalRecords(response.data.total_records);
        setTable(response.data.table);
        setResultTotalRecords(response.data.total_records);
        setResultRows(response.data.rows_per_page);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="previewpage">
        <div className="preview ">
          <Container className="display scrollbar scrollbar-secondary  ">
            <div dangerouslySetInnerHTML={{ __html: table }} />
            {/* <div id="tableDisplay">
                parse(location.state.state.df);
          </div> */}
          </Container>
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
        <div className='rowC'>
          <div className="formtoggle">
            <h5>Toggle to perform queries using UI</h5>
            {/* <Switch className="formswitch"
              checked={formDisplay}
              onChange={switchhandler}
              name="checkedA"
              inputProps={{ "aria-label": "secondary checkbox" }}
            /> */}
            <FormControlLabel
              className="formswitch"
              control={
                <IOSSwitch
                  checked={formDisplay}
                  onChange={switchhandler}
                  name="checkedB"
                />
              }
            />
          </div>
          <div className="sqlQueryPage">
            <h5>Click to perform SQL Queries on table</h5>
            <Button
              title={"Go To QueryPage!"}
              classId={"uploadButton"}
              link={"/query-page"}
            ></Button>
          </div>
        </div>
        

        {formDisplay ? (
          <>
            <Row className="fullform">
              {/* list of column values in dataframe    */}
              <Col lg="4">
                <h5>Select Column</h5>
                <div className="colList">
                  <Divider />
                  <List component="nav" aria-label="secondary mailbox folder">
                    {colList}
                  </List>
                </div>
              </Col>
              <Col lg="4">
                {showValue ? (
                  <>
                    <h5>Select Values</h5>
                    <div className="colList">
                      <Divider />
                      <List
                        component="nav"
                        aria-label="secondary mailbox folder"
                      >
                        {valueList}
                      </List>
                    </div>
                    <div className={classes.num}>
                      <PaginationP
                        key={uniqueTotalRecords}
                        totalRecords={uniqueTotalRecords}
                        pageLimit={uniqueRowsPerPage}
                        pageNeighbours={1}
                        onPageChanged={onUniqueValuePageChanged}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </Col>
              <Col lg="4">
                <Row onChange={searchvaluehandler}>
                  <Form.Label>Sheet name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search value for selected column"
                  />
                  <button onClick={searchhandler} type="submit">
                    Search
                  </button>
                </Row>
                <Row>
                <div className="colList">
                      <Divider />
                      <List
                        component="nav"
                        aria-label="secondary mailbox folder"
                      >
                        {searchList}
                      </List>
                    </div>
                </Row>
              </Col>
            </Row>
            <button onClick={submithandler}>Query</button>
            <SelectedValues dict={dict}></SelectedValues>
          </>
        ) : (
          <p></p>
        )}

        <Container>
          <h3>SELECT A CATEGORY {props.totalPages}</h3>
          <Row>
            <Col lg="4">
              <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
              <Button
                title={"Convert to Excel"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("excel")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
              <Button
                title={"Convert To CSV"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("csv")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faDatabase} size={"2x"}></IconBox>
              <Button
                title={"Save to Hive"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("hive")}
              ></Button>
            </Col>
          </Row>
        </Container>
        {showDownload ? (
          <Button
            title={"Download"}
            classId={"downloadButton"}
            clickFunc={downloadFile}
          ></Button>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
};

export default PreviewPage;

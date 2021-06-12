import "./PreviewPage.css";
import "./dataframeStyle.css";
import { Container, Row, Col } from "react-bootstrap";
import FileUrlLayout from "../../components/fileurllayout/FileUrlLayout";
import Button from "../../components/button/Button";
import IconBox from "../../components/iconbox/IconBox";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
// import { DataGrid } from '@material-ui/data-grid';
// import { useDemoData } from '@material-ui/x-grid-data-generator';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Navbar from "../../components/navbar/Navbar";
import '../../components/scrollbar/ScrollBar.css'
var FileDownload = require("js-file-download");
var parse = require("html-react-parser");


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
      width:'40%',
      backgroundColor: 'white',
      marginLeft:'30%',
      marginRight:'30%',
      
    },
    num:{
        color:'white',
        backgroundColor:'#00b0ff',
        fontSize:'30px',
    },
  }));


const PreviewPage = (props) => {

    const classes = useStyles();
  // props containd top 20 rows and total pages
  const location = useLocation();
  console.log("preview pageeeeeee");
  console.log(location.state.state.df);

  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [table, setTable] = useState(location.state.df);
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

  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  return (
      <>
      <Navbar></Navbar>
    <div className="previewpage">

      <div className="preview ">
        <Container className="display scrollbar scrollbar-secondary  ">
          <div dangerouslySetInnerHTML={{__html: location.state.state.df }} />
          {/* <div id="tableDisplay">
                parse(location.state.state.df);
          </div> */}
        </Container>
      </div>
      <div className={classes.root}>
      
      <Pagination count={10} color="primary" />
      <Pagination className={classes.num} count={10} color="secondary" />
     
    </div>
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

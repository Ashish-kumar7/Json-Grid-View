import FileUrlLayout from "../../components/fileurllayout/FileUrlLayout";
import Navbar from "../../components/navbar/Navbar";
import "./JsonInput.css";
import Footer from "../../components/footer/Footer";
import Editor from "../../components/editor/Editor";
import { Container, Row, Col } from 'react-bootstrap'
import Button from '../../components/button/Button'
import IconBox from "../../components/iconbox/IconBox";
import { ProgressBar } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import io from "socket.io-client";
import axios from 'axios'
var FileDownload = require("js-file-download");
const socket = io("http://localhost:5000/");

const JsonInput = () => {
  const [inputJson, setInputJson] = useState();
  const [processed, setProcessed] = useState(true);
  const [showDownload, setShowDownload] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  var validJSON = true;

  // for getting updates regarding progress 
  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  const changeHandler = (e) => {
    setInputJson(e.target.value);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("Json", inputJson);
    formData.set("input_type", "text");
    console.log(inputJson);
    console.log(formData);
    //   fetch("http://localhost:5000/api/upload", {
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //     method: "POST",
    //     body: formData,
    //   })
    //     .then((response) => response.json())
    //     .then((result) => {
    //       console.log("Success", result);
    //       setProcessed(true);
    //     })
    //     .catch((error) => {
    //       console.error("Error", error);
    //     });
    // };

    axios
      .post("http://localhost:5000/api/upload", formData)
      .then((res) => {
        setProcessed(false);
        setShowOptions(true);
      })
      .catch((err) => {
        console.log(err);
        validJSON = false;
        alert("Invalid JSON Input !!");
      });
  };

  const handleConversion = (val) => {
    const formData = new FormData();
    formData.set("content_type", val);
    console.log(val)
    if (val == "excel") {
      setFileExtension("output.xlsx");
    } else if (val == "csv") {
      setFileExtension("output.csv");
    } else {
      setFileExtension("output.db");
    }
    axios
      .post(
        "http://localhost:5000/api/convert",
        formData,
        { responseType: "blob" }
      )
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
        alert("Oops it breaks " + err);
      });
  }

  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  return (
    <div className="jsonInput">
      <Navbar></Navbar>
      <Container>
        <Row>
          <Col lg="6">
            <Editor process={processed} onChange={changeHandler} click={() => handleSubmission()} ></Editor>
          </Col>
          <Col lg="6">
            {showOptions ? (<Container>
              <Row>
                <Col lg="4" className="colspace">
                  <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
                  <Button
                    title={"Convert to Excel"}
                    classId={"uploadButton"}
                    clickFunc={() => handleConversion("excel")}
                  ></Button>
                </Col>
                <Col lg="4" className="colspace">
                  <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
                  <Button
                    title={"Convert To CSV"}
                    classId={"uploadButton"}
                    clickFunc={() => handleConversion("csv")}
                  ></Button>
                </Col>
                <Col lg="4" className="colspace">
                  <IconBox iconType={faDatabase} size={"2x"}></IconBox>
                  <Button
                    title={"Save to Hive"}
                    classId={"uploadButton"}
                    clickFunc={() => handleConversion("hive")}
                  ></Button>
                </Col>
              </Row>
            </Container>) : <p></p>}
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
            {showDownload ? (<Button title={"Download"}
              classId={"downloadButton"} clickFunc={downloadFile}
            ></Button>) : <p></p>}
            {/* <FileUrlLayout ></FileUrlLayout> */}
          </Col>
        </Row>
      </Container>

      {/*      
      <div>
        <textarea rows="10" cols="10" type="text" onChange={changeHandler} />

        <button onClick={handleSubmission}>Submit</button>
      </div> */}
      <Footer />
    </div>
  );
};

export default JsonInput;

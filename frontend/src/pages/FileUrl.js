import FileUrlLayout from "../components/FileUrlLayout";
import Navbar from "../components/Navbar";
import "./FileUrl.css";
import { useState } from "react";
import axios from 'axios'
import { ProgressBar } from "react-bootstrap";
import Button from '../components/Button'
import IconBox from "../components/IconBox";
import { Container, Row, Col } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
var FileDownload = require("js-file-download");
const socket = io("http://localhost:5000/");

const FileUrl = () => {
  const [inputUrl, setInputUrl] = useState();
  const [showDownload, setShowDownload] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [processed, setProcessed] = useState(true);

   // for getting updates regarding progress 
   socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  const changeHandler = (e) => {
    setInputUrl(e.target.value);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("Url", inputUrl);
    formData.set("input_type", "url");
    console.log(inputUrl);
    console.log(formData);
    // const options = {
    //   onUploadProgress: (progressEvent) => {
    //     const { loaded, total } = progressEvent;
    //     let percent = Math.floor((loaded * 100) / total);
    //     console.log(`${loaded}kb of ${total}kb | ${percent}%`);

    //     if (percent < 100) {
    //       setUploadPercentage(percent);
    //       console.log(uploadPercentage);
    //     }
    //   },
    // };
    // fetch("http://localhost:5000/api/upload", {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log("Success", result);
    //   })
    //   .catch((error) => {
    //     console.error("Error", error);
    //   });
    axios
    .post("http://localhost:5000/api/upload", formData)
    .then((res) => {
      console.log("data frame generated");
        setProcessed(false);
        setShowOptions(true);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const handleConversion = (val)=>{
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
      });
  }

  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  return (
    <div className="fileUrl">
      <Navbar></Navbar>
      <div className="urldiv">
        <label>URL</label>
        <input className="urlinput" placeholder="https://google.com" type="text" onChange={changeHandler} />
      </div>
      {processed ? (
        <Button
          title={"Process"}
          class={"downloadButton"}  
          clickFunc={() => handleSubmission()} 
        ></Button>
      ) : (
        <p></p>
      )}
      {/* <FileUrlLayout buttonFunc={handleSubmission}></FileUrlLayout> */}
      {showOptions?
      (<Container>
        <h3>SELECT A CATEGORY</h3>
          <Row>
            <Col lg="4">
              <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
              <Button
                title={"Convert to Excel"}
                class={"uploadButton"}
                clickFunc={() => handleConversion("excel")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
              <Button
                title={"Convert To CSV"}
                class={"uploadButton"}
                clickFunc={() => handleConversion("csv")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faDatabase} size={"2x"}></IconBox>
              <Button
                title={"Save to Hive"}
                class={"uploadButton"}
                clickFunc={() => handleConversion("hive")}
              ></Button>
            </Col>
          </Row>
        </Container>):<p></p>
      }
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
              class={"downloadButton"}  clickFunc={downloadFile}
              ></Button>):<p></p>}
    </div>
  );
};

export default FileUrl;

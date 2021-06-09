import FileUrlLayout from "../fileurllayout/FileUrlLayout";
import Navbar from "../navbar/Navbar";
import "./JsonInput.css";
import Editor from "../editor/Editor";
import {Container,Row,Col} from 'react-bootstrap'
import Button from '../button/Button'
import IconBox from "../iconbox/IconBox";
import { ProgressBar } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from 'axios'
var FileDownload = require('js-file-download');

const JsonInput = () => {
    const [inputJson, setInputJson] = useState();
    const [processed, setProcessed] = useState(true);
    const [showDownload, setShowDownload] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [downloadContent, setDownloadContent] = useState("");
    const [fileExtension, setFileExtension] = useState("");
  const changeHandler = (e) => {
    setInputJson(e.target.value);
    
  };

  const handleSubmission = (val) => {
    const formData = new FormData();
    formData.append("Json", inputJson);
    formData.set("input_type", "text");
    formData.set("content_type",val);
    if(val == "excel"){
      setFileExtension("output.xlsx")
    }
    else if(val == "csv"){
      setFileExtension("output.csv")
    }
    else{
      setFileExtension("output.db")
    }
    console.log(inputJson);
    console.log(formData);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);

        if (percent < 100) {
          setUploadPercentage(percent);
          console.log(uploadPercentage);
        }
      },
    };
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
  .post("http://localhost:5000/api/upload", formData,{responseType: "blob"}, options)
  .then((res) => {
    setDownloadContent(res.data)
    console.log(res);
    setUploadPercentage(100);
    setTimeout(() => {
      setUploadPercentage(0);
    }, 1000);
    setShowDownload(true)
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
    <div className="jsonInput">
      <Navbar></Navbar>
      <Container>
        <Row>
          <Col lg="6">
          <Editor   onChange={changeHandler} ></Editor>
          </Col>
          <Col lg="6">
          {processed?(<Container>
          <Row>
            <Col lg="4">
              <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
              <Button
                title={"Convert to Excel"}
                class={"uploadButton"}
                clickFunc={() => handleSubmission("excel")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
              <Button
                title={"Convert To CSV"}
                class={"uploadButton"}
                clickFunc={() => handleSubmission("csv")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faDatabase} size={"2x"}></IconBox>
              <Button
                title={"Save to Hive"}
                class={"uploadButton"}
                clickFunc={() => handleSubmission("hive")}
              ></Button>
            </Col>
          </Row>
        </Container>):<p></p>}
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
          {/* <FileUrlLayout ></FileUrlLayout> */}
          </Col>
        </Row>
      </Container>
     
{/*      
      <div>
        <textarea rows="10" cols="10" type="text" onChange={changeHandler} />

        <button onClick={handleSubmission}>Submit</button>
      </div> */}
     
    </div>
  );
};

export default JsonInput;

import "./FileUpload.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUrlLayout from "../components/FileUrlLayout";
import { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import IconBox from "../components/IconBox";
import { Container, Row, Col } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
var FileDownload = require("js-file-download");
const socket = io("http://localhost:5000/");

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  // to check if file is selected or not
  const [isSelected, setIsSelected] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  // if file is selected than show the otions
  const [showOptions, setShowOptions] = useState(false);
  // if response received , show the download button
  const [showDownload, setShowDownload] = useState(false);
  // save download content when res received
  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [processed, setProcessed] = useState(false);

  // for getting updates regarding progress 
  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  // on selecting file for upload this function is called
  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
    setProcessed(true);
  };

  
  // on clicking any converting button
  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.set("input_type", "file");
    // formData.set("content_type", val);
    // if (val == "excel") {
    //   setFileExtension("output.xlsx");
    // } else if (val == "csv") {
    //   setFileExtension("output.csv");
    // } else {
    //   setFileExtension("output.db");
    // }
    console.log(selectedFile);
    console.log(formData);
    // const options = {
    //   onUploadProgress: (progressEvent) => {
    //     const { loaded, total } = progressEvent;
    //     let percent = Math.floor((loaded * 100) / total);
    //     console.log(`${loaded}kb of ${total}kb | ${percent}%`);

    //     if (percent < 100) {
    //       // setUploadPercentage(percent);
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

    // },options)
    //   .then((response) => {
    //     response.json()
    //     console.log(response);
    //    setUploadPercentage(100);
    //    setTimeout(() => {
    //      setUploadPercentage(0);
    //    },1000);
    //   })
    //   .then((result) => {
    //     console.log("Success", result);

    //   })
    //   .catch((error) => {
    //     console.error("Error", error);
    //     setUploadPercentage(0);
    //   });

    axios
      .post(
        "http://localhost:5000/api/upload",
        formData
      )
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
    <div className="fileUpload">
      <Navbar></Navbar>
      <div class="wrapper">
        <div className="file-upload">
          <input
            id="inputup"
            onChange={changeHandler}
            className="input"
            type="file"
          />
          <FontAwesomeIcon
            className="uploadicon"
            size="xs"
            icon={faUpload}
          ></FontAwesomeIcon>
        </div>
      </div>
      <div>
        {isSelected ? (
          <div>
            <pre>
              Filename: {selectedFile.name} Filetype: {selectedFile.type} Size
              in bytes: {selectedFile.size}
            </pre>
          </div>
        ) : (
          <p className="text-center"> Upload A JSON File</p>
        )}
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
      {showOptions ? (
        // <FileUrlLayout ></FileUrlLayout>
        <Container>
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
        </Container>
      ) : (
        <p></p>
      )}
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
          class={"downloadButton"}
          clickFunc={downloadFile}
        ></Button>
      ) : (
        <p></p>
      )}

      {/* <Footer></Footer> */}
    </div>
  );
};

export default FileUpload;

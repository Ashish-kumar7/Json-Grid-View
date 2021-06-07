import "./FileUpload.css";
import {
  faFileUpload,
  faMarsDouble,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
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
var FileDownload = require("js-file-download");

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

  // on selecting file
  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
    setShowOptions(true);
  };

  // on clicking any converting button
  const handleSubmission = (val) => {
    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.set("input_type", "file");
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
    console.log(selectedFile);
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
      .post("http://localhost:5000/api/upload", formData,{responseType: "blob"}, options)
      .then((response) => {
        setDownloadContent(response.data);

        console.log(response);
        setUploadPercentage(100);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
        setShowDownload(true);
        // let url = URL.createObjectURL(new Blob([response.data]));
        //   setDownloadUrl(url)
        // response.blob().then((myblob) => {

        // 	// let a = document.createElement('a');
        // 	// a.href = url;
        // 	// a.download = 'employees.json';
        // 	// a.click();
        // });
        //window.location.href = response.url;
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
      {showOptions ? (
        // <FileUrlLayout ></FileUrlLayout>
        <Container>
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

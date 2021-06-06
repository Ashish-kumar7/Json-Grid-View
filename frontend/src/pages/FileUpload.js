import "./FileUpload.css";
import { faFileUpload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUrlLayout from "../components/FileUrlLayout";
import { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import Button from '../components/Button'

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
    setShowOptions(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.set("input_type", "file");
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
      .post("http://localhost:5000/api/upload", formData, options)
      .then((res) => {
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

  return (
    <div className="fileUpload">
      <Navbar></Navbar>
      <div class="wrapper">
             <div  className="file-upload">
                  <input id="inputup" onChange={changeHandler}   className="input" type="file" />
                  <FontAwesomeIcon className="uploadicon" size="xs" icon={faUpload}></FontAwesomeIcon>
              </div>
             
            </div>
      <div>
        {isSelected ? (
          <div>
            <pre>Filename: {selectedFile.name}  Filetype: {selectedFile.type}  Size in bytes: {selectedFile.size}</pre>
            
          </div>
        ) : (
          <p className="text-center"> Upload A JSON File</p>
        )}
      </div>
     { showOptions ? (
      <FileUrlLayout buttonFunc={handleSubmission}></FileUrlLayout>
     ):
     <p></p>
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
              class={"downloadButton"}
              ></Button>):<p></p>}
        
      {/* <Footer></Footer> */}
    </div>
  );
};

export default FileUpload;

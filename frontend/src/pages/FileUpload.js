import "./FileUpload.css";
import { faFileUpload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUrlLayout from '../components/FileUrlLayout'
import { useState } from "react";
import {ProgressBar} from 'react-bootstrap'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor( (loaded * 100) / total );
        console.log( `${loaded}kb of ${total}kb | ${percent}%` );

        if( percent < 100 ){
          setUploadPercentage(percent);
          console.log(uploadPercentage)
        }
      }
    }
    console.log(options)
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.set("input_type", "file");
    console.log(selectedFile);
    console.log(formData);
    fetch("http://localhost:5000/api/upload", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: formData,

    })
      .then((response) => {
        response.json()
        setUploadPercentage(100);
        console.log(uploadPercentage)
      })
      .then((result) => {
        console.log("Success", result);
        
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <div className="fileUpload">
      <Navbar></Navbar>
      {/* <div class="wrapper">
             <div  class="file-upload">
                  <input  className="input" type="file" />
                  <FontAwesomeIcon  size="xs" icon={faUpload}></FontAwesomeIcon>
              </div>
              <button >Upload!</button>
            </div> */}
      <div>
        <input type="file" onChange={changeHandler} />
        {isSelected ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
          </div>
        ) : (
          <p className="text-center"> Upload A JSON File</p>
        )}
        { uploadPercentage > 0 && <ProgressBar now={uploadPercentage} active label={`${uploadPercentage}%`} /> }
        <button onClick={handleSubmission}>Submit</button>
      </div>
      {/* <p className="text-center"> Upload A JSON File</p> */}
      <FileUrlLayout></FileUrlLayout>
      {/* <Footer></Footer> */}
    </div>
  );
};

export default FileUpload;

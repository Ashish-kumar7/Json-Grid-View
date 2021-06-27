import "./FileUpload.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import Button from "../../components/button/Button";
import io from "socket.io-client";
import Modal from "../../components/modal/Modal";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";

// const socket = io("http://localhost:50000/");

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;


const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  // to check if file is selected or not
  const [isSelected, setIsSelected] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [showCustomizeButton, setShowCustomizeButton] = useState(true);

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ea80fc");

  const [disable, setDisable] = useState(false);
  const [buttonId, setButtonId] = useState("downloadButton");

  // on clicking customize button modal will be shown (show modal variable)
  const [open, setOpen] = useState(false);

  var validJSON = true;

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  // for getting updates regarding progress
  // socket.on("progress", (val) => {
  //   setUploadPercentage(val);
  //   console.log(val);
  // });

  // on selecting file for upload this function is called
  const changeHandler = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsSelected(true);
      setCustomize(true);
    }
  };

  // on clicking customize button ,file will be sent to backend, schema will be received and customize modal will be shown
  const handleCustomize = () => {
    if (disable) {
      console.log("disable true");
    }
    else {
      setDisable(true);
      setButtonId("disableButton");
      setLoading(true);
      const formData = new FormData();
      formData.append("File", selectedFile);
      formData.set("input_type", "file");

      axios
        .post("http://localhost:50000/api/upload", formData)
        .then((res) => {
          console.log("json loaded and checked");
          setLoading(false);
          if (res.data.message.startsWith("Error")) {
            setDisable(false);
            setButtonId("downloadButton");
            alert(res.data.message);
          }
          else {
            setDisable(false);
            setButtonId("downloadButton");
            showModal();
          }
        })
        .catch((err) => {
          // display alert for wrong json
          setLoading(false);
          setDisable(false);
          setButtonId("downloadButton");
          console.log(err);
          validJSON = false;
          setTimeout(() => {
            alert("Invalid JSON File !!");
          }, 1000);
        });
    }
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
              Filename: {selectedFile.name} <br></br>
              Filetype: {selectedFile.type} <br></br>
              Size: {selectedFile.size} bytes
            </pre>
          </div>
        ) : (
          <p className="text-center"> Upload A JSON File</p>
        )}
      </div>
      <RingLoader color={color} loading={loading} css={override} size={150} />


      {customize ? (
        <>
          {showCustomizeButton ? (<Button
            title={"Customize"}
            classId={buttonId}
            clickFunc={() => handleCustomize()}
          ></Button>) : ""}

          {validJSON ? (
            <Modal
              show={open}
              openFunc={showModal}
              closeFunc={hideModal}
            ></Modal>
          ) : (
            <p></p>
          )}
        </>
      ) : (
        <p></p>
      )}

    </div>
  );
};

export default FileUpload;
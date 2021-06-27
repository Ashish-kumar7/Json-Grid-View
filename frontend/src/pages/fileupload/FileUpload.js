import "./FileUpload.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";

// css for loader
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const FileUpload = () => {
  // store the selected json file , when uploaded from pc or laptop
  const [selectedFile, setSelectedFile] = useState();
  // check if file is selected or not
  const [isSelected, setIsSelected] = useState(false);
  // used to show or hide the customize button
  const [customize, setCustomize] = useState(false);
  const [showCustomizeButton, setShowCustomizeButton] = useState(true);
  // used to show or hide the loader
  let [loading, setLoading] = useState(false);
  // stores color of loader
  let [color, setColor] = useState("#ea80fc");
  // once a button is clicked  it is used to set disable property for button
  const [disable, setDisable] = useState(false);
  // to change the button id to disableButton when disable variable is set true
  const [buttonId, setButtonId] = useState("downloadButton");
  // on clicking customize button modal will be shown (show customization page)
  const [open, setOpen] = useState(false);
  // to check json is valid or not
  var validJSON = true;

  // function to close customization page
  const hideModal = () => {
    setOpen(false);
  };

  // function to open customization page
  const showModal = () => {
    setOpen(true);
  };

  // this function is called on selecting file for upload
  const changeHandler = (e) => {
    if (e.target.files[0]) {
      // here file is stored and customization button will be shown
      setSelectedFile(e.target.files[0]);
      setIsSelected(true);
      setCustomize(true);
    }
  };

  // on clicking customize button this function is called ,json file will be sent to backend, on receiving response with response status 200 - customization page will be shown
  const handleCustomize = () => {
    if (disable) {
      console.log("disable true");
    } else {
      setDisable(true);
      setButtonId("disableButton");
      setLoading(true);
      // sending data - file and type of data - file to backend
      const formData = new FormData();
      formData.append("File", selectedFile);
      formData.set("input_type", "file");

      // this api checks whether json in file is valid or not
      axios
        .post("http://localhost:5000/api/upload", formData)
        .then((res) => {
          console.log("json loaded and checked");
          setLoading(false);
          if (res.data.message.startsWith("Error")) {
            setDisable(false);
            setButtonId("downloadButton");
            alert(res.data.message);
          } else {
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
      <Navbar/>
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
      <RingLoader color={color} loading={loading} css={override} size={150} />
      {customize ? (
        <>
          {showCustomizeButton ? (
            <Button
              title={"Customize"}
              classId={buttonId}
              clickFunc={() => handleCustomize()}
            ></Button>
          ) : (
            ""
          )}

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

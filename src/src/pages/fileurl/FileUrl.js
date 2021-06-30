import Navbar from "../../components/navbar/Navbar";
import "./FileUrl.css";
import { useState } from "react";
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

const FileUrl = () => {
  // store the url to load json
  const [inputUrl, setInputUrl] = useState();
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

  // function to store url when typed in input box
  const changeHandler = (e) => {
    setInputUrl(e.target.value);
  };

  // function to close customization page
  const hideModal = () => {
    setOpen(false);
  };

  // function to open customization page
  const showModal = () => {
    setOpen(true);
  };

  // on clicking customize button this function is called ,json url will be sent to backend, on receiving response with response status 200 - customization page will be shown
  const handleCustomize = () => {
    if (disable) {
      console.log("disable true");
    } else {
      setDisable(true);
      setButtonId("disableButton");
      setLoading(true);
      // sending data - url(string) and type of data - url to backend
      const formData = new FormData();
      formData.append("Url", inputUrl);
      formData.set("input_type", "url");

      // this api checks whether json in url is valid or not
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
            alert("Invalid JSON URL !!");
          }, 1000);
        });
    }
  };

  return (
    <div className="fileUrl">
      <Navbar />
      <div className="urldiv">
        <label>URL</label>
        <input
          className="urlinput"
          placeholder="https://google.com"
          type="text"
          onChange={changeHandler}
        />
      </div>
      <RingLoader color={color} loading={loading} css={override} size={150} />
      <>
        <Button
          title={"Customize"}
          classId={buttonId}
          clickFunc={() => handleCustomize()}
        ></Button>
        <Modal show={open} openFunc={showModal} closeFunc={hideModal}></Modal>
      </>
      )
    </div>
  );
};

export default FileUrl;

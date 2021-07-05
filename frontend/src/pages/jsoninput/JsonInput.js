import { css } from "@emotion/react";
import axios from "axios";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import RingLoader from "react-spinners/RingLoader";
import Editor from "../../components/editor/Editor";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar/Navbar";
import "./JsonInput.css";

// css for loader
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const JsonInput = () => {
  // store json written in textbox by user
  const [inputJson, setInputJson] = useState();
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

  // function to store json
  const changeHandler = (e) => {
    setInputJson(e.target.value);
  };

  // function to close customization page
  const hideModal = () => {
    setOpen(false);
  };

  // function to open customization page
  const showModal = () => {
    setOpen(true);
  };

  // on clicking customize button this function is called ,json will be sent to backend, on receiving response with response status 200 - customization page will be shown
  const handleCustomize = () => {
    if (disable) {
      console.log("disable true");
    } else {
      setDisable(true);
      setButtonId("disableButton");
      setLoading(true);
      // sending data - json(string) and type of data - text to backend
      const formData = new FormData();
      formData.append("Json", inputJson);
      formData.set("input_type", "text");
      // this api checks whether json is valid or not
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
            alert("Invalid JSON Input !!");
          }, 1000);
        });
    }
  };

  return (
    <div className="jsonInput">
      <Navbar></Navbar>
      <Container>
        <Row>
          <Col lg="12">
            <Editor
              process={true}
              onChange={changeHandler}
              click={() => handleCustomize()}
              btnid ={buttonId}
            ></Editor>
            <Modal
              show={open}
              openFunc={showModal}
              closeFunc={hideModal}
            ></Modal>
            <RingLoader
              color={color}
              loading={loading}
              css={override}
              size={150}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JsonInput;
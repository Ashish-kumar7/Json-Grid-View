import Navbar from "../../components/navbar/Navbar";
import "./FileUrl.css";
import { useState } from "react";
import axios from 'axios'
import { ProgressBar } from "react-bootstrap";
import Button from '../../components/button/Button'
import Modal from "../../components/modal/Modal";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const FileUrl = () => {
  const [inputUrl, setInputUrl] = useState();
  // const [uploadPercentage, setUploadPercentage] = useState(0);

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ea80fc");

  const [disable, setDisable] = useState(false);
  const [buttonId, setButtonId] = useState("downloadButton");

  // on clicking customize button modal will be shown (show modal variable)
  const [open, setOpen] = useState(false);

  var validJSON = true;

  const changeHandler = (e) => {
    setInputUrl(e.target.value);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCustomize = () => {
    if (disable) {
      console.log("disable true");
    }
    else {
      setDisable(true);
      setButtonId("disableButton");
      setLoading(true);

      const formData = new FormData();
      formData.append("Url", inputUrl);
      formData.set("input_type", "url");
      axios
        .post("http://localhost:50000/api/upload", formData)
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
      <Navbar></Navbar>
      <div className="urldiv">
        <label>URL</label>
        <input className="urlinput" placeholder="https://google.com" type="text" onChange={changeHandler} />
      </div>
      <RingLoader color={color} loading={loading} css={override} size={150} />

      <>
        <Button
          title={"Customize"}
          classId={buttonId}
          clickFunc={() => handleCustomize()}
        ></Button>
        <Modal
          show={open}
          openFunc={showModal}
          closeFunc={hideModal}
        ></Modal>
      </>
      )

    </div>
  );
};

export default FileUrl;

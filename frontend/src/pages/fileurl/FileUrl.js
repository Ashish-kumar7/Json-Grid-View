
import Navbar from "../../components/navbar/Navbar";
import "./FileUrl.css";
import { useState } from "react";
import axios from 'axios'
import { ProgressBar } from "react-bootstrap";
import Button from '../../components/button/Button'
import Modal from "../../components/modal/Modal";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";

// const socket = io("http://localhost:5000/");
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

  // on clicking customize button modal will be shown (show modal variable)
  const [open, setOpen] = useState(false);

  var validJSON = true;

  // for getting updates regarding progress 
  // socket.on("progress", (val) => {
  //   setUploadPercentage(val);
  //   console.log(val);
  // });

  const changeHandler = (e) => {
    setInputUrl(e.target.value);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  // const handleSubmission = () => {
  //   const formData = new FormData();
  //   formData.append("Url", inputUrl);
  //   formData.set("input_type", "url");
  //   console.log(inputUrl);
  //   console.log(formData);
  // const options = {
  //   onUploadProgress: (progressEvent) => {
  //     const { loaded, total } = progressEvent;
  //     let percent = Math.floor((loaded * 100) / total);
  //     console.log(`${loaded}kb of ${total}kb | ${percent}%`);

  //     if (percent < 100) {
  //       setUploadPercentage(percent);
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
  // })
  //   .then((response) => response.json())
  //   .then((result) => {
  //     console.log("Success", result);
  //   })
  //   .catch((error) => {
  //     console.error("Error", error);
  //   });
  //   axios
  //     .post("http://localhost:5000/api/upload", formData)
  //     .then((res) => {
  //       console.log("data frame generated");
  //       setProcessed(false);
  //       setShowOptions(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       validJSON = false;
  //       alert("Invalid JSON URL !!");
  //     });
  // };

  // const handleConversion = (val) => {
  //   const formData = new FormData();
  //   formData.set("content_type", val);
  //   if (val == "excel") {
  //     setFileExtension("output.xlsx");
  //   } else if (val == "csv") {
  //     setFileExtension("output.csv");
  //   } else {
  //     setFileExtension("output.db");
  //   }
  //   axios
  //     .post(
  //       "http://localhost:5000/api/convert",
  //       formData,
  //       { responseType: "blob" }
  //     )
  //     .then((response) => {
  //       setUploadPercentage(100);
  //       setTimeout(() => {
  //         setUploadPercentage(0);
  //       }, 1000);
  //       setDownloadContent(response.data);
  //       console.log(response);
  //       setShowDownload(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setUploadPercentage(0);
  //       alert("Oops it Breaks!!" + err);
  //     });
  // }
  const [showCustomizeButton, setShowCustomizeButton] = useState(true);
  const handleCustomize = () => {
    setShowCustomizeButton(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("Url", inputUrl);
    formData.set("input_type", "url");
    axios
      .post("http://localhost:5000/api/upload", formData)
      .then((res) => {
        console.log("json loaded and checked");
        setLoading(false);

        if (res.data.message.startsWith("Error")) {
          alert(res.data.message);
        } else {
          setShowCustomizeButton(true);
          showModal();
        }
      })

      .catch((err) => {
        // display alert for wrong json
        setLoading(false);

        console.log(err);
        validJSON = false;
        setTimeout(() => {
          alert("Invalid JSON URL !!");
        }, 1000);
      });
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
        {showCustomizeButton ? (<Button
          title={"Customize"}
          classId={"downloadButton"}
          clickFunc={() => handleCustomize()}
        ></Button>) : ""}
        <Modal
          show={open}
          openFunc={showModal}
          closeFunc={hideModal}
        ></Modal>
      </>
      )

      {/* {uploadPercentage > 0 && (
        <div className="progressbar">
          <ProgressBar
            now={uploadPercentage}
            striped={true}
            animated
            label={`${uploadPercentage}%`}
            variant="success"
          />
        </div> 
        )} */}

    </div>
  );
};

export default FileUrl;

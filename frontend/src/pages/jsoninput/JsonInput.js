import { css } from "@emotion/react";
import axios from 'axios';
import { useState } from "react";
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory } from "react-router";
import RingLoader from "react-spinners/RingLoader";
import Editor from "../../components/editor/Editor";
import Footer from "../../components/footer/Footer";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar/Navbar";
import "./JsonInput.css";

// const socket = io("http://localhost:5000/");

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const JsonInput = () => {
  let history = useHistory();
  const [inputJson, setInputJson] = useState();

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
    setInputJson(e.target.value);
    console.log(typeof JSON.parse(e.target.value));
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  // const handleConversion = (val) => {
  //   const formData = new FormData();
  //   formData.set("content_type", val);
  //   console.log(val)
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
  //       alert("Oops it breaks " + err);
  //     });
  // }

  const handleCustomize = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("Json", inputJson);
    formData.set("input_type", "text");
    axios
      .post("http://localhost:5000/api/upload", formData)
      .then((res) => {
        console.log("json loaded and checked");
        setLoading(false);
        if (res.data.message.startsWith("Error")) {
           alert(res.data.message);
          // global_var.json = inputJson;
          // history.push('/jsonchecker');
        }
        else {
          showModal();
        }
      })
      .catch((err) => {
        // display alert for wrong json
        setLoading(false);
        // global_var.json = inputJson;
        //   history.push('/jsonchecker');
        console.log(err);
        validJSON = false;
        
       
        setTimeout(() => {
          alert("Invalid JSON Input !!");
        }, 1000);
      });
  };



  return (
    <div className="jsonInput">
      <Navbar></Navbar>
      <Container>
        <Row>
          <Col lg="12">
            <Editor process={true} onChange={changeHandler} click={() => handleCustomize()} ></Editor>
            <Modal
              show={open}
              openFunc={showModal}
              closeFunc={hideModal}
            ></Modal>
            <RingLoader color={color} loading={loading} css={override} size={150} />
          </Col>
          
        </Row>
      </Container>

      {/*      
      <div>
        <textarea rows="10" cols="10" type="text" onChange={changeHandler} />

        <button onClick={handleSubmission}>Submit</button>
      </div> */}
      {/* <Footer /> */}
    </div>
  );
};

export default JsonInput;

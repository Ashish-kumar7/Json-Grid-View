import axios from "axios";
import { useState } from "react";
import { Card, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import initialDF from "../../global_variable";
import Button from "../button/Button";
import "./Modal.css";
import { ProgressBar } from "react-bootstrap";
import tab001 from "../../assets/tab001.PNG";
import tab002 from "../../assets/tab002.PNG";
import tab003 from "../../assets/tab003.PNG";
import io from "socket.io-client";
import IOSwitch from "../../material-styles/IOSwitch";
const socket = io("http://localhost:5000/");

const CustomizeModal = (props) => {
  // for rendering page without reloading
  let [, setState] = useState();
  // store type of table
  const [tableType, setTableType] = useState(2);
  // store character to use in column name
  const [joinChar, setJoinChar] = useState("_");
  // store - want nested name of column or not
  const [parentCol, setParentCol] = useState(true);
  // store name of excel/csv
  const [sheetName, setSheetName] = useState("Sheet1");
  // store null value name
  const [nullName, setNullName] = useState("null");
  // store table name used for sql
  const [tableName, setTablename] = useState("table001");
  // store percentage of progress bar
  const [uploadPercentage, setUploadPercentage] = useState(0);
  // used to show disable button
  const [disable, setDisable] = useState(false);
  // styling id for disable button and download button
  const [buttonId, setButtonId] = useState("downloadButton");
  // store whether switch is on or not
  const [featureDisplay, setFeatureDisplay] = useState(false);
  // styling class for cards
  const [card1class, setcard1] = useState("look");
  const [card2class, setcard2] = useState("selectlook");
  const [card3class, setcard3] = useState("look");
  // for redirecting to another page
  let history = useHistory();

  // for getting updates regarding progress from backend
  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  // toggle switch for showing form
  const switchhandler = () => {
    if (featureDisplay) {
      setFeatureDisplay(false);
    } else {
      setFeatureDisplay(true);
    }
  };

  // on clicking process button this function is called and form data is sent to backend
  const handleSubmission = () => {
    if (disable) {
      console.log("disable true");
    } else {
      setDisable(true);
      setButtonId("disableButton");
      const formData = new FormData();
      formData.set("table_type", tableType);
      formData.set("join_char", joinChar);
      formData.set("parentCol", parentCol);
      formData.set("sheetName", sheetName);
      formData.set("tableName", tableName);
      formData.set("nullName", nullName);
      // process with options , data frame received
      axios
        .post("http://localhost:5000/api/process", formData)
        .then((res) => {
          // dataframe after converson is received and all other required properties are set here to display on preview page
          props.closeFunc();
          // global variables to use on another page
          initialDF.dfrow = res.data.tableRows;
          initialDF.dfcol = res.data.tableCols;
          initialDF.rows = res.data.rows_per_page;
          initialDF.records = res.data.total_records;
          initialDF.cols = res.data.columns;
          initialDF.searchColauto = {};
          initialDF.searchColmulti = {};
          initialDF.tableName = tableName;
          initialDF.splitDict = {};
          for (var i = 0; i < initialDF.cols.length; i++) {
            initialDF.searchColauto[initialDF.cols[i]] = "";
            initialDF.searchColmulti[initialDF.cols[i]] = new Set();
            initialDF.splitDict[initialDF.cols[i]] = {"split":1,"separator":'', "columns":['First Column']};
          }
          

          setUploadPercentage(100);
          setDisable(false);
          setButtonId("downloadButton");
          setTimeout(() => {
            setUploadPercentage(0);
          }, 1);
          history.push("/newpreview");
        })
        .catch((err) => {
          setDisable(false);
          setButtonId("downloadButton");
          setUploadPercentage(0);
          console.log(err);
          alert("Oops it breaks " + err);
        });
    }
  };
  
  // handlers to store form values
  const charhandler = (e) => {
    console.log("joiner changed");
    console.log(e.target.value);
    if(e.target.value == "." || e.target.value== "-")
      alert("SQL query will not work with " + e.target.value + " as join character");
    setJoinChar(e.target.value);
  };

  const sheethandler = (e) => {
    console.log(e.target.value);
    setSheetName(e.target.value);
  };

  const nullhandler = (e) => {
    console.log(e.target.value);
    setNullName(e.target.value);
  };

  const tableNamehandler = (e) => {
    console.log(e.target.value);
    setTablename(e.target.value);
  };

  const parenthandler = (e) => {
    console.log(e.target.value);
    setParentCol(e.target.value);
  };

  const tableselect = (val) => {
    setTableType(val);
    console.log("look" + val);
    if (val == "1") {
      setcard1("selectlook");
      setcard2("look");
      setcard3("look");
    } else if (val == "2") {
      setcard2("selectlook");
      setcard1("look");
      setcard3("look");
    } else {
      setcard3("selectlook");
      setcard1("look");
      setcard2("look");
    }
    setState();
  };

  return (
    <>
      <Modal
        className="customize"
        show={props.show}
        onHide={props.closeFunc}
        backdrop="static"
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="modalheader">
          <Modal.Title id="example-custom-modal-styling-title">
            Customization Page
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg="12">
              <h4>Select Table Type:</h4>
              <Row>
                <Col lg="4">
                  <Card onClick={() => tableselect("2")} className={card2class}>
                    <Card.Img variant="top" src={tab001} />
                    <Card.Body style={{ color: "grey" }}>
                      <Card.Text>
                        <Card.Title style={{ color: "black" }}>
                          Default View
                        </Card.Title>
                          Best suited for data-analysis and performing sql
                        queries.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg="4">
                  <Card onClick={() => tableselect("1")} className={card1class}>
                    <Card.Img variant="top" src={tab002} />
                    <Card.Body style={{ color: "grey" }}>
                      <Card.Text>
                        <Card.Title style={{ color: "black" }}>
                          Normalized View
                        </Card.Title>
                        Best suited for viewing/presenting data by business
                        user.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg="4">
                  <Card onClick={() => tableselect("3")} className={card3class}>
                    <Card.Img variant="top" src={tab003} />
                    <Card.Body style={{ color: "grey" }}>
                      <Card.Text>
                        <Card.Title style={{ color: "black" }}>
                          Normalized Indexed View
                        </Card.Title>
                        Normalized table with additional column of index for multiple values.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className="togglediv">
                <h6 style={{ fontWeight: "bold" }}>Advance Features</h6>
                <IOSwitch
                  className="switch"
                  checked={featureDisplay}
                  onChange={switchhandler}
                  name="checked"
                />
              </div>
              {featureDisplay ? (
                <div className="switchForm">
                  <Row className="entry" onChange={parenthandler}>
                    <h6>Do you want parent names in column? </h6>
                    <Col>
                      <InputGroup>
                        <InputGroup.Radio
                          name="parentType"
                          value={true}
                          aria-label="Radio button for following text input"
                          defaultChecked
                        />
                        Yes
                      </InputGroup>
                    </Col>
                    <Col>
                      <InputGroup>
                        <InputGroup.Radio
                          name="parentType"
                          value={false}
                          aria-label="Radio button for following text input"
                        />
                        No
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="entry2" onChange={charhandler}>
                      <h6>Join Column name with character</h6>
                      <select aria-label="Default select example">
                        <option>Open this select menu</option>
                        <option value="_" selected>
                          _
                        </option>
                        <option value=".">.</option>
                        <option value="-">-</option>
                      </select>
                    </Col>

                    <Col className="entry2" onChange={nullhandler}>
                      <Form.Label>Fill Missing Value</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Fill Missing Value"
                        defaultValue="null"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="6">
                      <Row className="entry3" onChange={sheethandler}>
                        <Form.Label>Sheet name</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="First name"
                          defaultValue="Sheet1"
                        />
                      </Row>
                    </Col>
                    <Col lg="6">
                      <Row className="entry3" onChange={tableNamehandler}>
                        <Form.Label>Table name</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="First name"
                          defaultValue="table001"
                        />
                      </Row>
                    </Col>
                  </Row>
                </div>
              ) : (
                <></>
              )}
            </Col>
          </Row>
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
          <Button
            title={"Process"}
            classId={buttonId}
            clickFunc={handleSubmission}
          ></Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomizeModal;
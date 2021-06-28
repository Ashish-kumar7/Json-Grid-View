import axios from "axios";
import { useState } from "react";
import { Card, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import artboard from "../../assets/table.png";
import initialDF from '../../global_variable';
import Button from "../button/Button";
import "./Modal.css";
import { ProgressBar } from "react-bootstrap";
import io from 'socket.io-client'
const socket = io("http://localhost:50000/");

const CustomizeModal = (props) => {
  const [tableType, setTableType] = useState(1);
  const [parentCol, setParentCol] = useState(true);
  const [sheetName, setSheetName] = useState("Sheet1");
  const [nullName, setNullName] = useState("null");
  const [tableName, setTablename] = useState("table001");

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [disable, setDisable] = useState(false);
  const [buttonId, setButtonId] = useState("downloadButton");

  const [totalRecords, setTotalRecords] = useState(1);
  const [rows, setRows] = useState(1);
  const [dataframe, setDataframe] = useState("");
  let history = useHistory();

  // for getting updates regarding progress
  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });

  const handleSubmission = () => {
    if (disable) {
      console.log("disable true");
    }
    else {
      setDisable(true);
      setButtonId("disableButton");
      const formData = new FormData();
      formData.set('table_type', tableType);
      formData.set('parentCol', parentCol);
      formData.set('sheetName', sheetName);
      formData.set('tableName', tableName);
      formData.set('nullName', nullName);
      // process with options , data frame received
      axios
        .post("http://localhost:50000/api/process", formData)
        .then((res) => {
          setDataframe(res);
          // console.log(typeof res.data.table);
          console.log("model pageeee");
          // console.log(dataframe);
          // response contains top 20 rows and total pages input
          props.closeFunc();
          initialDF.dfrow = res.data.tableRows;
          initialDF.dfcol = res.data.tableCols;
          initialDF.rows = res.data.rows_per_page;
          initialDF.records = res.data.total_records;
          initialDF.cols = res.data.columns;
          setUploadPercentage(100);
          setDisable(false);
          setButtonId("downloadButton");
          setTimeout(() => {
            setUploadPercentage(0);
          }, 1000);
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

  const tablehandler = (e) => {
    console.log(e.target.value);
    setTableType(e.target.value);
  }

  const sheethandler = (e) => {
    console.log(e.target.value);
    setSheetName(e.target.value);
  }

  const nullhandler = (e) => {
    console.log(e.target.value);
    setNullName(e.target.value);
  }

  const tableNamehandler = (e) => {
    console.log(e.target.value);
    setTablename(e.target.value);
  }
  
  const parenthandler = (e) => {
    console.log(e.target.value);
    setParentCol(e.target.value);
  }

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
            <Col>
              <Row className="entry" >
                <h6>Select Table Type: </h6>
                <Col>
                  <InputGroup>
                    <InputGroup.Radio
                      onChange={tablehandler}
                      name="tableType"
                      value="1"
                      aria-label="Radio button for following text input"
                      defaultChecked
                    />
                    <label>Generate Normal Table</label>
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroup.Radio
                      onChange={tablehandler}
                      name="tableType"
                      value="2"
                      aria-label="Radio button for following text input"
                    />
                    <label>Cross Product Table</label>
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroup.Radio
                      onChange={tablehandler}
                      name="tableType"
                      value="3"
                      aria-label="Radio button for following text input"
                    />
                    <label>Table with added index</label>
                  </InputGroup>
                </Col>
              </Row>

              <Row className="entry" onChange={parenthandler}>
                <h6>Include parent names in column</h6>
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
              <Row className="entry2" onChange={nullhandler}>
                <Form.Label>Fill Missing Value</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Fill Missing Value"
                  defaultValue="null"
                />
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


            </Col>
            <Col>
              <h4>Preview of how sheet will look</h4>
              <Card className="look" >
                <Card.Img variant="top" src={artboard} />
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    This is the quick preview of how the table will look.
                  </Card.Text>
                </Card.Body>
              </Card>
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
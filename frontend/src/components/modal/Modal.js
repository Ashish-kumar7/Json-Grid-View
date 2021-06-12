import "./Modal.css";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Button from "../button/Button";
import artboard from "../../assets/artboard.jpg";
import axios from "axios";
import { useHistory } from "react-router";
import { Container, Row, Col, InputGroup, Card, Form } from "react-bootstrap";
import PreviewPage from "../../pages/previewpage/PreviewPage";


const CustomizeModal = (props) => {
  const [tableType, setTableType] = useState(1);
  const [joinChar, setJoinChar] = useState(".");
  const [parentCol, setParentCol] = useState(true);
  // const [missingVal, setMissingVal] = useState("null");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [tableName, setTablename] = useState("table001");

  
  const [totalPage,setTotalPage]= useState(1);
  const [dataframe, setDataFrame]= useState("");
  let history = useHistory();
  // on clicking any process button
  const handleSubmission = () => {
    const formData = new FormData();

    formData.set('table_type', tableType);
    formData.set('join_char', joinChar);
    formData.set('parentCol', parentCol);
    formData.set('sheetName', sheetName);
    formData.set('tableName', tableName);
    // process with options , data frame received
    
    axios
      .post("http://localhost:5000/api/process", formData)
      .then((res) => {
        console.log("data frame generated");
        // response contains top 20 rows and total pages input
        props.closeFunc();
        // setTotalPage();
        // setDataFrame();
       history.push("/preview", {state: {'pages': {totalPage},'df':{dataframe}}});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tablehandler = (e) =>{
    console.log(e.target.value);
    setTableType(e.target.value);
  }

  const charhandler = (e) => {
    console.log(e.target.value);
    setJoinChar(e.target.value);
  }

  const sheethandler = (e) => {
    console.log(e.target.value);
    setSheetName(e.target.value);
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
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Customization Page
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Row className="entry" onChange={tablehandler}>
              <h6>Select Table Type: </h6>
              <Col>
                <InputGroup>
                  <InputGroup.Radio
                    name="tableType"
                    value="1"
                    aria-label="Radio button for following text input"
                  />
                  Table with index
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Radio
                    name="tableType"
                    value="2"
                    aria-label="Radio button for following text input"
                  />
                  Table without index
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Radio
                    name="tableType"
                    value="3"
                    aria-label="Radio button for following text input"
                  />
                  Table for Query
                </InputGroup>
              </Col>
            </Row>

            <Row className="entry" onChange={parenthandler}>
              <h6>Do you want parent names in column? </h6>
              <Col>
                <InputGroup>
                  <InputGroup.Radio
                    name="tableType"
                    value={true}
                    aria-label="Radio button for following text input"
                  />
                  Yes
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Radio
                    name="tableType"
                    value={false}
                    aria-label="Radio button for following text input"
                  />
                  No
                </InputGroup>
              </Col>
            </Row>
            <Row className="entry" onChange={charhandler}>
              <h6>Join Column name with character</h6>
              <select aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="." selected>.</option>
                <option value="-">-</option>
                <option value=".">_</option>
              </select>
            </Row>
            <Row className="entry" onChange={sheethandler}>
            <Form.Label>Sheet name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
            </Row>
            <Row className="entry" onChange={tableNamehandler}>
            <Form.Label>Table name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
            </Row>
          </Col>
          <Col>
          <h4>Example</h4>
            <Card style={{ width: "18rem", marginLeft:"20vh" }}>
              <Card.Img variant="top" src={artboard} />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button
          title={"Process"}
          class={"downloadButton"}
          clickFunc={handleSubmission}
        ></Button>
      </Modal.Body>
    </Modal>
    
    </>
  );
};

export default CustomizeModal;

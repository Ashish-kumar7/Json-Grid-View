import "./Modal.css";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Button from "../button/Button";
import artboard from "../../assets/table.png";
import axios from "axios";
import { useHistory } from "react-router";
import initialDF from '../../global_variable';
import { Container, Row, Col, InputGroup, Card, Form } from "react-bootstrap";
import PreviewPage from "../../pages/previewpage/PreviewPage";
import initialDataFrame from "../../global_variable";


const CustomizeModal = (props) => {
  const [tableType, setTableType] = useState(1);
  const [joinChar, setJoinChar] = useState(".");
  const [parentCol, setParentCol] = useState(true);
  // const [missingVal, setMissingVal] = useState("null");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [nullName, setNullName] = useState("null");
  const [tableName, setTablename] = useState("table001");

  
  const [totalRecords,setTotalRecords]= useState(1);
  const [rows,setRows]= useState(1);
  const [dataframe, setDataframe]= useState("");
  let history = useHistory();
  // on clicking any process button
  const handleSubmission = () => {
    const formData = new FormData();

    formData.set('table_type', tableType);
    formData.set('join_char', joinChar);
    formData.set('parentCol', parentCol);
    formData.set('sheetName', sheetName);
    formData.set('tableName', tableName);
    formData.set('nullName' , nullName);
    // process with options , data frame received
    
    axios
      .post("http://localhost:5000/api/process", formData)
      .then((res) => {
        // console.log("data frame generated");
        // console.log(res.data.table);
        setDataframe(res);
        // console.log(typeof res.data.table);
        console.log("model pageeee");
        // console.log(dataframe);
        // response contains top 20 rows and total pages input
        props.closeFunc();
        // setTotalPage(res.data.total_pages);
        // setRows(res.data.rows_per_page);
        // setDataFrame();
        initialDF.df = res.data.table;
        initialDF.rows = res.data.rows_per_page;
        initialDF.records = res.data.total_records;
        initialDF.cols = res.data.columns;
        console.log( initialDF.cols.length);
       history.push("/preview");
      })
      .catch((err) => {
        console.log(err);
        alert("Oops it breaks " + err);
      });
  };

  const tablehandler = (e) =>{
    console.log(e.target.value);
    setTableType(e.target.value);
  }

  const charhandler = (e) => {
    console.log("joiner changed")
    console.log(e.target.value);
    setJoinChar(e.target.value);
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
                  <label>Normal Table</label>
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
                  Cross Product Table
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
            <Row className="entry2" onChange={charhandler}>
              <h6>Join Column name with character</h6>
              <select aria-label="Default select example" >
                <option>Open this select menu</option>
                <option value="." selected>.</option>
                <option value="-">-</option>
                <option value="_">_</option>
              </select>
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
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button
          title={"Process"}
          classId={"downloadButton"}
          clickFunc={handleSubmission}
        ></Button>
      </Modal.Body>
    </Modal>
    
    </>
  );
};

export default CustomizeModal;

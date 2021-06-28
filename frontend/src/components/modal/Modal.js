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
import IOSwitch from '../../material-styles/IOSwitch'
const socket = io("http://localhost:5000/");

const CustomizeModal = (props) => {
  let [, setState] = useState();
  const [tableType, setTableType] = useState(1);
  const [joinChar, setJoinChar] = useState("_");
  const [parentCol, setParentCol] = useState(true);
  // const [missingVal, setMissingVal] = useState("null");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [nullName, setNullName] = useState("null");
  const [tableName, setTablename] = useState("table001");

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [disable ,setDisable ]= useState(false);
  const [buttonId,setButtonId] = useState("downloadButton");

  const [totalRecords, setTotalRecords] = useState(1);
  const [rows, setRows] = useState(1);
  const [dataframe, setDataframe] = useState("");
  const [featureDisplay, setFeatureDisplay] = useState(false);
  const [card1class, setcard1] = useState("selectlook");
  const [card2class, setcard2] = useState("look");
  const [card3class, setcard3] = useState("look");
  let history = useHistory();

  // for getting updates regarding progress
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



  // on clicking any process button
  const handleSubmission = () => {

    // const formDataSave = new FormData();
    // formDataSave.set('tableName', tableName);
    // axios
    //   .post("http://localhost:5000/api/check-table", formDataSave)
    //   .then((response) => {
    //     if (response.data && response.data.message && response.data.message.startsWith("Error")) {
    //       alert(response.data.message);
    //     } else {

      if(disable){
        console.log("disable true");
      }
      else{
      setDisable(true);
      setButtonId("disableButton");
    const formData = new FormData();
    formData.set('table_type', tableType);
    formData.set('join_char', joinChar);
    formData.set('parentCol', parentCol);
    formData.set('sheetName', sheetName);
    formData.set('tableName', tableName);
    formData.set('nullName', nullName);
    // process with options , data frame received
    axios
      .post("http://localhost:5000/api/process", formData)
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
        initialDF.searchColauto ={};
        initialDF.searchColmulti = {};
        for(var i =0;i<initialDF.cols.length;i++){
          initialDF.searchColauto[initialDF.cols[i]] = "";
          initialDF.searchColmulti[initialDF.cols[i]] = new Set();
        }
        // console.log(res.data.tableRows);
        setUploadPercentage(100);
        setDisable(false);
        setButtonId("downloadButton");
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
        // console.log(initialDF.cols.length);
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
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    //   alert("Oops table-checker breaks " + err);
    // });
  };

  const tablehandler = (e) => {
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

  const tableselect = (val)=>{
    setTableType(val);
    console.log("look"+val);
    if(val == "1"){
      setcard1("selectlook");
      setcard2("look");
      setcard3("look");
    }
    else if(val == "2"){
      setcard2("selectlook");
      setcard1("look");
      setcard3("look");
    }
    else{
      setcard3("selectlook");
      setcard1("look");
      setcard2("look");
    }
    
    setState();
    // card.style.border ="10px solid black";
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
            {/* <Col lg="3">
             

              */}
              {/*  */}
              {/*  */}
              {/* 
              
              
            </Col> */}
            <Col lg="12">
            <h4>Select Table Type:</h4>
              <Row>
                <Col lg="4">
                <Card onClick={()=>tableselect("1")} className={card1class} >
                <Card.Img variant="top" src={artboard} />
                <Card.Body>
                  {/* <Card.Title>Card Title</Card.Title> */}
                  <Card.Text>
                  <InputGroup>
                    <InputGroup.Radio
                      onChange={tablehandler}
                      name="tableType"
                      value="1"
                      aria-label="Radio button for following text input"
                      defaultChecked
                    />
                    <Card.Title>Normal Table</Card.Title>
                  </InputGroup>
                    Some quick example text to build on the card title and make up
                    the bulk of the card's content.
                  </Card.Text>
                </Card.Body>
              </Card>
                </Col>
                <Col lg="4">
                <Card onClick={()=>tableselect("2")} className={card2class} >
                <Card.Img variant="top" src={artboard} />
                <Card.Body>
                  {/* <Card.Title>Card Title</Card.Title> */}
                  <Card.Text>
                  <InputGroup>
                    <InputGroup.Radio
                      onChange={tablehandler}
                      name="tableType"
                      value="2"
                      aria-label="Radio button for following text input"
                    />
                    <Card.Title>Cross Product Table</Card.Title>
                  </InputGroup>
                    Some quick example text to build on the card title and make up
                    the bulk of the card's content.
                  </Card.Text>
                </Card.Body>
              </Card>
                </Col>
                <Col lg="4">
                <Card onClick={()=>tableselect("3")} className={card3class} >
                <Card.Img variant="top" src={artboard} />
                <Card.Body style={{color:"brown"}}>
                  {/* <Card.Title>Card Title</Card.Title> */}
                  <Card.Text>
                  <InputGroup>
                    <InputGroup.Radio
                      onChange={tablehandler}
                      name="tableType"
                      value="3"
                      aria-label="Radio button for following text input"
                    />
                    <Card.Title style={{color:"black"}}>Table with added index</Card.Title>
                  </InputGroup>
                    Some quick example text to build on the card title and make up
                    the bulk of the card's content.
                  </Card.Text>
                </Card.Body>
              </Card>
                </Col>
              </Row>
              <div className="togglediv">
                <h6>Advance Features</h6>
              <IOSwitch
                  className="switch"
                  checked={featureDisplay}
                  onChange={switchhandler}
                  name="checked"
                />
              </div>
              {featureDisplay?(
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
              <Row className="entry2" onChange={charhandler}>
                <h6>Join Column name with character</h6>
                <select aria-label="Default select example" >
                  <option>Open this select menu</option>
                  <option value="_" selected>_</option>
                  <option value=".">.</option>
                  <option value="-">-</option>

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
              </div>):<></>}
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

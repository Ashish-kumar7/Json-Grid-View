import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import "./SplitModal.css";
import { ProgressBar } from "react-bootstrap";
import io from "socket.io-client";
import initialDataFrame from "../../global_variable";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router";
import Button from "../button/Button";

const socket = io("http://localhost:5000/");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SplitModal = (props) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(1);
  console.log("lllllll");
  console.log(initialDataFrame.cols);
  console.log(initialDataFrame.splitDict);

  // if(initialDataFrame.splitDict[initialDataFrame.cols[0]]==undefined){
  //   initialDataFrame.splitDict = {};
  //           for (var i = 0; i < initialDataFrame.cols.length; i++) {
           
  //           initialDataFrame.splitDict[initialDataFrame.cols[i]] = {"split":1,"separator":'', "columns":['First Column']};
  //           // colWithIdx[i] = response.data.columns[i];
  //         }
  // }
  // for rendering page without reloading
  let [, setState] = useState();
  // store percentage of progress bar
  const [uploadPercentage, setUploadPercentage] = useState(0);
  // used to show disable button
  const [disable, setDisable] = useState(false);
  // styling id for disable button and download button
  const [buttonId, setButtonId] = useState("downloadButton");
  const [selectionsplit, setSelectionSplit] =  useState(initialDataFrame.cols);
  const [splitNo, setSplitNo] = useState(2);
  const [delimeter, setDelimeter] = useState("_");
  const [splitdata, setSplitData] = useState(initialDataFrame.splitDict);
  let history = useHistory();
 
  // useEffect(()=>{
  //   console.log("Split data updated");
  //   setSplitData(initialDataFrame.splitDict);
  // },[]);

  useEffect(() => {
    console.log("Split data updated");
   
    setSelectionSplit(initialDataFrame.cols);
    setSplitData(initialDataFrame.splitDict);
  });


  // for getting updates regarding progress from backend
  socket.on("progress", (val) => {
    setUploadPercentage(val);
    console.log(val);
  });


  let colList = [];
  let colWithIdx = [];
  for (var i = 0; i < selectionsplit.length; i++) {
    let number = i;
    colWithIdx[number] = selectionsplit[i];
    colList.push(
      <td>
        <ListItem
          button
          selected={selectedIndex === number}
          onClick={(event) => handleListItemClick(event, number)}
        >
          <ListItemText primary={selectionsplit[i]} />
        </ListItem>
      </td>
    );
  }

  const handleListItemClick = (event, index) => {
    event.preventDefault();
    setState({});
    console.log(splitdata);
    console.log(colWithIdx[index]);
    setSelectedIndex(index);
    splitcolList = [];
    setSplitNo(splitdata[colWithIdx[selectedIndex]]["split"]);
    setDelimeter(splitdata[colWithIdx[selectedIndex]]["separator"]);
    for (var i = 0; i < splitdata[colWithIdx[selectedIndex]]["split"]; i++) {
      let number = i;
      splitcolList.push(
        <Row
          className="entry3"
          onChange={(event) => splitColListhandler(event, number)}
        >
          <Col>
            <Form.Label>Column {number + 1} Name:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Column Value"
            />
          </Col>
          <Col>
            <ListItem   
            >
              <ListItemText primary={
                splitdata[colWithIdx[selectedIndex]]["columns"][number]
              } />
            </ListItem>
          </Col>
        </Row>
      );
    }
  };

 

  const delimeterhandler = (event) => {
    event.preventDefault();
    let newdata = splitdata;
    newdata[colWithIdx[selectedIndex]]["separator"] = event.target.value;
    initialDataFrame.splitDict[colWithIdx[selectedIndex]]["separator"] = event.target.value;
    setSplitData(newdata);
    setDelimeter(event.target.value);
  };

  const splitColListhandler = (event, number) => {
    event.preventDefault();
    console.log(number);
    console.log(event.target.value);
    let newdata = splitdata;
    newdata[colWithIdx[selectedIndex]]["columns"][number] = event.target.value;
    initialDataFrame.splitDict[colWithIdx[selectedIndex]]["columns"][number] = event.target.value;
    setSplitData(newdata);
    setState({});
  };

  const increasehandler = (event) => {
    event.preventDefault();
    let num = splitdata[colWithIdx[selectedIndex]]["split"];
    console.log(num);
    let newdata = splitdata;
    newdata[colWithIdx[selectedIndex]]["split"] = num + 1;
    initialDataFrame.splitDict[colWithIdx[selectedIndex]]["split"] = num + 1;
    setSplitData(newdata);
    console.log(splitdata);
    setSplitNo(num + 1);
  };

  const decreasehandler = (event) => {
    event.preventDefault();
    let num = splitdata[colWithIdx[selectedIndex]]["split"];
    if (num > 2) {
      let newdata = splitdata;
      newdata[colWithIdx[selectedIndex]]["split"] = num - 1;
      initialDataFrame.splitDict[colWithIdx[selectedIndex]]["split"] = num - 1;
      setSplitData(newdata);
      setSplitNo(num - 1);
    }
  };
  
  let splitcolList = [];
  console.log("kkkkkkkkkkkkkkk");
  console.log(splitdata);
  for (var i = 0; i < splitdata[colWithIdx[selectedIndex]]["split"]; i++) {
    let number = i;
    splitcolList.push(
        <Row
        className="entry3"
        onChange={(event) => splitColListhandler(event, number)}
      >
        <Col>
          <Form.Label>Column {number + 1} Name:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Column Value"
          />
        </Col>
        <Col>
          <ListItem   
          >
            <ListItemText primary={
              splitdata[colWithIdx[selectedIndex]]["columns"][number]
            } />
          </ListItem>
        </Col>
      </Row>
    );
  }

 

  const splitQueryhandler = (event)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.set("split_dict", JSON.stringify(splitdata));
    axios.post("http://localhost:5000/api/splitQuery", formData)
    .then((response) => {
        //resets the data in grid to initial dataframe
        if (response.status == 200) {
        
            console.log(response);
            initialDataFrame.afterSplit = response;
            initialDataFrame.dfrow = response.data.tableRows;
            initialDataFrame.dfcol = response.data.tableCols;
            initialDataFrame.cols = response.data.columns;
            initialDataFrame.searchColauto = {};
            initialDataFrame.searchColmulti = {};
            initialDataFrame.splitDict = {};
            for (var i = 0; i < response.data.columns.length; i++) {
            initialDataFrame.searchColauto[response.data.columns[i]] = "";
            initialDataFrame.searchColmulti[response.data.columns[i]] = new Set();
             initialDataFrame.splitDict[response.data.columns[i]] = {"split":1,"separator":'', "columns":['First Column']};
            colWithIdx[i] = response.data.columns[i];
          }
          
         
            // setSelectionSplit()
          
            props.closeFunc();
           
        } else {
          alert("Split not performed");
        }
      })
      .catch((err) => {
        props.closeFunc();
         alert("Server not started");
        console.log(err);
      });
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
            Split Column Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="splitcol">
            <table>
              <tbody>
                <tr>{colList}</tr>
              </tbody>
            </table>
          </div>
          <div>
            <Row>
              <Col lg="6">
                <Row className="entry3">
                  <Form.Label>
                    No. of Splits for " {colWithIdx[selectedIndex]} "
                  </Form.Label>
                  <Col>
                    <button onClick={(event)=>decreasehandler(event)}>-</button>
                  </Col>
                  <Col>
                    <Form.Control
                      required
                      type="number"
                      placeholder="First name"
                      value={splitdata[colWithIdx[selectedIndex]]["split"]}
                      defaultValue={splitNo}
                      disabled
                      readOnly={false}
                    />
                  </Col>
                  <Col>
                    <button onClick={(event)=>increasehandler(event)}>+</button>
                  </Col>
                </Row>
              </Col>
              <Col lg="6">
                <Row className="entry3" >
                  <Form.Label>
                    Enter delimeter for " {colWithIdx[selectedIndex]} " to split
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={splitdata[colWithIdx[selectedIndex]]["separator"]}
                    onChange={(event)=>delimeterhandler(event)}
                  />
                </Row>
              </Col>
            </Row>
            <Row className="splitvalues">{splitcolList}</Row>
          </div>
          <Button title="Split" classId="downloadButton" clickFunc={(event)=>splitQueryhandler(event)}></Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SplitModal;

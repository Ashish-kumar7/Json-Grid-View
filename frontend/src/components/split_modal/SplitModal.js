import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import "./SplitModal.css";
import initialDataFrame from "../../global_variable";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "../button/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "yellow",
  },
  colVal:{
    fontWeight: "bold",
    paddingTop: "4vh",
  },
}));

const SplitModal = (props) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(1);
  console.log(initialDataFrame.cols);
  console.log(initialDataFrame.splitDict);
  // for rendering page without reloading
  let [, setState] = useState();
  // store column names
  const [selectionsplit, setSelectionSplit] = useState(initialDataFrame.cols);
  // store number of splits for selected column
  const [splitNo, setSplitNo] = useState(1);
  // store delimeter for selected column
  const [delimeter, setDelimeter] = useState("_");
  // dictionary to store info of all columns related to splitting
  const [splitdata, setSplitData] = useState(initialDataFrame.splitDict);

  // update variables on rendering the page
  useEffect(() => {
    setSelectionSplit(initialDataFrame.cols);
    setSplitData(initialDataFrame.splitDict);
  });

  // column list
  let colList = [];
  let colWithIdx = [];
  for (var i = 0; i < selectionsplit.length; i++) {
    let number = i;
    colWithIdx[number] = selectionsplit[i];
    colList.push(
      <td>
        <ListItem
          className={classes.root}
          button
          selected={selectedIndex === number}
          onClick={(event) => handleListItemClick(event, number)}
        >
          <ListItemText primary={selectionsplit[i]} />
        </ListItem>
      </td>
    );
  }

  // function called when column is selected
  const handleListItemClick = (event, index) => {
    event.preventDefault();
    setState({});
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
            <Form.Label>Enter Column {number + 1} Name:</Form.Label>
            <Form.Control required type="text" placeholder="Column Value" />
          </Col>
          <Col>
            <ListItem>
            <p className={classes.colVal}> {splitdata[colWithIdx[selectedIndex]]["columns"][number]}</p>
            </ListItem>
          </Col>
        </Row>
      );
    }
  };

  // function called when delimeter is changed
  const delimeterhandler = (event) => {
    event.preventDefault();
    let newdata = splitdata;
    newdata[colWithIdx[selectedIndex]]["separator"] = event.target.value;
    initialDataFrame.splitDict[colWithIdx[selectedIndex]]["separator"] =
      event.target.value;
    setSplitData(newdata);
    setDelimeter(event.target.value);
  };

  // function called when new column names are updated
  const splitColListhandler = (event, number) => {
    event.preventDefault();
    let newdata = splitdata;
    newdata[colWithIdx[selectedIndex]]["columns"][number] = event.target.value;
    initialDataFrame.splitDict[colWithIdx[selectedIndex]]["columns"][number] =
      event.target.value;
    setSplitData(newdata);
    setState({});
  };

  // function called when number of splits increased
  const increasehandler = (event) => {
    event.preventDefault();
    let num = splitdata[colWithIdx[selectedIndex]]["split"];
    let newdata = splitdata;
    newdata[colWithIdx[selectedIndex]]["split"] = num + 1;
    initialDataFrame.splitDict[colWithIdx[selectedIndex]]["split"] = num + 1;
    setSplitData(newdata);
    console.log(splitdata);
    setSplitNo(num + 1);
  };

  // function called when number of splits decreased
  const decreasehandler = (event) => {
    event.preventDefault();
    let num = splitdata[colWithIdx[selectedIndex]]["split"];
    if (num > 1) {
      let newdata = splitdata;
      newdata[colWithIdx[selectedIndex]]["split"] = num - 1;
      initialDataFrame.splitDict[colWithIdx[selectedIndex]]["split"] = num - 1;
      setSplitData(newdata);
      setSplitNo(num - 1);
    }
  };

  // according to number of splits display text box to rename columns
  let splitcolList = [];
  for (var i = 0; i < splitdata[colWithIdx[selectedIndex]]["split"]; i++) {
    let number = i;
    splitcolList.push(
      <Row
        className="entry3"
        onChange={(event) => splitColListhandler(event, number)}
      >
        <Col>
          <Form.Label>Column {number + 1} Name:</Form.Label>
          <Form.Control required type="text" placeholder="Column Value" />
        </Col>
        <Col>
          <ListItem>
            <p className={classes.colVal}> {splitdata[colWithIdx[selectedIndex]]["columns"][number]}</p>
          </ListItem>
        </Col>
      </Row>
    );
  }

  // function called when split button is clicked.
  const splitQueryhandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("split_dict", JSON.stringify(splitdata));
    axios
      .post("http://localhost:5000/api/splitQuery", formData)
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
            initialDataFrame.searchColmulti[response.data.columns[i]] =
              new Set();
            initialDataFrame.splitDict[response.data.columns[i]] = {
              split: 1,
              separator: "",
              columns: ["First Column"],
            };
            colWithIdx[i] = response.data.columns[i];
          }
          props.closeFunc();
        } else {
          alert("Split not performed");
          props.closeFunc();
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
                <Row className="splitentry">
                  <Form.Label>
                    No. of Splits for " {colWithIdx[selectedIndex]} "
                  </Form.Label>
                  <Col lg="1">
                    <button onClick={(event) => decreasehandler(event)}>
                      -
                    </button>
                  </Col>
                  <Col lg="3">
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
                    <button onClick={(event) => increasehandler(event)}>
                      +
                    </button>
                  </Col>
                </Row>
              </Col>
              <Col lg="6">
                <Row className="entry3">
                  <Form.Label>
                    Enter delimeter for " {colWithIdx[selectedIndex]} " to split
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={splitdata[colWithIdx[selectedIndex]]["separator"]}
                    onChange={(event) => delimeterhandler(event)}
                  />
                </Row>
              </Col>
            </Row>
            <Row className="splitvalues">{splitcolList}</Row>
          </div>
          <Button
            title="Split"
            classId="downloadButton"
            clickFunc={(event) => splitQueryhandler(event)}
          ></Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SplitModal;

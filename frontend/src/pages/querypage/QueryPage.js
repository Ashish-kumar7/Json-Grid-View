import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Navbar from "../../components/navbar/Navbar";
import PaginationP from "../../components/pagination/Pagination";
import "../../components/scrollbar/ScrollBar.css";
import initialDataFrame from "../../global_variable";
import "../previewpage/dataframeStyle.css";
import "./QueryPage.css";
import "../previewpage/PreviewPage.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  num: {
    marginLeft: "36%",
    marginRight: "30%",
    padding: "2%",
  },
}));

const QueryPage = (props) => {
  const classes = useStyles();

  console.log("Query Page");

  const [table, setTable] = useState(initialDataFrame.df);

  const queryText = "";

  const [data, setdata] = useState({
    setqueryText: "",
  });

  let queryInput = React.createRef();

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
  }

  // index to get col name
  // page change function for df preview
  const onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    console.log(currentPage);
    const offset = (currentPage - 1) * pageLimit;
    const formData = new FormData();
    formData.set("page_number", currentPage);
    axios
      .post("http://localhost:5000/api/page", formData)
      .then((response) => {
        console.log(response);
        setTable(response.data.table);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //On fetchButtonClick
  const onFetchButtonClick = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("query_text", data.setqueryText);
    axios
      .post("http://localhost:5000/api/query", formData)
      .then((response) => {
        console.log(response);
        setTable(response.data.table);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="previewpage">
        <div className="preview ">
          <Container className="display scrollbar scrollbar-secondary  ">
            <div dangerouslySetInnerHTML={{ __html: table }} />
          </Container>
        </div>
        <div className={classes.num}>
          <PaginationP
            key={initialDataFrame.records}
            totalRecords={initialDataFrame.records}
            pageLimit={initialDataFrame.rows}
            pageNeighbours={1}
            onPageChanged={onPageChanged}
          />
        </div>
        <Container className="queryInside">
          <Row>
            <Row className="query">
              <form id="message-form">
                <input
                  ref={queryInput}
                  // name="message"
                  placeholder="Type your SQL query"
                  required
                  autocomplete="off"
                  id="setqueryText"
                  name="setqueryText"
                  value={data.setqueryText}
                  onChange={(e) => handle(e)}
                />
                <button onClick={onFetchButtonClick}>Fetch</button>
              </form>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default QueryPage;

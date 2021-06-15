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
    let [, setState] = useState();
    console.log("Query Page");

    const [table, setTable] = useState(initialDataFrame.df);
    const [uniqueRowsPerPage, setUniqueRowsPerPage] = useState(1);
    const [uniqueTotalRecords, setUniqueTotalRecords] = useState(1);

    const [showValue, setShowValue] = useState(false);
    let [values, setValues] = useState([]);
    let initcheck2 = {};

    const queryText="";

    const[data,setdata]=useState({
        setqueryText:""
    })

    let queryInput = React.createRef();
    // create dictionary to store selected values for columns
    const dictIntermediate = {};
    for (var i = 0; i < initialDataFrame.cols.length; i++) {
        dictIntermediate[initialDataFrame.cols[i]] = new Set();
        initcheck2[initialDataFrame.cols[i]] = new Array(20).fill(false);
    }
    let [dict, setDict] = useState(dictIntermediate);

    function handle(e){
        const newdata ={...data};
        newdata[e.target.id]=e.target.value;
        setdata(newdata);
    }



    const [selectedIndex, setSelectedIndex] = useState(1);
    let colWithIdx = [];

    const [check2, setCheck2] = useState(initcheck2);

    // create list to display all columns
    let colList = [];

    for (var i = 0; i < initialDataFrame.cols.length; i++) {
        dictIntermediate[initialDataFrame.cols[i]] = new Set();

        let number = i;
        colWithIdx[number] = initialDataFrame.cols[i];
        colList.push(
            <ListItem
                button
                selected={selectedIndex === number}
                onClick={(event) => handleListItemClick(event, number)}
            >
                <ListItemText className="textList" primary={initialDataFrame.cols[i]} />
            </ListItem>
        );
    }

    // create list to display unique values of column
    let valueList = [];
    for (var i = 0; i < values.length; i++) {
        let number = i;

        valueList.push(
            <ListItem key={values[number]} dense button onClick={(event) => handleValueToggle(event, number)}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={check2[colWithIdx[selectedIndex]][number]}
                        tabIndex={-1}
                        disableRipple
                        key={values[number]}
                    />
                </ListItemIcon>
                <ListItemText primary={values[number]} />
            </ListItem>
        );
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
                                    id="setqueryText" name="setqueryText" 
                                    value={data.setqueryText}
                                    onChange={(e)=>handle(e)}
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

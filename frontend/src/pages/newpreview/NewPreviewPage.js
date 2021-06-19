import "./NewPreviewPage.css";
import SplitPane, { Pane } from "react-split-pane";
import initialDataFrame from "../../global_variable";
import PaginationP from "../../components/pagination/Pagination";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Dropdown } from "semantic-ui-react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";

// const columns = initialDataFrame.dfcol;

// const rows = initialDataFrame.dfrow;

const defaultColumnProperties = {
  filterable: true,
  width: 120,
};

const selectors = Data.Selectors;

const handleFilterChange = (filter) => (filters) => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}

// style
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  num: {
    // color:'black',
    // backgroundColor:'#00b0ff',
    marginLeft: "36%",
    marginRight: "30%",
    padding: "2%",
  },
  numval: {
    padding: "4%",
    marginLeft: "10%",
  },
}));
const NewPreviewPage = () => {
  console.log("new preview page");
  console.log(initialDataFrame.dfrow);
  const [resultTotalRecords, setResultTotalRecords] = useState(
    initialDataFrame.records
  );
  const [selectedPage, setSelectedPage] = useState(1);
  const [gridRows, setGridRows] = useState(initialDataFrame.dfrow);
  const [gridCols, setGridCols] = useState(initialDataFrame.dfcol);

  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const filteredRows = getRows(gridRows, filters);
  // const [table, setTable] = useState(initialDataFrame.df);
 
    console.log(resultTotalRecords);
  const [resultRows, setResultRows] = useState(gridRows);
  let colWithIdx = [];
  const [selectedIndex, setSelectedIndex] = useState(1);

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
        // setResultTotalRecords(response.data.total_records);
        console.log("result total records " + resultTotalRecords);
        // initialDataFrame.dfrow = response.data.tableRows;
        // initialDataFrame.dfcol = response.data.tableCols;

        setGridCols(response.data.tableCols);
        setGridRows(response.data.tableRows);
        // setTable(response.data.table);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // create list to display all columns
  let colList = [];

  for (var i = 0; i < initialDataFrame.cols.length; i++) {
    // dictIntermediate[initialDataFrame.cols[i]] = new Set();
    let number = i;
    colWithIdx[number] = initialDataFrame.cols[i];
    colList.push(
      <th>
        <ListItem
          button
          selected={selectedIndex === number}
          // onClick={(event) => handleListItemClick(event, number)}
        >
          <ListItemText
            className="textList"
            primary={initialDataFrame.cols[i]}
          />
        </ListItem>
      </th>
    );
  }

  return (
    <div className="newpreview">
      <SplitPane split="vertical" defaultSize="65%">
        <Pane className="left" minSize="65%">
          <div className="dataframeview">
            {/* <div
              className="insidetable"
              dangerouslySetInnerHTML={{ __html: table }}
            /> */}
            <ReactDataGrid
              key={gridRows}
              columns={gridCols.map((c) => ({
                ...c,
                ...defaultColumnProperties,
              }))}
              rowGetter={(i) => filteredRows[i]}
              rowsCount={filteredRows.length}
              minHeight={500}
              toolbar={<Toolbar enableFilter={true} />}
              onAddFilter={(filter) => setFilters(handleFilterChange(filter))}
              onClearFilters={() => setFilters({})}
            />
          </div>
          <div className={classes.num}>
            <PaginationP
              key={resultTotalRecords}
              totalRecords={resultTotalRecords}
              pageLimit={resultRows}
              pageNeighbours={1}
              onPageChanged={onPageChanged}
            />
          </div>
        </Pane>
        <Pane className="right" maxSize="35%">

        <div className={classes.num}>
            <PaginationP
              key={resultTotalRecords}
              totalRecords={resultTotalRecords}
              pageLimit={resultRows}
              pageNeighbours={1}
              onPageChanged={onPageChanged}
            />
          </div>
        </Pane>
      </SplitPane>
    </div>
  );
};

export default NewPreviewPage;

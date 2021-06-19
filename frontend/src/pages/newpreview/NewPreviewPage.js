import "./NewPreviewPage.css";
import SplitPane, { Pane }  from "react-split-pane";
import initialDataFrame from "../../global_variable";
import PaginationP from "../../components/pagination/Pagination";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Dropdown } from "semantic-ui-react";
import DataGrid from 'react-data-grid';

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' }
];

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
  const classes = useStyles();

  const [table, setTable] = useState(initialDataFrame.df);
  const [resultTotalRecords, setResultTotalRecords] = useState(
    initialDataFrame.records
  );
  const [resultRows, setResultRows] = useState(initialDataFrame.rows);
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
        setTable(response.data.table);
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
      <th >
        <Dropdown>
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
        </Dropdown>
      </th>
    );
  }

  const options = [
    { key: 'angular', text: 'Angular', value: 'angular' },
    { key: 'css', text: 'CSS', value: 'css' },
    { key: 'design', text: 'Graphic Design', value: 'design' },
    { key: 'ember', text: 'Ember', value: 'ember' },
    { key: 'html', text: 'HTML', value: 'html' },
    { key: 'ia', text: 'Information Architecture', value: 'ia' },
    { key: 'javascript', text: 'Javascript', value: 'javascript' },
    { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
    { key: 'meteor', text: 'Meteor', value: 'meteor' },
    { key: 'node', text: 'NodeJS', value: 'node' },
    { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
    { key: 'python', text: 'Python', value: 'python' },
    { key: 'rails', text: 'Rails', value: 'rails' },
    { key: 'react', text: 'React', value: 'react' },
    { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
    { key: 'ruby', text: 'Ruby', value: 'ruby' },
    { key: 'ui', text: 'UI Design', value: 'ui' },
    { key: 'ux', text: 'User Experience', value: 'ux' },
  ]

  return (
    <div className="newpreview">
      <SplitPane split="vertical" defaultSize="65%" >
        <Pane className="left" minSize="65%">
          <div className="dataframeview">
            <div className="table-header">
              <table border="1" className="mystylehead">
                <thead>
                  <tr style={{ "text-align": "right" }}>
                    <th>
                      <ListItem
                       
                        
                        // onClick={(event) => handleListItemClick(event, number)}
                      >
          
                      </ListItem>
                      
                    </th>
                    {colList}
                  </tr>
                </thead>
              </table>
            </div>
            <div  className="insidetable" dangerouslySetInnerHTML={{ __html: table }} />
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
        {/* <Dropdown fluid multiple selection text="File">
    <Dropdown.Menu className="dropdown">
      <Dropdown.Item text="New" />
      <Dropdown.Item text="Open..." description="ctrl + o" />
      <Dropdown.Item text="Save as..." description="ctrl + s" />
      <Dropdown.Item text="Rename" description="ctrl + r" />
      <Dropdown.Item text="Make a copy" />
      <Dropdown.Item icon="folder" text="Move to folder" />
      <Dropdown.Item icon="trash" text="Move to trash" />
      <Dropdown.Divider />
      <Dropdown.Item text="Download As..." />
      <Dropdown.Item text="Publish To Web" />
      <Dropdown.Item text="E-mail Collaborators" />
    </Dropdown.Menu>
  </Dropdown> */}
  <DataGrid columns={columns} rows={rows} />
        </Pane>
      </SplitPane>
     
    </div>
  );
};

export default NewPreviewPage;

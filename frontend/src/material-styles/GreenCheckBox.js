import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox";

const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      backgroundColor:'white',
      "&$checked": {
        color: green[600],
        backgroundColor:'white',
      }
    },
    checked: {}
  })((props) => <Checkbox color="default" {...props} />);

  export default GreenCheckbox;
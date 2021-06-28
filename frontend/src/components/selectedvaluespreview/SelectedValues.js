import "./SelectedValues.css";
import { Table } from "react-bootstrap";
import Value from "../value/Value";

const SelectedValues = (props) => {
//   const dict = {
//     name: new Set(["Aditi", "Abhishek", "Ashish", "Prakriti"]),
//     age: new Set([20, 21]),
//     subject: new Set(["history", "computer"]),
//   };
  let dict = props.dict;
  let table = [];

  for (var key in dict) {
    let values = [];

    for (let item of dict[key]) {
      values.push(<Value val={item}></Value>);
    }

    table.push(
      <tr>
        <th>{key}</th>
        <td>{values}</td>
      </tr>
    );
  }

  return (
    <>
    <div className="valueTable">
      <Table striped bordered hover variant="dark" > 
        <tbody>{table}</tbody>
      </Table>
      </div>
      
    </>
  );
};

export default SelectedValues;

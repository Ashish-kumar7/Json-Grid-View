import IconBox from "../iconbox/IconBox";
import Button from "../button/Button";
import { Container, Row, Col } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

const FileUrlLayout = (props) => {
  return (
    <Container>
      <Row>
        <Col lg="4">
          <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
          <Button title={"Convert to Excel"} classId={"uploadButton"} clickFunc={props.buttonFunc}></Button>
        </Col>
        <Col lg="4">
          <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
          <Button title={"Convert To CSV"} classId={"uploadButton"} clickFunc={props.buttonFunc}></Button>
        </Col>
        <Col lg="4">
          <IconBox iconType={faDatabase} size={"2x"}></IconBox>
          <Button title={"Save to Hive"} classId={"uploadButton"} clickFunc={props.buttonFunc}></Button>
        </Col>
      </Row>
    </Container>
  );

}

export default FileUrlLayout;

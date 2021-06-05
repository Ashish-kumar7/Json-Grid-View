import IconBox from "../components/IconBox";
import Button from "../components/Button";
import { Container, Row, Col } from "react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

const FileUrlLayout = () => {
return(
    <Container>
    <Row>
      <Col lg="4">
        <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
        <Button title={"Convert to Excel"} class={"uploadButton"}></Button>
      </Col>
      <Col lg="4">
        <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
        <Button title={"Convert To CSV"} class={"uploadButton"}></Button>
      </Col>
      <Col lg="4">
        <IconBox iconType={faDatabase} size={"2x"}></IconBox>
        <Button title={"Save to Hive"} class={"uploadButton"}></Button>
      </Col>
    </Row>
  </Container>
);

}


export default FileUrlLayout;


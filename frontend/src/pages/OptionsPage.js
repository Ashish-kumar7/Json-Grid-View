import "./OptionsPage.css";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IconBox from "../components/IconBox";

const OptionsPage = () => {
  return (
    <div className="optionPage">
      <Navbar></Navbar>
      <Container>
        <Row>
          <Col lg="4">
            <IconBox iconType={faFileUpload} size={"10x"}></IconBox>
            <Button
              id={"btn1"}
              title={"Upload A File"}
              class={"optionButton"}
              link={"/file-upload"}
            ></Button>
          </Col>
          <Col lg="4">
            <IconBox iconType={faLink} size={"10x"}></IconBox>
            <Button
              id={"btn2"}
              title={"Provide A URL"}
              class={"optionButton"}
              link={"/file-url"}
            ></Button>
          </Col>
          <Col lg="4">
            <IconBox iconType={faEdit} size={"10x"}></IconBox>
            <Button
              id={"btn3"}
              title={"Go To Editor"}
              class={"optionButton"}
              link={"/json-input"}
            ></Button>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </div>
  );
};

export default OptionsPage;

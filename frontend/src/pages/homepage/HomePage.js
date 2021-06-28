import { Row, Col, Container } from "react-bootstrap";
import gif from "../../assets/homegif.gif";
import "./HomePage.css";
import Button from "../../components/button/Button";

// This is home page , it contains a button which will redirect to options page where you can select a file to upload or give a url or write your own json

const HomePage = () => {
  return (
    <div className="homepage">
      <Container>
        <Row>
          <Col lg="5">
            <div className="jumbotron mt-5">
              <h1 class="display-4">JSON GRID VIEWER</h1>
              <p class="lead">
                An application to convert json to csv or excel sheet, storing
                data in hadoop and an editor to write or correct your own json and convert
                it.
              </p>
            </div>
            <Button
              title={"Start Converting"}
              classId={"startButton"}
              link={"/options"}
            ></Button>
          </Col>
          <Col lg="7">
            <div id="bg">
              <img id="gif" src={gif} alt="loading..." />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;

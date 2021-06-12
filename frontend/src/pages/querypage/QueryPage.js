import "./QueryPage.css";
import { Container, Row } from "react-bootstrap";
import Navbar from "../../components/navbar/Navbar";
const QueryPage = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="queryPage">
        <Container className="queryInside">
          <Row>
            <Row className="display">
                
            </Row>
            <Row className="query">
              <form id="message-form">
                <input
                  name="message"
                  placeholder="Message"
                  required
                  autocomplete="off"
                />
                <button>Send</button>
              </form>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default QueryPage;

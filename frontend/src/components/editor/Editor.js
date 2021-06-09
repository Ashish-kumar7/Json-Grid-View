import { Container, Row, Col } from "react-bootstrap";
import './Editor.css'

const Editor = () => {
  return (
    <div className="editor">
      <Container>
        <Row>
          <Col lg="6">
            <div className="editorInput">
              <textarea
                
                rows="30"
                cols="100"
                className="area"
              ></textarea>
            </div>
          </Col>
          <Col lg="6"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Editor;

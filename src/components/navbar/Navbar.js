import "./Navbar.css";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const Navbar = () => {
  return (
    <div className="jsonnavbar">
      <nav className="navbar navbar-light">
        <div className="container-fluid">
          <a href="/" className="navbar-brand">
            JSON Grid Viewer
          </a>
          <form className="d-flex">
            <Row>
              <Col>
                <Link to="/json-input">
                  <button id="b2" class="btn btn-lg ">
                    Editor
                  </button>
                </Link>
              </Col>
              <Col className="buttons">
                <Link to="/file-upload">
                  <button id="b3" class="btn btn-lg ">
                    Upload
                  </button>
                </Link>
              </Col>
              <Col className="buttons">
                <Link to="/file-url">
                  <button id="b4" class="btn btn-lg ">
                    URL
                  </button>
                </Link>
              </Col>
              <Col className="buttons">
                <Link to="/jsonchecker">
                  <button id="b5" class="btn btn-lg ">
                    JSON Checker
                  </button>
                </Link>
              </Col>
            </Row>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="jsonnavbar" >
            <nav className="navbar navbar-light">
                <div className="container-fluid">
                    <a href="/" className="navbar-brand">JSON Grid Viewer</a>
                    <form className="d-flex">
                        <Link to="/json-input"><button id="b1" class="btn btn-lg btn-info" >Editor</button></Link>
                        <Link to="/file-upload"><button id="b2" class="btn btn-lg " >Upload</button></Link>
                        <Link to="/file-url"><button id="b3" class="btn btn-lg " >URL</button></Link>
                        <button id="b4" class="btn btn-lg " >Query</button>
                        <Link to="/jsonchecker"><button id="b5" class="btn btn-lg ">JSON Checker</button></Link>
                        {/* <Link to="/query-page"><button id="b6" class="btn btn-lg btn-primary">SQL _Queries</button></Link> */}
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
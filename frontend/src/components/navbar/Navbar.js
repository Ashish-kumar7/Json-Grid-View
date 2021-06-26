import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="jsonnavbar" >
            <nav className="navbar navbar-light">
                <div className="container-fluid">
                    <a href="/" className="navbar-brand">JSON Grid Viewer</a>
                    <form className="d-flex">
                        {/* Button to open the editor Page*/}
                        <Link to="/json-input"><button id="b1" class="btn btn-lg btn-info" >Editor</button></Link>
                        {/* Button to open the Upload Page */}
                        <Link to="/file-upload"><button id="b2" class="btn btn-lg " >Upload</button></Link>
                        {/* Button to open the URL Page */}
                        <Link to="/file-url"><button id="b3" class="btn btn-lg " >URL</button></Link>
                        {/* Button to open the Json Checker Page */}
                        <Link to="/jsonchecker"><button id="b5" class="btn btn-lg ">JSON Checker</button></Link>
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
import './Navbar.css'

const Navbar = () => {
    return(
    <div className="jsonnavbar" >
       <nav className="navbar navbar-light">
        <div className="container-fluid">
            <a className="navbar-brand">JSON Grid Viewer</a>
            <form className="d-flex">
            <button id="b1" class="btn btn-lg btn-info" >Editor</button>
            <button id="b2" class="btn btn-lg " >Upload</button>
            <button id="b3" class="btn btn-lg " >URL</button>
            <button id="b4" class="btn btn-lg " >Query</button>
            <button id="b5" class="btn btn-lg ">Search</button>
            <button id="b6" class="btn btn-lg btn-primary">Search</button>
            </form>
        </div>
       </nav>
     


    </div>
    );
}

export default Navbar;
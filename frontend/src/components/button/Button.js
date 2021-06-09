import {Link} from 'react-router-dom'

const Button = (props) => {
  return(
    <ul className="navbar-nav" onClick={props.clickFunc}>
    <li className="nav-item">
      <div className={props.class} id={props.id}>
        <Link to={props.link} className="nav-link">
          {props.title}
        </Link>
      </div>
    </li>
  </ul>
  );
}

export default Button;
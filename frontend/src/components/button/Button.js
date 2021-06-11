import { Link } from 'react-router-dom'
import { string } from 'prop-types';

const Button = ({
  clickFunc,
  title,
  id,
  link,
  classId
}) => {
  return (
    <ul className="navbar-nav" onClick={clickFunc}>
      <li className="nav-item">
        <div className={classId} id={id}>
          <Link to={link} className="nav-link">
            {title}
          </Link>
        </div>
      </li>
    </ul>
  );
}

Button.propTypes = {
  title: string,
  id: string,
  classId: string
};

Button.defaultProps = {
  title: '',
  id: '',
  classId: ''
};

export default Button;
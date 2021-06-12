import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { string } from 'prop-types';

const IconBox = (props) => {
    return (
        <div className="box">
            <Link><FontAwesomeIcon size={props.size} className="fas" icon={props.iconType} ></FontAwesomeIcon></Link>
        </div>
    );
}

IconBox.propTypes = {
    size: string
};

IconBox.defaultProps = {
    size: ''
};

export default IconBox;
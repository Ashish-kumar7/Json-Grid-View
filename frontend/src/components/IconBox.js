import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {Link} from 'react-router-dom'

const IconBox = (props) => {
    return(
        <div className="box">
           <Link><FontAwesomeIcon size={props.size} className="fas" icon={props.iconType} ></FontAwesomeIcon></Link>
        </div>
    );
  }
  
  export default IconBox;
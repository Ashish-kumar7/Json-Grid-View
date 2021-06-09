import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGithub, faInstagram, faFacebookF} from '@fortawesome/free-brands-svg-icons'
import "./SocialIcons.css";

const SocialIcons = () => {
  return (
    <Fragment>
      <span className="d-inline">
        <Link to="/" className="iconf d-inline">
          <FontAwesomeIcon icon={faFacebookF} size="lg" />
        </Link>
      </span>
      <span className="d-inline">
        <Link to="/" className="iconf">
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </Link>
      </span>
      <span className="d-inline">
        <Link to="/" className="iconf">
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </Link>
      </span>
    </Fragment>
  );
};

export default SocialIcons;
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faFacebookF, faLinkedinIn, faAppStore } from '@fortawesome/free-brands-svg-icons'
import "./SocialIcons.css";

const SocialIcons = () => {
  return (
    <Fragment>
      <span className="d-inline">
        <Link to="/home" className="iconf d-inline">
          <FontAwesomeIcon icon={faFacebookF} size="lg" />
        </Link>
      </span>
      <span className="d-inline">
        <Link to="/home" className="iconf">
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </Link>
      </span>
      <span className="d-inline">
        <Link to="/home" className="iconf">
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </Link>
      </span>
      <span className="d-inline">
        <Link to="/home" className="iconf">
          <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
        </Link>
      </span>
      <span className="d-inline">
        <Link to="/home" className="iconf">
          <FontAwesomeIcon icon={faAppStore} size="lg" />
        </Link>
      </span>
    </Fragment>
  );
};

export default SocialIcons;
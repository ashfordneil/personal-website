import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import Link from "components/Link";

import css from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  const [view, setView] = useState(true);

  const left = view ? css.active : css.left;
  const right = view ? css.right : css.active;
  return (
    <div className={css.wrapper}>
      <header className={css.main}>
        <div className={left}>
          <h2 className={css.myname}>Neil Ashford</h2>
          <FontAwesomeIcon
            onClick={() => setView(false)}
            className={css.icon}
            icon={faAngleDoubleRight}
          />
        </div>
        <div className={right}>
          <FontAwesomeIcon
            onClick={() => setView(true)}
            className={css.icon}
            icon={faAngleDoubleLeft}
          />
          <nav className={css.links}>
            <Link icon={faGithub} href="https://github.com/ashfordneil">
              github
            </Link>
            <Link icon={faLinkedin} href="https://linkedin.com/in/ashfordneil0">
              linkedin
            </Link>
            <Link icon={faEnvelope} href="mailto:ashfordneil0@gmail.com">
              mail
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;

import React from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import Link from "components/Link";

import css from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.main}>
        <h1 className={css.name}>
          <strong className={css.bold}>Neil</strong> Ashford
        </h1>
        <div className={css.links}>
          <Link icon={faGithub} href="https://github.com/ashfordneil">
            github
          </Link>
          <Link icon={faLinkedin} href="https://linkedin.com/in/ashfordneil0">
            linkedin
          </Link>
          <Link icon={faEnvelope} href="mailto:ashfordneil0@gmail.com">
            mail
          </Link>
        </div>
      </div>
      <div className={css.band} />
    </div>
  );
};

export default Navbar;

import { memo } from "react";
import { useMediaQuery } from "@mui/material";

import styles from "./Footer.module.css";
import heroku_icon from "../../../images/heroku.svg";
import github_icon from "../../../images/github_icon.png";

function Footer(): JSX.Element {
  const isSmall = useMediaQuery("(max-width: 650px)");

  const heroku = (
    <>
      <div>Powered by </div>
      <a
        href="https://heroku.com"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={heroku_icon} alt="Heroku Logo" width={76} height={20} />
      </a>
    </>
  );

  const info = (
    <>
      <div className={styles.info_wrapper}>
        <div className={styles.text_1}>Contact:</div>
        <div className={styles.text_2}>rwu13795@gmail.com</div>
      </div>

      <div className={styles.info_wrapper}>
        <div className={styles.text_1}>Source code:</div>
        <div className={styles.text_2}>
          <a href="https://github.com/rwu13795?tab=repositories">
            <img src={github_icon} alt="github_icon" className={styles.icon} />
          </a>
        </div>
      </div>
    </>
  );

  const copyRight = (
    <>
      <a
        href="https://github.com/rwu13795?tab=repositories"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className={styles.link}>
          &copy; 2022 by <span className={styles.text_2}>Ray Wu</span>
        </div>
      </a>
    </>
  );

  return (
    <div className={styles.main_grid}>
      <div className={styles.left_grid}>{isSmall ? info : heroku}</div>

      <div className={styles.mid_grid}>
        {isSmall ? (
          <>
            <div>{heroku}</div>
            <div>{copyRight}</div>
          </>
        ) : (
          info
        )}
      </div>

      {!isSmall && <div className={styles.right_grid}>{copyRight}</div>}
    </div>
  );
}

export default memo(Footer);

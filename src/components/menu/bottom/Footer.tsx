import { memo } from "react";

import styles from "./Footer.module.css";

function Footer(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.main_grid}>
        <div className={styles.left_grid}>
          <div>
            <div className={styles.link_text}>Contact</div>
            <div>rwu13795.work@gmail.com</div>
          </div>
        </div>

        <div className={styles.right_grid}>
          <a
            href="https://github.com/rwu13795?tab=repositories"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className={styles.link}>&copy; 2022 By Ray Wu</div>
          </a>
          <a
            href="https://heroku.com"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {/* <div className={styles.logo}>
              <div>Powered by </div>
              <Image
                src={page === "home" ? "/heroku.svg" : "/heroku-white.svg"}
                alt="Heroku Logo"
                width={76}
                height={20}
              />
            </div> */}
          </a>
        </div>
      </div>
    </main>
  );
}

export default memo(Footer);

import { memo } from "react";
import { useNavigate } from "react-router-dom";

import { scrollToTop } from "../utils";

// UI //
import styles from "./Page404.module.css";
import { Button } from "@mui/material";
import image from "../images/nothing.webp";

function Page404(): JSX.Element {
  const navigate = useNavigate();

  function backToHomePage() {
    scrollToTop();
    navigate("/chat");
  }

  return (
    <main id="main_body" className={styles.main}>
      <h1>Nothing to see here! Get lost!</h1>
      <img src={image} alt="bg" className={styles.img_wrapper} />
      <Button variant="outlined" onClick={backToHomePage}>
        Back to home page
      </Button>
    </main>
  );
}

export default memo(Page404);

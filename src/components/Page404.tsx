import { memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

function Page404(): JSX.Element {
  const navigate = useNavigate();

  function backToHomePageHandler() {
    navigate("/");
  }

  return (
    <main>
      <h1>Nothing here! Get lost!</h1>
      <button onClick={backToHomePageHandler}>Back to home page</button>
    </main>
  );
}

export default memo(Page404);

import { memo } from "react";
import { useNavigate } from "react-router-dom";

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

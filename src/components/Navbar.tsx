import { memo } from "react";

function Navbar(): JSX.Element {
  return (
    <nav>
      <section>
        <h1>I am the Navbar</h1>
      </section>
    </nav>
  );
}

export default memo(Navbar);

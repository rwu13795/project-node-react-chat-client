import { memo } from "react";

function MainNavbar(): JSX.Element {
  return (
    <nav>
      <section>
        <h1>I am the Navbar</h1>
      </section>
    </nav>
  );
}

export default memo(MainNavbar);

export function resizeMenu() {
  let dragDistance = 0,
    startClientX = 0;

  let handle = document.getElementById("resize_handle");
  let leftMenu = document.getElementById("left_menu");
  let righMenu = document.getElementById("right_menu");
  if (!handle || !leftMenu || !righMenu) return;

  // otherwise, move the DIV from anywhere inside the DIV:
  handle.onmousedown = dragOnMouseDown;
  handle.ontouchstart = dragOnTouchStart;

  function dragOnMouseDown(e: MouseEvent) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    startClientX = e.clientX;

    if (leftMenu && righMenu) {
      leftMenu.style.cursor = "grab";
      righMenu.style.cursor = "grab";
    }
    document.onmouseup = clearListeners;
    // call a function whenever the cursor moves:
    document.onmousemove = dragElement_mouse;
  }

  function dragOnTouchStart(e: TouchEvent) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    startClientX = e.touches[0].clientX;

    document.ontouchend = clearListeners;
    // call a function whenever the cursor moves:
    document.ontouchmove = dragElement_touch;
  }

  function dragElement_mouse(e: MouseEvent) {
    e.preventDefault();

    // calculate the new cursor position:
    dragDistance = startClientX - e.clientX;
    startClientX = e.clientX;

    resize();
  }

  function dragElement_touch(e: TouchEvent) {
    e.preventDefault();

    // calculate the new cursor position:
    dragDistance = startClientX - e.touches[0].clientX;
    startClientX = e.touches[0].clientX;

    resize();
  }

  function resize() {
    console.log("startClientX", startClientX);
    console.log("distance", dragDistance);

    // set the element's new position:
    if (!handle || !leftMenu || !righMenu) return;

    console.log("leftMenu.scrollWidth", leftMenu.scrollWidth);
    console.log("handle.offsetLeft", handle.offsetLeft);
    console.log("righMenu.scrollWidth", righMenu.scrollWidth);
    // console.dir(leftMenu);
    let width = leftMenu.scrollWidth - dragDistance;
    if (width > 550) {
      leftMenu.style.width = 550 + "px";
      righMenu.style.width = "calc(100vw - 550px)";
    } else if (width < 275) {
      leftMenu.style.width = 275 + "px";
      righMenu.style.width = "calc(100vw - 275px)";
    } else {
      leftMenu.style.width = width + "px";
      righMenu.style.width = righMenu.scrollWidth + dragDistance + "px";
    }

    let pos = handle.offsetLeft - dragDistance;
    if (pos > 510) {
      handle.style.left = 520 + "px";
    } else if (pos < 250) {
      handle.style.left = 250 + "px";
    } else {
      handle.style.left = pos + "px";
    }
  }

  function clearListeners() {
    if (leftMenu && righMenu) {
      leftMenu.style.cursor = "auto";
      righMenu.style.cursor = "auto";
    }
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchstart = null;
    document.ontouchmove = null;
  }
}

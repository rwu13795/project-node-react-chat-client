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

    startClientX = e.touches[0].clientX;

    document.ontouchend = clearListeners;
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
    // set the element's new position:
    if (!leftMenu || !righMenu) return;

    let width = leftMenu.scrollWidth - dragDistance;

    if (width > 675) {
      leftMenu.style.width = 675 + "px";
      // right menu has to overlap on the left menu, the 25px difference is
      // to make the background of right menu to overlap the "resize_handle_wrapper"
      // take a look at the HomePage CSS for more detail
      righMenu.style.width = "calc(100vw - 650px)";
    } else if (width < 101) {
      leftMenu.style.width = 100 + "px";
      righMenu.style.width = "calc(100vw - 75px)";
    } else {
      leftMenu.style.width = width + "px";
      righMenu.style.width =
        window.innerWidth - (leftMenu.scrollWidth - 25) + dragDistance + "px";
      // 100vw - (current leftMenu width - 25 difference) + distance
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

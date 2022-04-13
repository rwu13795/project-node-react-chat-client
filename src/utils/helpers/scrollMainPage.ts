export function scrollMainPage(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  direction: string
) {
  if (!ref || !ref.current) return;

  if (direction === "right") {
    ref.current.scrollTo({
      left: ref.current.scrollWidth / 2,
      behavior: "smooth",
    });
  } else {
    ref.current.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }
}

export function scrollElementTop(
  ref: React.MutableRefObject<HTMLDivElement | null>
) {
  if (!ref || !ref.current) return;

  ref.current.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

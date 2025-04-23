export const isTouchEvent = (e: React.TouchEvent) => {
  const currentElement = e.target as Element;

  if (
    currentElement &&
    currentElement?.nodeName !== "path" &&
    currentElement?.nodeName !== "circle"
  ) {
    return false;
  }

  const el = currentElement as SVGElement;

  if (!el?.dataset?.value) {
    return false;
  }

  return true;
};

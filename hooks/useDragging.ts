import React, { useRef, useState } from "react";

const useDragging = () => {
  const [swaggerWidth, setSwaggerWidth] = useState(600); // initial width
  const dragging = useRef(false);

  // Mouse event handlers
  const handleMouseDown = () => {
    dragging.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging.current) {
      setSwaggerWidth(Math.max(200, e.clientX)); // minimum width 200px
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = "";
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return {
    swaggerWidth,
    handleMouseDown,
  };
};

export default useDragging;

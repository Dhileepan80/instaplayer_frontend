import { useEffect, useState } from "react";

export default function useResizer() {
  const [isMobileView, setMobileView] = useState(window.innerWidth <= 880);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 880) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    });
  }, []);

  return [isMobileView];
}
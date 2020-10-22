import { useEffect, useCallback, useState } from "react";

const useContextMenu = (outerRef, open) => {

  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [menu, showMenu] = useState(false);

  const handleContextMenu = useCallback(
    event => {
      event.preventDefault();
      if (open) {
        showMenu(true);
      } else {
        showMenu(false);
      }

      if (outerRef && outerRef.current.contains(event.target)) {
        console.log('called 1')
        setXPos(`${event.pageX}px`);
        setYPos(`${event.pageY}px`);
        showMenu(true);
      } else {
        showMenu(false);
      }
    },
    [showMenu, outerRef, setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });
  return { xPos, yPos, menu };
};

export default useContextMenu;
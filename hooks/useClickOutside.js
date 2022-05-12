import { useEffect, useRef, useState } from 'react';

export default function useClickOutside(initState) {
  const [show, setShow] = useState(initState);
  const triggerRef = useRef(null);
  const nodeRef = useRef(null);

  const delta = 6;
  let startX;
  let startY;

  const onClickOutside = (e) => {
    if (e.type === 'mousedown') {
      startX = e.pageX;
      startY = e.pageY;
      return;
    }

    if (e.type === 'mouseup') {
      if (
        Math.abs(startX - e.pageX) < delta &&
        Math.abs(startY - e.pageY) < delta
      ) {
        if (triggerRef.current && triggerRef.current.contains(e.target)) {
          return setShow(!show);
        }
        if (nodeRef.current && !nodeRef.current.contains(e.target)) {
          return setShow(false);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside, true);
    document.addEventListener('mouseup', onClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', onClickOutside, true);
      document.removeEventListener('mouseup', onClickOutside, true);
    };
  });

  return {
    triggerRef,
    nodeRef,
    show,
    setShow,
  };
}

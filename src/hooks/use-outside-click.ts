import { RefObject, useEffect } from 'react';

export const useOutsideClick = ({
  elementRef,
  onOutsideClick,
}: {
  elementRef: RefObject<HTMLDivElement>;
  onOutsideClick: () => void;
}) => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.currentTarget as Node)
      ) {
        onOutsideClick();
      }
    }

    document.addEventListener('click', handleOutsideClick, true);

    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [elementRef, onOutsideClick]);
};

import { useRef } from 'react';
import styles from '../../styles/Overlay.module.scss';

function Overlay({ children, onClose }) {
  const overlayRef = useRef(null);
  const closeModal = (e) => {
    e.stopPropagation();
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={closeModal} ref={overlayRef}>
      {children}
    </div>
  );
}

export default Overlay;

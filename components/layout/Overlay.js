import styles from '../../styles/Overlay.module.scss';

function Overlay({ children }) {
  return <div className={styles.overlay}>{children}</div>;
}

export default Overlay;

import Overlay from './Overlay';

import styles from '../../styles/Spinner.module.scss';

function Spinner() {
  return (
    <Overlay>
      <div className={styles.spinner}></div>
    </Overlay>
  );
}

export default Spinner;

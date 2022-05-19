import { FaFileImage } from 'react-icons/fa';
import styles from '../../styles/FileInput.module.scss';

function FileInput({ name, label, onInputChange }) {
  return (
    <div className={styles.formGroup}>
      <input
        type='file'
        name={name}
        id={name}
        onChange={onInputChange}
        accept='image/png, image/jpeg, image/jpg'
      />
      <label htmlFor={name}>
        {label} <FaFileImage />
      </label>
    </div>
  );
}

export default FileInput;

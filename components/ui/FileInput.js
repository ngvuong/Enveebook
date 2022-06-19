import { forwardRef } from 'react';
import { FaFileImage } from 'react-icons/fa';
import styles from '../../styles/FileInput.module.scss';

const FileInput = forwardRef(({ name, label, onInputChange }, ref) => {
  return (
    <div className={styles.formGroup}>
      <input
        type='file'
        name={name}
        id={name}
        onChange={onInputChange}
        ref={ref}
        accept='image/png, image/jpeg, image/jpg'
      />
      <label htmlFor={name}>
        {label} <FaFileImage />
      </label>
    </div>
  );
});

FileInput.displayName = 'FileInput';

export default FileInput;

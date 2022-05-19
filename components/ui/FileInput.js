import { useRef } from 'react';
import { FaFileImage } from 'react-icons/fa';
import styles from '../../styles/FileInput.module.scss';

function FileInput({ name, label, onInputChange }) {
  const divRef = useRef(null);

  const onSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const { name: fileName } = file;

      divRef.current.textContent = fileName;
    } else {
      divRef.current.textContent = '';
    }
  };

  return (
    <div className={styles.formGroup}>
      <input
        type='file'
        name={name}
        id={name}
        onChange={onInputChange}
        onInput={onSelect}
        accept='image/png, image/jpeg, image/jpg'
      />
      <div ref={divRef}></div>
      <label htmlFor={name}>
        {label} <FaFileImage />
      </label>
    </div>
  );
}

export default FileInput;

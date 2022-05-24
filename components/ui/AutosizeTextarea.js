import { forwardRef } from 'react';
import styles from '../../styles/AutosizeTextarea.module.scss';
const AutosizeTextarea = forwardRef((props, ref) => {
  const onChange = (e) => {
    props.onChange(e);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <textarea
      {...props}
      onChange={onChange}
      className={styles.textarea}
      ref={ref}
    />
  );
});

export default AutosizeTextarea;

import styles from '../../styles/AutosizeTextarea.module.scss';
function AutosizeTextarea(props) {
  const onChange = (e) => {
    props.onChange(e);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <textarea {...props} onChange={onChange} className={styles.textarea} />
  );
}

export default AutosizeTextarea;

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useClickOutside from '../../hooks/useClickOutside';

import styles from '../../styles/Search.module.scss';

function Search({ users, type = 'default', onSelect }) {
  const [results, setResults] = useState(users);
  const [active, setActive] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalSearchTerm, setOriginalSearchTerm] = useState('');
  const linkRef = useRef(null);
  const { show, setShow, nodeRef } = useClickOutside(false);

  useEffect(() => {
    if (!show) {
      setActive(-1);

      if (searchTerm) {
        setResults(
          users.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else setResults(users);
    }
  }, [show, searchTerm, users]);

  const filterResults = (e) => {
    const value = e.target.value;
    setActive(-1);
    setShow(true);
    setSearchTerm(value);
    setOriginalSearchTerm(value);
    setResults(
      users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && active !== -1) {
      linkRef.current.click();
    }

    if (e.keyCode === 38) {
      e.preventDefault();
      setActive((prev) => {
        const newActive = prev === -1 ? results.length - 1 : prev - 1;
        setSearchTerm(
          newActive === -1 ? originalSearchTerm : results[newActive].name
        );

        return newActive;
      });
    }

    if (e.keyCode === 40) {
      setActive((prev) => {
        const newActive = prev === results.length - 1 ? -1 : prev + 1;
        setSearchTerm(
          newActive === -1 ? originalSearchTerm : results[newActive].name
        );

        return newActive;
      });
    }
  };

  return (
    <div className={styles.search}>
      <input
        type='text'
        id='searchInput'
        value={searchTerm}
        onInput={filterResults}
        onFocus={() => setShow(true)}
        onClick={() => setShow(true)}
        onKeyDown={onKeyDown}
        placeholder='Search'
        autoComplete='off'
        spellCheck='false'
        autoFocus={type === 'default' ? false : true}
      />
      {show && results.length > 0 && (
        <div className={styles.results} ref={nodeRef}>
          {type === 'default'
            ? results.map((user, index) => (
                <Link key={user._id} href={`/profile/${user._id}`}>
                  <a
                    className={active === index ? styles.active : undefined}
                    ref={active === index ? linkRef : undefined}
                  >
                    {user.name}
                  </a>
                </Link>
              ))
            : results.map((user, index) => (
                <span
                  key={user._id}
                  className={active === index ? styles.active : undefined}
                  onClick={() => onSelect(user._id)}
                  ref={active === index ? linkRef : undefined}
                >
                  {user.name}
                </span>
              ))}
        </div>
      )}
    </div>
  );
}

export default Search;

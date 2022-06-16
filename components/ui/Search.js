import { useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

import { FaSearch } from 'react-icons/fa';
import styles from '../../styles/Search.module.scss';
import Link from 'next/link';

function Search({ users }) {
  const [results, setResults] = useState(users);
  const { show, setShow, nodeRef, triggerRef } = useClickOutside(false);

  const filterResults = (e) => {
    setResults(
      users.filter((user) =>
        user.name.toLowerCase().startsWith(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.searchBar}>
        <label htmlFor='searchInput'>
          <FaSearch />
        </label>
        <div className={styles.search}>
          <input
            type='text'
            id='searchInput'
            // value={searchTerm}
            onChange={filterResults}
            onFocus={() => setShow(true)}
            placeholder='Search'
            ref={triggerRef}
          />
          {show && (
            <div className={styles.results} ref={nodeRef}>
              {results.map((user) => (
                <Link key={user._id} href={`/profile/${user._id}`}>
                  {user.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Search;

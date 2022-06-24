import Search from './Search';

import { FaSearch } from 'react-icons/fa';
import styles from '../../styles/SearchBar.module.scss';

function SearchBar({ users }) {
  return (
    <section className={styles.container}>
      <div className={styles.searchBar}>
        <label htmlFor='searchInput'>
          <FaSearch />
        </label>
        <Search users={users} />
      </div>
    </section>
  );
}

export default SearchBar;

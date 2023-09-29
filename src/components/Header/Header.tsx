import Search from '../Search/Search';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.product}>
        <h1 className={styles.logo}>toMeme</h1>
        <p>Bring the best memes to your people</p>
      </div>

      <Search />
    </header>
  );
}

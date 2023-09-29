import { ChangeEvent, useState } from 'react';
import styles from './Search.module.css';

export default function Search() {
  const [value, setValue] = useState('');

  return (
    <div className={styles.container}>
      <label htmlFor='search' className={styles.label}>
        Search:
      </label>
      <input
        id='search'
        className={styles.input}
        type='text'
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
    </div>
  );
}

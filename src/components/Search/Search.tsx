import { ChangeEvent, useRef, useState } from 'react';
import { useMemes } from '../../contexts/memes-context';
import styles from './Search.module.css';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';

export default function Search() {
  const memes = useMemes();
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebounce(value, 500);
  const dropdownMemes = !!debouncedValue
    ? memes.filter((meme) => meme.name.toLowerCase().includes(debouncedValue))
    : [];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    elementRef: dropdownRef,
    onOutsideClick: () => {
      setValue('');
    },
  });

  return (
    <div ref={dropdownRef} className={styles.container}>
      <label htmlFor='search' className={styles.label}>
        Search:
      </label>
      <input
        id='search'
        className={styles.input}
        type='text'
        placeholder='Meme...'
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />

      {debouncedValue !== '' && (
        <div className={styles.dropdown}>
          {dropdownMemes.map((meme) => (
            <Link key={meme.id} to={`/editor/${encodeURIComponent(meme.name)}`}>
              <div className={styles.dropdownItem}>
                <img
                  className={styles.dropdownImage}
                  src={meme.url}
                  alt={meme.name}
                  width={100}
                />
                <p>{meme.name}</p>
              </div>
            </Link>
          ))}

          {dropdownMemes.length === 0 && (
            <div className={styles.dropdownEmpty}>
              <span>No memes found with a given name</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

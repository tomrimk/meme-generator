import styles from './Gallery.module.css';
import { useMemes } from '../../contexts/memes-context';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_MEMES_PER_PAGE = 22;
const MEMES_PER_PAGE = 10;

export default function Gallery() {
  const memes = useMemes();
  const [visibleMemes, setVisibleMemes] = useState(
    memes.slice(0, INITIAL_MEMES_PER_PAGE),
  );

  const updateVisibleMemesOnScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const appHeight = document.querySelector('.App')?.clientHeight ?? 0;

    if (scrollPosition + windowHeight >= appHeight) {
      setVisibleMemes(memes.slice(0, visibleMemes.length + MEMES_PER_PAGE));
    }
  }, [memes, visibleMemes.length]);

  useEffect(() => {
    window.addEventListener('scroll', updateVisibleMemesOnScroll);

    return () => {
      window.removeEventListener('scroll', updateVisibleMemesOnScroll);
    };
  }, [updateVisibleMemesOnScroll]);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 id='templates'>Templates</h2>
      </div>

      <div className={styles.templates}>
        {visibleMemes.map((meme) => (
          <figure key={meme.id} className={styles.figure}>
            <img className={styles.image} src={meme.url} alt={meme.name} />

            <figcaption className={styles.caption}>{meme.name}</figcaption>

            <div className={styles.overlay} />
            <Link
              className={styles.actions}
              to={`/editor/${encodeURI(meme.name)}`}
            >
              <button className={styles.button}>Choose template</button>
            </Link>
          </figure>
        ))}
      </div>
    </div>
  );
}

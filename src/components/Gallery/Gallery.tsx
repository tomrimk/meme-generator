import styles from './Gallery.module.css';
import { useMemes } from '../../contexts/memes-context';
import { Link } from 'react-router-dom';

export default function Gallery() {
  const memes = useMemes();

  return (
    <div className={styles.container}>
      {memes.map((meme) => (
        <figure key={meme.id} className={styles.figure}>
          <img className={styles.image} src={meme.url} alt={meme.name} />

          <figcaption className={styles.caption}>{meme.name}</figcaption>

          <div className={styles.overlay} />
          <Link className={styles.actions} to={`/editor/${encodeURI(meme.name)}`}>
            <button className={styles.button}>Choose template</button>
          </Link>
        </figure>
      ))}
    </div>
  );
}

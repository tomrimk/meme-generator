import { Meme } from '../../types/Meme';
import styles from './Gallery.module.css';

type GalleryProps = {
  memes: Meme[];
};

export default function Gallery({ memes }: GalleryProps) {
  return (
    <div className={styles.container}>
      {memes.map((meme) => (
        <figure key={meme.id} className={styles.figure}>
          <img className={styles.image} src={meme.url} alt={meme.name} />
        </figure>
      ))}
    </div>
  );
}

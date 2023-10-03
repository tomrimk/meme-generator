import { Meme } from '../../../types/meme';
import styles from './HeroGallery.module.css';
import { IconPencil } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const galleryModel = [
  [1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1],
];

type HeroGalleryProps = {
  memes: Meme[];
};

export default function HeroGallery({ memes }: HeroGalleryProps) {
  let memeIndex = 0;

  return (
    <div className={styles.container}>
      {galleryModel.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          if (!col) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.galleryItem}
              ></div>
            );
          }

          memeIndex += 1;
          const meme = memes[memeIndex - 1];

          return (
            <Link to={`/editor/${encodeURI(meme.name)}`}>
              <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.galleryItem}
              >
                <img className={styles.image} src={meme.url} alt={meme.name} />

                <div className={styles.editAction}>
                  <IconPencil
                    className={styles.editIcon}
                    size={16}
                    color='#ffffff'
                  />
                </div>
              </div>
            </Link>
          );
        });
      })}
    </div>
  );
}

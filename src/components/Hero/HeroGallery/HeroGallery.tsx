import { useMemes } from '../../../contexts/memes-context';
import useWindowSize from '../../../hooks/use-window-size';
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

const mobileGalleryModel = [
  [1, 1, 1],
  [0, 1, 1],
  [0, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
];

export default function HeroGallery() {
  const memes = useMemes();
  const { deviceType, width } = useWindowSize();
  const galleryItems =
    deviceType === 'mobile' ? mobileGalleryModel : galleryModel;
  let memeIndex = 0;

  if (width < 825) {
    return null;
  }

  return (
    <div className={styles.container}>
      {galleryItems.map((row, rowIndex) => {
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
            <Link
              key={`${rowIndex}-${colIndex}`}
              to={`/editor/${encodeURI(meme.name)}`}
            >
              <div className={styles.galleryItem}>
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

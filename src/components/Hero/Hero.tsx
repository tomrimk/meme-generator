import { Meme } from '../../types/meme';
import Search from '../Search/Search';
import styles from './Hero.module.css';
import HeroGallery from './HeroGallery/HeroGallery';

type HeroProps = {
  memes: Meme[];
};

export default function Hero({ memes }: HeroProps) {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>
          TO<span className={styles.highlight}>MEME</span> <br /> or not to{' '}
          <span className={styles.highlight}>meme</span>
        </h1>
        <h2>That's the real question</h2>

        <p className={styles.description}>
          Browse the most popular meme templates and share the laughs with
          others
        </p>

        <Search />

        <p className={styles.searchInfo}>
          Search for a template or <a href='#templates'>browse templates</a>
        </p>
      </div>

      <div>
        <HeroGallery memes={memes} />
        <h2 className={styles.popularMemes}>Most popular memes of {new Date().getFullYear()} </h2>
      </div>
    </div>
  );
}

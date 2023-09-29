import styles from './Header.module.css';

type HeaderProps = {
  actions?: JSX.Element;
};

export default function Header({ actions }: HeaderProps) {
  return (
    <header className={styles.container}>
      <div className={styles.product}>
        <h1 className={styles.logo}>toMeme</h1>
        <p>Bring the best memes to your people</p>
      </div>

      {actions && actions}
    </header>
  );
}

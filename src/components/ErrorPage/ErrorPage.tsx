import { Link, useRouteError } from 'react-router-dom';
import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Something went wrong!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Link className={styles.link} to='/'>Back to homepage</Link>
      </div>
    </div>
  );
}

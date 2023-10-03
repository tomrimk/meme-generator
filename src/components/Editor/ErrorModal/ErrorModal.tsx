import { IconX } from '@tabler/icons-react';
import styles from './ErrorModal.module.css';

type ErrorModalProps = {
  error: {
    message: string;
  };
  onClose: () => void;
};

export default function ErrorModal({ error, onClose }: ErrorModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ops, something went wrong</h2>
          <IconX className={styles.closeIcon} stroke={1} color='#222222' onClick={onClose} />
        </div>

        <p className={styles.description}>{error.message}</p>

        <div className={styles.actions}>
          <button type='button' className={styles.button} onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

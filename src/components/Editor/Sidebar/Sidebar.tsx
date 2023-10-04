import { Dispatch, useState } from 'react';
import styles from './Sidebar.module.css';
import { EditorStoreAction } from '../store/editor-store';
import { createMeme } from '../../../services/meme-service';
import { Meme } from '../../../types/meme';
import { TextNode } from '../types/text-node';
import { EDITOR_ACTIONS } from '../constants/editor-actions';
import TextNodeInput from '../TextNode/TextNodeInput';
import ErrorModal from '../ErrorModal/ErrorModal';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import classNames from 'classnames';

type SidebarProps = {
  meme: Meme;
  textNodes: TextNode[];
  dispatch: Dispatch<EditorStoreAction>;
};

export default function Sidebar({ meme, textNodes, dispatch }: SidebarProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const openImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = meme.name;
    link.target = '_blank';
    link.rel = 'noreferrer,noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateMeme = async () => {
    setIsDownloading(true);
    try {
      const response = await createMeme({ meme, nodes: textNodes });

      if (!response.data) {
        setError({ message: response.error_message! });

        return;
      }

      openImage(response.data.url);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const addTextNode = () => {
    dispatch({
      type: EDITOR_ACTIONS.ADD_TEXT_NODE,
    });
  };

  return (
    <>
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      <aside
        className={classNames(styles.sidebar, {
          [styles.isClosed]: !isSidebarOpen,
        })}
      >
        <div className={styles.header}>
          <button type='button' className={styles.sidebarToggle}>
            {isSidebarOpen ? (
              <IconLayoutSidebarLeftCollapse
                stroke={1.5}
                color='#9293c9'
                onClick={() => setIsSidebarOpen(false)}
              />
            ) : (
              <IconLayoutSidebarLeftExpand
                stroke={1.5}
                color='#9293c9'
                onClick={() => setIsSidebarOpen(true)}
              />
            )}
          </button>

          {isSidebarOpen && (
            <button className={styles.newTextButton} onClick={addTextNode}>
              Add text
            </button>
          )}
        </div>

        {isSidebarOpen && (
          <>
            {textNodes.length === 0 ? (
              <div className={styles.nodesEmpty}>
                Add a text node to start editing
              </div>
            ) : (
              <div className={styles.nodes}>
                {textNodes.map((node) => (
                  <TextNodeInput
                    key={`input-${node.id}`}
                    dispatch={dispatch}
                    node={node}
                  />
                ))}
              </div>
            )}

            <div className={styles.footer}>
              <button
                className={styles.saveButton}
                onClick={generateMeme}
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download meme'}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

import { Meme } from '../../types/meme';
import { useCallback, useEffect, useReducer, useState, useRef } from 'react';
import styles from './Editor.module.css';
import TextNodeViewer from './TextNode/TextNodeViewer';
import { MovingSettings, ResizingSettings } from './types/text-node';
import { EDITOR_ACTIONS } from './constants/editor-actions';
import { editorStore } from './store/editor-store';
import Sidebar from './Sidebar/Sidebar';

type EditorProps = {
  meme: Meme;
};

export default function Editor({ meme }: EditorProps) {
  const [state, dispatch] = useReducer(editorStore, {
    textNodes: [],
  });
  const [resizingSettings, setResizingSettings] =
    useState<ResizingSettings | null>(null);
  const [movingSettings, setMovingSettings] = useState<MovingSettings | null>(
    null,
  );
  const imageRef = useRef<HTMLImageElement>(null);

  const handleTextNodeResize = useCallback(
    (event: MouseEvent) => {
      const element = event.target as HTMLDivElement;

      if (!resizingSettings || !element.id) {
        return;
      }

      const horizontalChange = resizingSettings!.startX - event.clientX;
      const verticalChange = resizingSettings!.startY - event.clientY;

      setResizingSettings({
        ...resizingSettings,
        ...(resizingSettings.handle === 'right' && { width: horizontalChange }),
        ...(resizingSettings.handle === 'bottom' && { height: verticalChange }),
      });
    },
    [resizingSettings],
  );

  const handleTextNodeMove = useCallback(
    (event: MouseEvent) => {
      const element = event.target as HTMLDivElement;

      if (!movingSettings || !element.id) {
        return;
      }

      let horizontalChange = movingSettings!.startX - event.clientX;
      let verticalChange = movingSettings!.startY - event.clientY;

      setMovingSettings({
        ...movingSettings,
        x: horizontalChange,
        y: verticalChange,
      });
    },
    [movingSettings],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      handleTextNodeResize(event);
      handleTextNodeMove(event);
    },
    [handleTextNodeMove, handleTextNodeResize],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (resizingSettings) {
        dispatch({
          type: EDITOR_ACTIONS.RESIZE_TEXT_NODE,
          payload: {
            id: resizingSettings.nodeId,
            width: resizingSettings.width!,
            height: resizingSettings.height!,
          },
        });

        setResizingSettings(null);
      }

      if (movingSettings) {
        const element = event.target as HTMLDivElement;

        dispatch({
          type: EDITOR_ACTIONS.MOVE_TEXT_NODE,
          payload: {
            id: movingSettings!.nodeId,
            x: element.offsetLeft,
            y: element.offsetTop,
          },
        });

        setMovingSettings(null);
      }
    },
    [movingSettings, resizingSettings],
  );

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const element = event.target as HTMLDivElement;

    if (element.id.includes('resize-handle')) {
      const [, , handle, nodeId] = element.id.split('-');

      setResizingSettings({
        nodeId: nodeId,
        startX: event.clientX,
        startY: event.clientY,
        handle,
      });

      return;
    }

    if (element.id.includes('node-container')) {
      setMovingSettings({
        nodeId: element.id.split('node-container-')[1],
        startX: event.clientX,
        startY: event.clientY,
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleMouseDown]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className={styles.container}>
      <Sidebar meme={meme} textNodes={state.textNodes} dispatch={dispatch} />

      <main className={styles.content}>
        <div className={styles.imageContainer} id='image-container'>
          <img
            id='image'
            ref={imageRef}
            className={styles.image}
            src={meme.url}
            alt={meme.name}
            draggable='false'
          />

          {state.textNodes.map((node) => {
            return (
              <TextNodeViewer
                key={node.id}
                node={node}
                movingSettings={
                  node.id === movingSettings?.nodeId ? movingSettings : null
                }
                resizingSettings={
                  node.id === resizingSettings?.nodeId ? resizingSettings : null
                }
                containerRef={imageRef}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Meme } from '../../types/Meme';
import { useCallback, useEffect, useReducer, useState, useRef } from 'react';
import styles from './Editor.module.css';
import TextNodeViewer from './TextNode/TextNodeViewer';
import { MovingSettings, ResizingSettings } from './types/text-node';
import { EDITOR_ACTIONS } from './constants/editor-actions';
import { editorStore } from './store/editor-store';

type EditorProps = {
  meme: Meme;
};

export default function Editor({ meme }: EditorProps) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(editorStore, {
    textNodes: [],
  });
  const [resizingSettings, setResizingSettings] =
    useState<ResizingSettings | null>(null);
  const [movingSettings, setMovingSettings] = useState<MovingSettings | null>(
    null,
  );
  const imageRef = useRef<HTMLImageElement>(null);

  const addTextNode = () => {
    dispatch({
      type: EDITOR_ACTIONS.ADD_TEXT_NODE,
      payload: {
        id: Date.now().toString(),
        value: '',
        x: 0,
        y: 0,
        width: 500,
        height: 100,
        color: '#000000',
        fontSize: 50,
      },
    });
  };

  const removeTextNode = (nodeId: string) => {
    dispatch({
      type: EDITOR_ACTIONS.REMOVE_TEXT_NODE,
      payload: {
        id: nodeId,
      },
    });
  };

  const handleTextNodeResize = useCallback(
    (event: MouseEvent) => {
      if (!resizingSettings) {
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
      if (!movingSettings) {
        return;
      }

      const textNode = event.target as HTMLElement;
      const parent = textNode.parentElement;

      let horizontalChange = movingSettings!.startX - event.clientX;
      let verticalChange = movingSettings!.startY - event.clientY;

      const isXOutOfBounds =
        textNode.offsetLeft + textNode.offsetWidth > parent?.clientWidth! ||
        textNode.offsetLeft < 0;
      const isYOutOfBounds =
        textNode.offsetTop + textNode.offsetHeight > parent?.clientHeight! ||
        textNode.offsetTop < 0;

      setMovingSettings({
        ...movingSettings,
        ...(!isXOutOfBounds && { x: horizontalChange }),
        ...(!isYOutOfBounds && { y: verticalChange }),
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

  const handleMouseUp = useCallback(() => {
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
      dispatch({
        type: EDITOR_ACTIONS.MOVE_TEXT_NODE,
        payload: {
          id: movingSettings!.nodeId,
          x: movingSettings!.x,
          y: movingSettings!.y,
        },
      });

      setMovingSettings(null);
    }
  }, [movingSettings, resizingSettings]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const elementId = (event.target as HTMLDivElement).id;

    if (elementId.includes('resize-handle')) {
      const [, , handle, nodeId] = elementId.split('-');

      setResizingSettings({
        nodeId: nodeId,
        startX: event.clientX,
        startY: event.clientY,
        handle,
      });

      return;
    }

    if (elementId.includes('node-container')) {
      setMovingSettings({
        nodeId: elementId.split('node-container-')[1],
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
      <div className={styles.sidebar}>
        <span onClick={() => navigate(-1)}>Back</span>
        <h2>Editor</h2>
        <p>Here you can edit your meme</p>

        <button onClick={addTextNode}>Add text</button>

        {state.textNodes.map((node, index) => (
          <div key={`input-${node.id}`} className={styles.inputContainer}>
            <span>Text #{index + 1}</span>
            <input
              className={styles.textNode}
              type='text'
              value={node.value}
              onChange={(e) => {
                dispatch({
                  type: EDITOR_ACTIONS.UPDATE_TEXT_NODE,
                  payload: { ...node, value: e.target.value },
                });
              }}
            />
            <input
              type='color'
              value={node.color}
              onChange={(e) => {
                dispatch({
                  type: EDITOR_ACTIONS.UPDATE_TEXT_NODE,
                  payload: { ...node, color: e.target.value },
                });
              }}
            />
            <input
              type='range'
              min='10'
              max='50'
              value={node.fontSize}
              onChange={(e) => {
                dispatch({
                  type: EDITOR_ACTIONS.UPDATE_TEXT_NODE,
                  payload: { ...node, fontSize: e.target.value },
                });
              }}
            />
            <button type='button' onClick={() => removeTextNode(node.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img
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
      </div>
    </div>
  );
}

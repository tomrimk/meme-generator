import { useNavigate } from 'react-router-dom';
import { Meme } from '../../types/Meme';
import { DragEvent, useReducer } from 'react';
import styles from './Editor.module.css';

type EditorProps = {
  meme: Meme;
};

type TextNode = {
  id: string;
  value: string;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  fontSize: number;
};

type State = {
  textNodes: TextNode[];
};

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case 'UPDATE_TEXT_NODE': {
      return {
        ...state,
        textNodes: state.textNodes.map((node) =>
          node.id === action.payload.id ? action.payload : node,
        ),
      };
    }
    case 'ADD_TEXT_NODE': {
      return {
        ...state,
        textNodes: [...state.textNodes, action.payload],
      };
    }
    case 'REMOVE_TEXT_NODE': {
      return {
        ...state,
        textNodes: state.textNodes.filter(
          (node) => node.id !== action.payload.id,
        ),
      };
    }
    default: {
      return state;
    }
  }
};

export default function Editor({ meme }: EditorProps) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    textNodes: [],
  });

  const addTextNode = () => {
    dispatch({
      type: 'ADD_TEXT_NODE',
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
      type: 'REMOVE_TEXT_NODE',
      payload: {
        id: nodeId,
      },
    });
  };

  const handleTextNodeDragStart = (
    event: DragEvent<HTMLDivElement>,
    node: TextNode,
  ) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(node));
  };

  const getYValue = (clientY: number, top: number) => {
    const y = clientY - top - 50;

    if (y < 0) {
      return 0;
    }

    if (y >= 400) {
      return 400;
    }

    return y;
  };

  const handleTextNodeDrop = (event: DragEvent<HTMLImageElement>) => {
    event.preventDefault();
    const node = JSON.parse(event.dataTransfer.getData('text/plain'));
    const rect = event.currentTarget.getBoundingClientRect();

    dispatch({
      type: 'UPDATE_TEXT_NODE',
      payload: {
        ...node,
        y: getYValue(event.clientY, rect.top),
      },
    });
  };

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
                  type: 'UPDATE_TEXT_NODE',
                  payload: { ...node, value: e.target.value },
                });
              }}
            />
            <input
              type='color'
              value={node.color}
              onChange={(e) => {
                dispatch({
                  type: 'UPDATE_TEXT_NODE',
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
                  type: 'UPDATE_TEXT_NODE',
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
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={handleTextNodeDrop}
            className={styles.image}
            src={meme.url}
            alt={meme.name}
          />

          {state.textNodes.map((node) => (
            <div
              key={node.id}
              className={styles.node}
              draggable
              onDragStart={(event) => handleTextNodeDragStart(event, node)}
              style={{
                top: node.y,
                left: node.x,
                color: node.color,
                width: `${node.width}px`,
                height: `${node.height}px`,
                fontSize: `${node.fontSize}px`,
              }}
            >
              {node.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Dispatch } from 'react';
import { EDITOR_ACTIONS } from '../constants/editor-actions';
import { TextNode } from '../types/text-node';
import styles from './TextNode.module.css';
import { EditorStoreAction } from '../store/editor-store';
import { IconTrash } from '@tabler/icons-react';

type TextNodeInputProps = {
  node: TextNode;
  index: number;
  dispatch: Dispatch<EditorStoreAction>;
};

export default function TextNodeInput({
  node,
  index,
  dispatch,
}: TextNodeInputProps) {
  const removeTextNode = (nodeId: string) => {
    dispatch({
      type: EDITOR_ACTIONS.REMOVE_TEXT_NODE,
      payload: {
        id: nodeId,
      },
    });
  };

  return (
    <div className={styles.textNodeInputContainer}>
      <div className={styles.textNodeInputHeader}>
        <span>Text #{index + 1}</span>

        <button
          className={styles.buttonIcon}
          type='button'
          onClick={() => removeTextNode(node.id)}
        >
          <IconTrash stroke={1.2} color='red' size={18} />
        </button>
      </div>

      <input
        className={styles.textNodeInput}
        type='text'
        value={node.value}
        placeholder='Type something...'
        onChange={(e) => {
          dispatch({
            type: EDITOR_ACTIONS.UPDATE_TEXT_NODE,
            payload: { ...node, value: e.target.value },
          });
        }}
      />

      <div className={styles.textNodeInputControls}>
        <div className={styles.labelledControl}>
          <label htmlFor='color'>Color</label>
          <input
            className={styles.colorInput}
            type='color'
            id='color'
            value={node.color}
            onChange={(e) => {
              dispatch({
                type: EDITOR_ACTIONS.UPDATE_TEXT_NODE,
                payload: { ...node, color: e.target.value },
              });
            }}
          />
        </div>

        <div className={styles.labelledControl}>
          <label htmlFor='fontSize'>Font size</label>
          <select
            name='fontSize'
            id='fontSize'
            value={`${node.fontSize}`}
            className={styles.fontSizeInput}
            onChange={(e) => {
              dispatch({
                type: EDITOR_ACTIONS.UPDATE_TEXT_NODE,
                payload: { ...node, fontSize: e.target.value },
              });
            }}
          >
            <option value='10'>10</option>
            <option value='14'>14</option>
            <option value='18'>18</option>
            <option value='22'>22</option>
            <option value='26'>26</option>
            <option value='30'>30</option>
            <option value='34'>34</option>
            <option value='38'>38</option>
            <option value='42'>42</option>
            <option value='46'>46</option>
            <option value='50'>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}

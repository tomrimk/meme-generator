import { EDITOR_ACTIONS } from './../constants/editor-actions';
import { TextNode } from '../types/text-node';
import { getNumberMinMax } from '../../../utils/get-number-min-max';
import {
  FONT_SCALE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from '../constants/text-node-constraints';

type State = {
  textNodes: TextNode[];
};

export type EditorStoreAction = {
  type: EDITOR_ACTIONS;
  payload?: any;
};

const generateTitle = (textNodes: TextNode[]) => {
  let count = textNodes.length + 1;
  let title = `Text #${textNodes.length + 1}`;
  const existingTitles = textNodes.map((node) => node.title);

  do {
    title = `Text #${count++}`;
  } while (existingTitles.indexOf(title) !== -1);

  return title;
};

export const editorStore = (state: State, action: EditorStoreAction) => {
  switch (action.type) {
    case EDITOR_ACTIONS.UPDATE_TEXT_NODE: {
      return {
        ...state,
        textNodes: state.textNodes.map((node) =>
          node.id === action.payload.id ? action.payload : node,
        ),
      };
    }
    case EDITOR_ACTIONS.ADD_TEXT_NODE: {
      return {
        ...state,
        textNodes: [
          ...state.textNodes,
          {
            id: Date.now().toString(),
            title: generateTitle(state.textNodes),
            value: '',
            x: 0,
            y: 0,
            width: 500,
            height: 100,
            color: '#000000',
            fontSize: 50,
          },
        ],
      };
    }
    case EDITOR_ACTIONS.REMOVE_TEXT_NODE: {
      return {
        ...state,
        textNodes: state.textNodes.filter(
          (node) => node.id !== action.payload.id,
        ),
      };
    }
    case EDITOR_ACTIONS.MOVE_TEXT_NODE: {
      return {
        ...state,
        textNodes: state.textNodes.map((node) =>
          node.id === action.payload.id
            ? {
                ...node,
                x: action.payload.x!,
                y: action.payload.y!,
              }
            : node,
        ),
      };
    }
    case EDITOR_ACTIONS.RESIZE_TEXT_NODE: {
      return {
        ...state,
        textNodes: state.textNodes.map((node) => {
          let width = action.payload.width
            ? node.width - action.payload.width
            : node.width;
          let height = action.payload.height
            ? node.height - action.payload.height
            : node.height;

          return node.id === action.payload.id
            ? {
                ...node,
                width,
                height,
                fontSize: getNumberMinMax({
                  value: width * FONT_SCALE,
                  min: MIN_FONT_SIZE,
                  max: MAX_FONT_SIZE,
                }),
              }
            : node;
        }),
      };
    }
    default: {
      return state;
    }
  }
};

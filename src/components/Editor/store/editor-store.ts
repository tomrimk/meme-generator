import { EDITOR_ACTIONS } from './../constants/editor-actions';
import { TextNode } from '../types/text-node';

type State = {
  textNodes: TextNode[];
};

export const editorStore = (
  state: State,
  action: any,
) => {
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
        textNodes: [...state.textNodes, action.payload],
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
      const textNode = state.textNodes.find(
        (node) => node.id === action.payload.id,
      );

      if (!textNode) {
        return state;
      }

      return {
        ...state,
        textNodes: state.textNodes.map((node) =>
          node.id === action.payload.id
            ? {
                ...node,
                x: node.x - action.payload.x!,
                y: node.y - action.payload.y!,
              }
            : node,
        ),
      };
    }
    case EDITOR_ACTIONS.RESIZE_TEXT_NODE: {
      const textNode = state.textNodes.find(
        (node) => node.id === action.payload.id,
      );

      if (!textNode) {
        return state;
      }

      let width = action.payload.width
        ? textNode.width - action.payload.width
        : textNode.width;
      let height = action.payload.height
        ? textNode.height - action.payload.height
        : textNode.height;

      return {
        ...state,
        textNodes: state.textNodes.map((node) =>
          node.id === action.payload.id ? { ...node, width, height } : node,
        ),
      };
    }
    default: {
      return state;
    }
  }
};

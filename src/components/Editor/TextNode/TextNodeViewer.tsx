import { RefObject, useRef, useMemo } from 'react';
import styles from './TextNode.module.css';
import {
  FONT_SCALE,
  MAX_FONT_SIZE,
  MAX_TEXT_NODE_WIDTH,
  MIN_FONT_SIZE,
  MIN_TEXT_NODE_HEIGHT,
  MIN_TEXT_NODE_WIDTH,
} from '../constants/text-node-constraints';
import { getNumberMinMax } from '../../../utils/get-number-min-max';
import { MovingSettings, ResizingSettings, TextNode } from '../types/text-node';
import classNames from 'classnames';

type TextNodeViewerProps = {
  node: TextNode;
  movingSettings: MovingSettings | null;
  resizingSettings: ResizingSettings | null;
  containerRef: RefObject<HTMLImageElement>;
};

export default function TextNodeViewer({
  node,
  movingSettings,
  resizingSettings,
  containerRef,
}: TextNodeViewerProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const nodePosition = useMemo(() => {
    let leftChange = movingSettings ? node.x - (movingSettings.x || 0) : node.x;
    let topChange = movingSettings ? node.y - (movingSettings.y || 0) : node.y;

    const left = getNumberMinMax({
      value: leftChange,
      min: 0,
      max:
        containerRef.current?.clientWidth! -
        (nodeRef.current?.offsetWidth || 0),
    });
    const top = getNumberMinMax({
      value: topChange,
      min: 0,
      max:
        containerRef.current?.clientHeight! -
        (nodeRef.current?.offsetHeight || 0),
    });

    return {
      left: `${left}px`,
      top: `${top}px`,
    };
  }, [containerRef, movingSettings, node.x, node.y]);

  const nodeDimensions = useMemo(() => {
    const widthChange = resizingSettings
      ? node.width - (resizingSettings.width || 0)
      : node.width;
    const heightChange = resizingSettings
      ? node.height - (resizingSettings.height || 0)
      : node.height;

    const width = getNumberMinMax({
      value: widthChange,
      min: MIN_TEXT_NODE_WIDTH,
      max: MAX_TEXT_NODE_WIDTH - (nodeRef.current?.offsetLeft || 0),
    });
    const height = getNumberMinMax({
      value: heightChange,
      min: MIN_TEXT_NODE_HEIGHT,
      max:
        containerRef.current?.clientHeight! - (nodeRef.current?.offsetTop || 0),
    });

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  }, [containerRef, node.width, node.height, resizingSettings]);

  const calculateFontSize = () => {
    const fontSize = resizingSettings
      ? (node.width - (resizingSettings?.width || 0)) * FONT_SCALE
      : node.fontSize;

    return `${getNumberMinMax({
      value: fontSize,
      min: MIN_FONT_SIZE,
      max: MAX_FONT_SIZE,
    })}px`;
  };

  return (
    <div
      ref={nodeRef}
      id={`node-container-${node.id}`}
      className={styles.textNodeViewer}
      style={{
        color: node.color,
        fontSize: calculateFontSize(),
        ...nodePosition,
        ...nodeDimensions,
      }}
    >
      <span className={styles.textNodeViewerValue}>{node.value}</span>

      <div
        id={`resize-handle-right-${node.id}`}
        className={classNames(styles.resizeHandle, styles.resizeHandleRight)}
      ></div>
      <div
        id={`resize-handle-bottom-${node.id}`}
        className={classNames(styles.resizeHandle, styles.resizeHandleBottom)}
      ></div>
    </div>
  );
}

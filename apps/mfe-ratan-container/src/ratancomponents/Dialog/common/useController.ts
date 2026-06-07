import { useEffect, useState } from "react";

const useController = (props) => {
  const {
    minWidth = 100,
    minHeight = 100,
    width = 100,
    height = 100,
    onReady,
    onClose,
    enableOtherClose = false,
  } = props;
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isMove, setIsMove] = useState(false);
  const [startWidth, setStartWidth] = useState(width);
  const [startHeight, setStartHeight] = useState(height);
  const [nowWidth, setNowWidth] = useState(width);
  const [nowHeight, setNowHeight] = useState(height);
  const [style, setStyle] = useState({});

  useEffect(() => {
    const initStyle: { width?: number; height?: number } = {};
    if (width > 100) {
      initStyle.width = nowWidth;
    }
    if (height > 100) {
      initStyle.height = nowHeight;
    }
    setStyle(initStyle);
  }, [nowWidth, nowHeight]);

  const startMove = (e: any) => {
    setStartX(e.pageX);
    setStartY(e.pageY);
    setStartWidth(nowWidth);
    setStartHeight(nowHeight);
    setIsMove(true);
  };

  const endMove = () => {
    if (isMove) {
      setIsMove(false);
      if (onReady) {
        onReady({ nowWidth, nowHeight });
      }
    }
  };
  const close = () => {
    if (enableOtherClose && !isMove) {
      onClose();
    }
  };

  const moving = (e: any) => {
    if (isMove) {
      const moveX = e.pageX;
      const moveY = e.pageY;
      const newWidth = startWidth + (moveX - startX) * 2;
      const newHeight = startHeight + (moveY - startY) * 2;
      if (newWidth > minWidth) {
        setNowWidth(newWidth);
      }
      if (newHeight > minHeight) {
        setNowHeight(newHeight);
      }
    }
  };

  return {
    style,
    startMove,
    moving,
    endMove,
    close,
  };
};
export default useController;

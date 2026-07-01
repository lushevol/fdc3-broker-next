import { useEffect, useRef } from "react";

const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  scrollContainerRef: React.RefObject<HTMLDivElement>
) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [callback, hasMore, scrollContainerRef]);

  return bottomRef;
};

export default useInfiniteScroll;

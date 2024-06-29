import { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "@/app/utils/useIntersectionObserver";
import classes from "../utils/classes";

export default function LoadMoreWhenVisible({
  loadMore,
}: {
  loadMore: () => Promise<void>;
}) {
  const loadMoreRef = useRef(null);
  const loadMoreVisible = useIntersectionObserver(loadMoreRef);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMoreWrapper() {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  }

  useEffect(() => {
    if (loadMoreVisible) loadMoreWrapper();
  }, [loadMoreVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="px-3 pb-3">
      Bezig met laden van meer...
      <div ref={loadMoreRef} className={classes(loadingMore && "hidden")}></div>
    </div>
  );
}

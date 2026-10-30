import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useIntersectionObserver from "@/app/utils/useIntersectionObserver";
import classes from "@/app/utils/classes";

export default function LoadMoreWhenVisible({
  loadMore,
}: {
  loadMore: () => Promise<void>;
}) {
  const loadMoreRef = useRef(null);
  const loadMoreVisible = useIntersectionObserver(loadMoreRef);
  const [loadingMore, setLoadingMore] = useState(false);
  const t = useTranslations();

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
      {t("loading-more")}
      <div ref={loadMoreRef} className={classes(loadingMore && "hidden")}></div>
    </div>
  );
}

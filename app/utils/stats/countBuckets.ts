export type BucketCount<BucketId extends string> = {
  id: BucketId;
  value: number;
};

export default function countBuckets<Item, BucketId extends string>(
  items: Item[],
  orderedBucketIds: readonly BucketId[],
  getBucketId: (item: Item) => BucketId,
): BucketCount<BucketId>[] {
  const counts = new Map<BucketId, number>(
    orderedBucketIds.map((bucket) => [bucket, 0]),
  );

  for (const item of items) {
    const bucket = getBucketId(item);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }

  return orderedBucketIds.map((id) => ({
    id,
    value: counts.get(id) ?? 0,
  }));
}

export function countDynamicBuckets<Item, BucketId extends string>(
  items: Item[],
  getBucketId: (item: Item) => BucketId,
): BucketCount<BucketId>[] {
  const counts = new Map<BucketId, number>();

  for (const item of items) {
    const bucket = getBucketId(item);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, value]) => ({ id, value }));
}

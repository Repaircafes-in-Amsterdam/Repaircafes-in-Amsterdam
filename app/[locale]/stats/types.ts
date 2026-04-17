export type LabeledBucket = {
  id: string;
  label: string;
  value: number;
};

export type Stats = {
  numRepairCafes: number;
  periodMonths: number;
  periodDays: number;
  numEvents: number;
  numDaysWithEvents: number;
  frequencyBuckets: LabeledBucket[];
  dayBuckets: LabeledBucket[];
  dayTypeBuckets: LabeledBucket[];
  officeHoursBuckets: LabeledBucket[];
  districtBuckets: LabeledBucket[];
};

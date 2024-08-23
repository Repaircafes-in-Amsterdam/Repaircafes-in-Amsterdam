export type MultilingualData = {
  [key: string]: string;
};

export type Links = {
  [key: string]: string;
};

export type RC = {
  name: string;
  slug: string;
  open: MultilingualData;
  rrule: string[];
  startTime: string[];
  endTime: string[];
  closed: MultilingualData;
  closedRanges: string[];
  exceptions: string[];
  address: string;
  district: string;
  doRepair: MultilingualData;
  dontRepair: MultilingualData;
  moreInfo: MultilingualData;
  coordinate: number[];
  email: string;
  links?: Links;
  socials?: Links;
  verified: boolean;
};

export type EventRC = {
  name: string;
  slug: string;
  district: string;
  verified: boolean;
};

export type Event = {
  date: Date;
  dateString: string;
  startTime: string;
  endTime: string;
  rc: EventRC;
  closedCause?: string;
  exceptionCause?: string;
};

export type EventGroup = {
  dateString: string;
  events: Event[];
};

export type MapRC = {
  slug: string;
  coordinate: number[];
  name: string;
  open: MultilingualData;
  address: string;
  verified: boolean;
  district: string;
  someOutOfOfficeHours: boolean;
};

export type Holiday = {
  name?: string;
  startDate: string;
  endDate: string;
  startTime: number;
  endTime: number;
};

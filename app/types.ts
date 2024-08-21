export type Links = {
  [key: string]: string;
};

// TODO add fields for translations
export type RC = {
  name: string;
  slug: string;
  open: string;
  rrule: string[];
  startTime: string[];
  endTime: string[];
  closed: string;
  closedRanges: string[];
  exceptions: string[];
  address: string;
  district: string;
  doRepair: string;
  dontRepair: string;
  moreInfo: string;
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
  open: string;
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

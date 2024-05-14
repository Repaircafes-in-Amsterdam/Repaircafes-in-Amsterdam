export type RC = {
  name: string;
  slug: string;
  open: string;
  rrule: string;
  startTime: string;
  endTime: string;
  closed: string;
  address: string;
  district: string;
  doRepair: string;
  dontRepair: string;
  moreInfo: string;
  coordinate: number[];
  email: string;
  links?: {
    orgPage?: string;
    [key: string]: string | undefined;
  };
  verified: boolean;
};

export type EventRC = {
  name: string;
  slug: string;
  startTime: string;
  endTime: string;
  district: string;
  verified: boolean;
};

export type Event = {
  date: Date;
  dateString: string;
  rc: EventRC;
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
};

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
  links?: {
    orgPage?: string;
    [key: string]: string | undefined;
  };
  verified: boolean;
};

export type Event = {
  date: Date;
  dateString: string;
  rc: RC;
};

export type EventGroup = {
  dateString: string;
  events: Event[];
};

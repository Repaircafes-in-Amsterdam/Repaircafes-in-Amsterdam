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
  verified: boolean;
  links: {
    orgPage?: string;
    [key: string]: string | undefined;
  };
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

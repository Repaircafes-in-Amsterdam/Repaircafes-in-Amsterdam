export type RC = {
  name: string;
  open: string;
  rrule: string;
  startTime: string;
  endTime: string;
  address: string;
  district: string;
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

export type Mail = {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
};

export const emails: Mail[] = [
  {
    id: "donut-case",
    from: "Chief Brannigan",
    subject: "RE: RE: RE: the missing donuts",
    date: "8/21/98 07:12",
    body: "Detective,\n\nTwelve donuts went into the break room. Two came out. I want a full query on this.\n\nDo NOT tell Internal Affairs.\n\n- Chief",
  },
  {
    id: "it-warning",
    from: "IT Department",
    subject: "Please stop deleting the database",
    date: "8/20/98 16:44",
    body: "This is the fourth time this month. DROP TABLE is not a search command.\n\nWe have restored the backup from a floppy disk. Please be gentle.",
  },
  {
    id: "anon-threat",
    from: "Anonymous",
    subject: "i know what you SELECTed last summer",
    date: "8/20/98 03:03",
    body: "you missed a WHERE clause.\n\nwe all saw it.",
  },
  {
    id: "hr-training",
    from: "Precinct HR",
    subject: "Mandatory Screensaver Training",
    date: "8/19/98 11:00",
    body: "Attendance is required. Flying toasters will be covered in Module 3.\n\nCoffee will be provided in a beige cup.",
  },
  {
    id: "spam",
    from: "MailBot 3000",
    subject: "You have won a FREE Pentium!!!",
    date: "8/18/98 22:15",
    body: "CONGRATULATIONS!!! Simply reply with your badge number, mother's maiden name, and the entire evidence table.\n\nThis is definitely not a trap.",
  },
];

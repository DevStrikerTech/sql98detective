import type { IconName } from "@/components/win98/Win98Icon";
import type { AccessLog, SqlTableConfig } from "@/lib/game/sqlEngine";

export type { AccessLog };

export const CASE_ID = "001";
export const CASE_TITLE = "THE MISSING SPREADSHEET";

export type Suspect = {
  id: string;
  name: string;
  role: string;
  statement: string;
  /** Where they sit — the precinct is a real place with real bad carpet. */
  desk: string;
  alibi: string;
  /** Small human detail the detective would notice. */
  tell: string;
  /** If this clue is discovered, the statement above stops holding up. */
  contradictedBy?: ClueId;
};

export const suspects: Suspect[] = [
  {
    id: "linda",
    name: "Linda",
    role: "Accounting",
    statement: '"I opened payroll.xls to review it. That is all. I alphabetise my staplers."',
    desk: "Desk 4 — by the fern nobody waters",
    alibi: "Signed out of the file at 09:15. Was queueing for the good printer by 09:17.",
    tell: "Keeps a laminated copy of the coffee rota. Laminated.",
  },
  {
    id: "kevin",
    name: "Kevin",
    role: "Junior IT",
    statement: '"I never touched payroll.xls. Not once. Why would I. I wouldn\'t."',
    desk: "Desk 9 — under the server fan, permanently cold",
    alibi: "Claims he was 'reimaging a machine'. Cannot say which machine.",
    tell: "Said 'never' three times in one sentence. Nobody needs three.",
    contradictedBy: "kevin-timing",
  },
  {
    id: "gary",
    name: "Gary",
    role: "Office troublemaker",
    statement: '"I don\'t even know what a spreadsheet is. Is it a kind of jam?"',
    desk: "Desk 12 — visible from the vending machine, deliberately",
    alibi: "Downloading a 8MB MP3 at 09:20. On this connection, that is an ironclad alibi.",
    tell: "Guilty of everything except, annoyingly, this.",
  },
];

export type ClueId = "payroll-missing" | "access-logs" | "kevin-timing";

export type Clue = {
  id: ClueId;
  label: string;
  detail: string;
};

export const clues: Clue[] = [
  {
    id: "payroll-missing",
    label: "payroll.xls disappeared at approximately 09:21",
    detail: "The file is gone from C:\\OFFICE\\DOCUMENTS. Last modified 09:21 AM.",
  },
  {
    id: "access-logs",
    label: "Access logs contain activity for payroll.xls",
    detail: "file_access.log records six operations from this morning.",
  },
  {
    id: "kevin-timing",
    label: "Kevin accessed payroll.xls at the relevant time",
    detail: "Log entry #4 places kevin on payroll.xls at 09:21.",
  },
];

export const accessLogs: AccessLog[] = [
  { id: 1, user: "linda", file: "payroll.xls", action: "OPEN", time: "09:11" },
  { id: 2, user: "linda", file: "payroll.xls", action: "CLOSE", time: "09:15" },
  { id: 3, user: "gary", file: "gary_mix_2001.mp3", action: "DOWNLOAD", time: "09:20" },
  { id: 4, user: "kevin", file: "payroll.xls", action: "OPEN", time: "09:21" },
  { id: 5, user: "kevin", file: "payroll.xls", action: "DELETE", time: "09:21" },
  { id: 6, user: "kevin", file: "system.log", action: "OPEN", time: "09:23" },
];

export type FsAction = "inspect-payroll" | "open-logs" | "gary-download" | "none";

export type FsNode = {
  name: string;
  icon: IconName;
  kind: "folder" | "file" | "drive";
  detail: string;
  missing?: boolean;
  action?: FsAction;
  children?: FsNode[];
};

export const fileSystem: FsNode[] = [
  {
    name: "3½ Floppy (A:)",
    icon: "floppy",
    kind: "drive",
    detail: "3½ Inch Floppy Disk — no disk inserted",
  },
  {
    name: "Office Drive (C:)",
    icon: "hdd",
    kind: "drive",
    detail: "Local Disk — 1.2 GB free",
    children: [
      {
        name: "OFFICE",
        icon: "folder",
        kind: "folder",
        detail: "File Folder — 3 items",
        children: [
          {
            name: "DOCUMENTS",
            icon: "folder",
            kind: "folder",
            detail: "File Folder — 3 items",
            children: [
              {
                name: "payroll.xls",
                icon: "document",
                kind: "file",
                detail: "FILE NOT FOUND — last modified 09:21 AM",
                missing: true,
                action: "inspect-payroll",
              },
              {
                name: "coffee_rota.doc",
                icon: "document",
                kind: "file",
                detail: "Document — 6 KB. Gary is on coffee duty. Forever.",
              },
              {
                name: "meeting_notes_FINAL2.doc",
                icon: "document",
                kind: "file",
                detail: "Document — 12 KB. Mostly doodles of a stapler.",
              },
            ],
          },
          {
            name: "LOGS",
            icon: "folder",
            kind: "folder",
            detail: "File Folder — 2 items",
            children: [
              {
                name: "file_access.log",
                icon: "document",
                kind: "file",
                detail: "System Log — 6 records, 2 KB",
                action: "open-logs",
              },
              {
                name: "system.log",
                icon: "document",
                kind: "file",
                detail: "System Log — mostly printer complaints.",
              },
            ],
          },
          {
            name: "DOWNLOADS",
            icon: "folder",
            kind: "folder",
            detail: "File Folder — 4 items",
            children: [
              {
                name: "free_mp3_downloader_final_FINAL.exe",
                icon: "document",
                kind: "file",
                detail: "Application — 640 KB. Bundled with 11 friends.",
                action: "gary-download",
              },
              {
                name: "totally_legal_music.zip",
                icon: "document",
                kind: "file",
                detail: "Archive — 8,102 KB. The name is doing a lot of work.",
                action: "gary-download",
              },
              {
                name: "gary_mix_2001.mp3",
                icon: "document",
                kind: "file",
                detail: "Audio — downloaded 09:20 by gary.",
                action: "gary-download",
              },
              {
                name: "napster_password.txt",
                icon: "document",
                kind: "file",
                detail: "Text — 1 KB. It's 'gary'.",
                action: "gary-download",
              },
            ],
          },
        ],
      },
      {
        name: "WINDOWS",
        icon: "folder",
        kind: "folder",
        detail: "File Folder — system files",
        children: [
          {
            name: "solitaire.exe",
            icon: "document",
            kind: "file",
            detail: "Application — 118 KB. Not evidence. Probably.",
          },
        ],
      },
    ],
  },
  {
    name: "EVIDENCE (D:)",
    icon: "cdrom",
    kind: "drive",
    detail: "Compact Disc (read only)",
  },
  {
    name: "Control Panel",
    icon: "settings",
    kind: "folder",
    detail: "System configuration",
  },
];

export const caseEmail = {
  id: "case-001",
  from: "Chief Brannigan",
  subject: "URGENT!!! payroll.xls IS GONE",
  date: "8/24/98 09:34",
  body: 'DETECTIVE.\n\nAt 09:21 this morning payroll.xls stopped existing.\n\nAccounting is panicking. Finance is blaming IT. IT is blaming Gary.\nGary says he "doesn\'t even know what a spreadsheet is."\nSomebody on this floor is lying to me before ten in the morning.\n\nThree people touched that machine. Three people have a story.\nStories are free. The machine keeps receipts.\n\nFind me the name. Do not guess. I have been burned by a guess.\n\n— Chief Brannigan\n  (typing this standing up, which should tell you something)',
};

export const solutionQuery =
  "SELECT username\nFROM file_access_logs\nWHERE filename = 'payroll.xls'\n  AND action = 'DELETE';";

export const sqlTable: SqlTableConfig = {
  tableName: "file_access_logs",
  rows: accessLogs,
  correctRowId: 5,
  hints: [
    "Try filtering by filename. The one that vanished.",
    "The action you're looking for is DELETE.",
    "Try something like:\nWHERE filename = 'payroll.xls'\n  AND action = 'DELETE'",
  ],
  quips: {
    empty: "No matching records. Somebody is either innocent or very careful.",
    correct: "One record. One name. Kevin appears to have SELECTed the wrong alibi.",
    all: "Six suspects. Bold strategy.",
    multiple: "Unless everyone deleted payroll.xls, we may need to narrow that down.",
  },
};

/** Marginalia the log viewer prints next to each record. Flavour, not logic. */
export const logNotes: Record<number, string> = {
  1: "Routine. Linda opens payroll.xls most mornings before the tea trolley.",
  2: "Closed cleanly four minutes later. File still existed at 09:15.",
  3: "8,102 KB over the precinct connection. Gary was busy being Gary.",
  4: "Opened. Two minutes after Linda left. Kevin says this never happened.",
  5: "DELETE. Same minute, same user. The record does not editorialise.",
  6: "system.log opened at 09:23. Somebody went looking at what the machine saw.",
};

/** Idle precinct noise for the status bars — the building keeps talking. */
export const precinctChatter: string[] = [
  "Break room printer jammed again. Third time today.",
  "Somebody has re-labelled the coffee as 'EVIDENCE'.",
  "Reminder: DROP TABLE is not a search command.",
  "The fern by Desk 4 has been declared a fire hazard.",
  "Chief Brannigan is pacing. Audibly.",
  "Screensaver Training Module 3: Flying Toasters. 14:00.",
  "Desk 9 has requested a second desk fan. Denied.",
  "Accounting has begun writing payroll out by hand. Badly.",
  "Someone in IT is whistling. It is not going well.",
  "Lost property: one mouse ball. Enquire at the front desk.",
  "Kevin has asked twice whether logs 'expire'. They do not.",
  "The good printer is not the good printer any more.",
];

/** Closing beats printed after the CASE CLOSED stamp. Epilogue, not logic. */
export const caseEpilogue: string[] = [
  "KEVIN — escorted to the break room. Confessed between two custard creams.",
  "LINDA — vindicated. Has requested this in writing. Twice.",
  "GARY — still guilty of something. Not this.",
  "payroll.xls — recovered from a floppy labelled 'DO NOT'.",
];

/** The SQL console's accusation, delivered one beat at a time. */
export const revealScript: string[] = [
  "1 row returned. That is a small number for a big morning.",
  'KEVIN, on record: "I never touched payroll.xls. Not once."',
  "THE LOG, on record: 09:21 — DELETE — kevin — payroll.xls.",
  "Two statements. One machine. Machines do not get nervous.",
  ">>> ONE NAME MATCHES. ONE NAME LIED. <<<",
];

/** Follow-up mail that lands as the case progresses. Purely narrative. */
export type FollowUpStage = "accepted" | "sql" | "solved";

export const caseFollowUps: {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  showAfter: FollowUpStage;
}[] = [
  {
    id: "linda-statement",
    from: "Linda (Accounting)",
    subject: "I want it on record",
    date: "8/24/98 09:41",
    body: "Detective,\n\nI opened payroll.xls at 09:11 and closed it at 09:15. You may verify this. I would like it noted that I closed it. Properly. With the menu, not the little X.\n\nI have attached nothing because I do not trust attachments.\n\n— Linda",
    showAfter: "accepted",
  },
  {
    id: "gary-defence",
    from: "Gary",
    subject: "wasnt me",
    date: "8/24/98 09:44",
    body: "hi\n\nheard theres a spreadsheet thing. i was downloading a song at the time. it took ages. you can check.\n\nalso the song is a banger if you want it\n\ngary",
    showAfter: "accepted",
  },
  {
    id: "chief-nudge",
    from: "Chief Brannigan",
    subject: "well?",
    date: "8/24/98 09:49",
    body: "Detective.\n\nI am not rushing you. I am simply standing near your desk, breathing.\n\nThe machine writes everything down. Look at what it wrote.\n\n— Chief",
    showAfter: "accepted",
  },
  {
    id: "it-audit",
    from: "IT Department",
    subject: "RE: audit trail request",
    date: "8/24/98 09:52",
    body: "Query access has been enabled on your terminal.\n\nPlease note: file_access_logs is READ ONLY. We have learned this lesson together, as a precinct.\n\nColumns are: id, username, filename, action, timestamp.",
    showAfter: "sql",
  },
  {
    id: "kevin-panic",
    from: "Kevin (Junior IT)",
    subject: "quick question totally unrelated",
    date: "8/24/98 09:58",
    body: "hey so hypothetically\n\nif a log file said someone did something, could the log be wrong? like a clock issue? or a haunting?\n\nasking for the machine\n\n- Kevin",
    showAfter: "sql",
  },
  {
    id: "chief-congrats",
    from: "Chief Brannigan",
    subject: "RE: RE: URGENT!!! payroll.xls IS GONE",
    date: "8/24/98 10:14",
    body: "GOOD WORK DETECTIVE.\n\nKevin has been escorted to the break room for a conversation about honesty and backups.\n\nAccounting has stopped screaming. Finance has started, but for unrelated reasons.\n\nTake the rest of the morning. Not the afternoon.\n\n— Chief",
    showAfter: "solved",
  },
  {
    id: "linda-vindicated",
    from: "Linda (Accounting)",
    subject: "RE: I want it on record",
    date: "8/24/98 10:21",
    body: "Detective,\n\nI have been told the matter is resolved. I would like a copy of the log entry showing 09:15, CLOSE, linda.\n\nLaminated, if the machine allows.\n\n— Linda",
    showAfter: "solved",
  },
];

/** Where each record sits on the morning's timeline, 09:10 → 09:25. */
export const TIMELINE_START = 9 * 60 + 10;
export const TIMELINE_END = 9 * 60 + 25;

/** Cross-references the detective would scribble in the margin once two records line up. */
export const logCrossRefs: Record<number, string> = {
  2: "CROSS-REF #1: opened 09:11, closed 09:15. Four tidy minutes. The file survived her.",
  3: "CROSS-REF: 8,102 KB on this connection takes the better part of a morning. Gary was occupied.",
  4: "CROSS-REF #2: exactly two minutes after Linda signed off. Somebody waited for the desk to clear.",
  5: "CROSS-REF #4: OPEN and DELETE in the same minute. Nobody reads a spreadsheet that fast.",
  6: "CROSS-REF #5: system.log opened two minutes later. Someone checking whether the machine noticed.",
};

/** Idle mutterings from QUERY.hlp while the detective works. */
export const assistantBarks: string[] = [
  "The machine does not have a favourite suspect. That is your job.",
  "Every file on this drive has an alibi. Only one of them is nervous.",
  "Tip: two records next to each other are worth more than either alone.",
  "Somewhere in this building a fax machine is dialling nobody.",
  "The Chief has walked past your desk again. Slowly.",
];

/** Status-bar mutterings for the precinct mail system. Flavour, not logic. */
export const mailRoomChatter: string[] = [
  "Mail server: awake. Barely.",
  "Delivery queue: 1 pending, 1 sulking.",
  "Reminder: the Chief reads receipts.",
  "Attachment scanning is performed by Kevin, manually.",
  "Outgoing post collected at 11:00, or thereabouts.",
  "This terminal is not authorised to send mail. It never was.",
];

/** Canned replies the mail client refuses to send. Pure comedy. */
export const mailActions: { label: string; title: string; message: string }[] = [
  {
    label: "Reply",
    title: "Cannot Send Mail",
    message:
      "Outgoing mail is disabled on detective terminals.\n\nThe Chief prefers to be told things in person, loudly.",
  },
  {
    label: "Forward",
    title: "Cannot Forward Mail",
    message:
      "Forwarding requires a second mailbox.\n\nThe precinct has one mailbox. We share it. It is not going well.",
  },
  {
    label: "Delete",
    title: "Access Denied",
    message:
      "Deleting evidence is, in this specific building, considered ironic.\n\nRequest logged.",
  },
  {
    label: "Print",
    title: "Printer Error",
    message:
      "PRN1: paper jam.\nPRN2: is the good printer, and is lying about being the good printer.\n\nNo pages were harmed.",
  },
];

/**
 * Handwritten follow-up the detective scribbles on the folder margin once an
 * exhibit is filed. Narrative only — never names the culprit before SQL does.
 */
export const clueNotes: Record<ClueId, { filedAt: string; note: string; lead: string }> = {
  "payroll-missing": {
    filedAt: "09:52",
    note: "Gone, not moved. Nobody drags a file into thin air by accident.",
    lead: "If the file left a hole, the machine wrote down who dug it.",
  },
  "access-logs": {
    filedAt: "10:04",
    note: "Six operations before the second coffee. This office types faster than it thinks.",
    lead: "Read every row. Somebody is in there twice.",
  },
  "kevin-timing": {
    filedAt: "10:19",
    note: "A statement and a timestamp cannot both be true. Timestamps do not get nervous.",
    lead: "Stop reading rows one at a time. Ask the table properly.",
  },
};

/** Rotating flavour for the Case Files status bar. */
export const dossierChatter: string[] = [
  "Folder condition: coffee ring, upper right.",
  "Evidence locker key is on the hook. Probably.",
  "Chief Brannigan walked past. Did not look in.",
  "Carbon copy filed with Records. Records lost it.",
  "Typewriter ribbon low. Press harder.",
];

/**
 * Interview-room observations the detective adds to a suspect card once a given
 * exhibit is filed. Flavour and pressure only — never names the culprit.
 */
export const suspectObservations: Record<string, Partial<Record<ClueId, string>>> = {
  linda: {
    "payroll-missing": "Asked, unprompted, whether the file was 'properly' deleted or 'just' deleted.",
    "access-logs": "Her account of the morning matches the machine, minute for minute. Rare.",
    "kevin-timing": "Has gone very quiet, in the manner of someone who was right all along.",
  },
  kevin: {
    "payroll-missing": "Volunteered that spreadsheets 'corrupt themselves all the time'. Nobody asked.",
    "access-logs": "Wanted to know whether logs can be 'rounded to the nearest hour'. They cannot.",
    "kevin-timing": "Stopped mid-sentence. Then asked where the break room was, as if new here.",
  },
  gary: {
    "payroll-missing": "Offered an alibi before being told what for. Offered two, actually.",
    "access-logs": "Very keen for us to look at the logs. Which is itself a kind of alibi.",
    "kevin-timing": "Delighted. Has begun telling people. Told the fern.",
  },
};

/** How hot the case feels, indexed by exhibits filed. Atmosphere, not logic. */
export const caseHeat: { label: string; line: string }[] = [
  { label: "COLD", line: "Three stories, no receipts. Nothing to press on yet." },
  { label: "WARM", line: "The file's last minute is on record. Somebody's morning just got shorter." },
  { label: "HOT", line: "The machine kept the whole morning. Stories are starting to rub." },
  { label: "AIRTIGHT", line: "Every exhibit filed. One account no longer survives the log." },
];

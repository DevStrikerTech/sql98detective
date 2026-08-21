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
};

export const suspects: Suspect[] = [
  {
    id: "linda",
    name: "Linda",
    role: "Accounting",
    statement: '"I opened payroll.xls to review it. That is all. I alphabetise my staplers."',
  },
  {
    id: "kevin",
    name: "Kevin",
    role: "Junior IT",
    statement: '"I never touched payroll.xls. Not once. Why would I. I wouldn\'t."',
  },
  {
    id: "gary",
    name: "Gary",
    role: "Office troublemaker",
    statement: '"I don\'t even know what a spreadsheet is. Is it a kind of jam?"',
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
  body: 'Someone deleted payroll.xls this morning.\n\nAccounting is panicking.\nFinance is blaming IT.\nIT is blaming Gary.\nGary says he "doesn\'t even know what a spreadsheet is."\n\nFind out what happened.\n\n— Chief Brannigan',
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

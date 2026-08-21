import type { IconName } from "@/components/win98/Win98Icon";

export type DriveEntry = {
  name: string;
  icon: IconName;
  detail: string;
};

export const drives: DriveEntry[] = [
  { name: "3½ Floppy (A:)", icon: "floppy", detail: "3½ Inch Floppy Disk" },
  { name: "Precinct Drive (C:)", icon: "hdd", detail: "Local Disk — 1.2 GB free" },
  { name: "EVIDENCE (D:)", icon: "cdrom", detail: "Compact Disc (read only)" },
  { name: "Suspects", icon: "folder", detail: "File Folder — 14 items" },
  { name: "Interrogations", icon: "folder", detail: "File Folder — 3 items" },
  { name: "Control Panel", icon: "settings", detail: "System configuration" },
  { name: "notes_final_FINAL2.doc", icon: "document", detail: "Document — 12 KB" },
];

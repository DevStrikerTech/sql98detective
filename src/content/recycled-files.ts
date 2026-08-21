export type RecycledFile = {
  name: string;
  origin: string;
  deleted: string;
  size: string;
};

export const recycledFiles: RecycledFile[] = [
  { name: "my_alibi_v3.doc", origin: "C:\\Suspects\\Vale", deleted: "8/21/98 02:41", size: "4 KB" },
  { name: "definitely_not_evidence.bmp", origin: "C:\\Windows\\Desktop", deleted: "8/20/98 23:58", size: "1,204 KB" },
  { name: "shredder_receipt.txt", origin: "C:\\Precinct\\Admin", deleted: "8/20/98 19:02", size: "1 KB" },
  { name: "chief_donut_ledger.xls", origin: "C:\\Precinct\\Chief", deleted: "8/19/98 08:14", size: "27 KB" },
  { name: "passwords.txt", origin: "C:\\Windows\\Desktop", deleted: "8/18/98 12:00", size: "1 KB" },
];

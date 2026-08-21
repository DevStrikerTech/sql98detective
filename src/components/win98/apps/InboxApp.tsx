import { useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "../Win98Icon";
import { emails } from "@/content/emails";

export function InboxApp() {
  const [idx, setIdx] = useState(0);
  const mail = emails[idx]!;
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="win98-field win98-scroll h-[130px] overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["From", "Subject", "Received"].map((h) => (
                <th
                  key={h}
                  className="win98-out sticky top-0 bg-surface px-[4px] py-[2px] text-left font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emails.map((m, i) => (
              <tr
                key={m.id}
                onClick={() => setIdx(i)}
                className={cn(
                  "cursor-default",
                  i === idx ? "bg-select text-select-ink" : "text-ink",
                )}
              >
                <td className="px-[4px] py-[1px] whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Win98Icon name="mail" size={12} />
                    {m.from}
                  </span>
                </td>
                <td className="px-[4px] py-[1px]">{m.subject}</td>
                <td className="px-[4px] py-[1px] whitespace-nowrap">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="win98-field win98-scroll min-h-0 flex-1 overflow-auto p-2">
        <div className="mb-2 border-b border-surface-shadow pb-1 text-[11px]">
          <div>
            <b>From:</b> {mail.from}
          </div>
          <div>
            <b>Subject:</b> {mail.subject}
          </div>
        </div>
        <pre className="font-ui text-[11px] leading-[1.5] whitespace-pre-wrap text-ink">
          {mail.body}
        </pre>
      </div>
    </div>
  );
}

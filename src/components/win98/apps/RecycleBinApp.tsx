import { useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "../Win98Icon";
import { recycledFiles } from "@/content/recycled-files";

export function RecycleBinApp() {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="win98-field win98-scroll min-h-0 flex-1 overflow-auto">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            {["Name", "Original Location", "Date Deleted", "Size"].map((h) => (
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
          {recycledFiles.map((f) => (
            <tr
              key={f.name}
              onClick={() => setSel(f.name)}
              className={cn(sel === f.name ? "bg-select text-select-ink" : "text-ink")}
            >
              <td className="px-[4px] py-[1px] whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Win98Icon name="document" size={12} />
                  {f.name}
                </span>
              </td>
              <td className="px-[4px] py-[1px]">{f.origin}</td>
              <td className="px-[4px] py-[1px] whitespace-nowrap">{f.deleted}</td>
              <td className="px-[4px] py-[1px]">{f.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

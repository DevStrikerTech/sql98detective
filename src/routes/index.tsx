import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BootSequence } from "@/components/win98/BootSequence";
import { Desktop } from "@/components/win98/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQL 98: Digital Detective — Solve Crimes in Windows 98" },
      {
        name: "description",
        content:
          "Boot up a retro Windows 98 desktop and play detective: browse the Inbox, dig through Case Files and open SQL.exe in a fully draggable 90s OS shell.",
      },
      { property: "og:title", content: "SQL 98: Digital Detective" },
      {
        property: "og:description",
        content:
          "A crime-solving browser game disguised as a Windows 98 desktop. Draggable windows, a Start menu and a very cold coffee subsystem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-boot">
      <h1 className="sr-only">SQL 98: Digital Detective</h1>
      {booted ? <Desktop /> : <BootSequence onDone={() => setBooted(true)} />}
    </main>
  );
}

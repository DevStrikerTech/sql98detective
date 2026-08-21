export type IconName =
  | "my-computer"
  | "inbox"
  | "case-files"
  | "sql-exe"
  | "recycle-bin"
  | "floppy"
  | "hdd"
  | "cdrom"
  | "folder"
  | "document"
  | "mail"
  | "start"
  | "shutdown"
  | "help"
  | "settings"
  | "find"
  | "programs"
  | "warning"
  | "info"
  | "speaker";

/**
 * Pixel-styled system icons drawn as tiny SVGs on a 16x16 grid so they scale
 * crisply and keep the chunky late-90s look. Colors come from design tokens.
 */
export function Win98Icon({ name, size = 32 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {paths[name]}
    </svg>
  );
}

const C = {
  ink: "var(--color-ink)",
  shadow: "var(--color-surface-shadow)",
  face: "var(--color-surface)",
  light: "var(--color-surface-light)",
  hilite: "var(--color-surface-hilite)",
  blue: "var(--color-title)",
  blue2: "var(--color-title-2)",
  teal: "var(--color-desktop)",
  green: "var(--color-terminal-ink)",
  black: "var(--color-terminal)",
  paper: "var(--color-field)",
  yellow: "oklch(0.87 0.17 92)",
  red: "oklch(0.55 0.21 27)",
  manila: "oklch(0.82 0.13 88)",
};

const paths: Record<IconName, React.ReactNode> = {
  "my-computer": (
    <>
      <rect x="1" y="2" width="14" height="9" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="3" width="12" height="7" fill={C.teal} />
      <rect x="3" y="4" width="6" height="1" fill={C.hilite} />
      <rect x="3" y="6" width="9" height="1" fill={C.light} />
      <rect x="4" y="11" width="8" height="3" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="14" width="12" height="1" fill={C.shadow} />
      <rect x="10" y="12" width="2" height="1" fill={C.green} />
    </>
  ),
  inbox: (
    <>
      <rect x="1" y="4" width="14" height="9" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="5" width="12" height="4" fill={C.paper} />
      <path d="M2 5 L8 9 L14 5" fill="none" stroke={C.ink} />
      <rect x="1" y="9" width="14" height="1" fill={C.shadow} />
      <rect x="3" y="11" width="10" height="1" fill={C.blue} />
      <rect x="11" y="1" width="4" height="4" fill={C.green} stroke={C.ink} strokeWidth="1" />
    </>
  ),
  "case-files": (
    <>
      <rect x="1" y="3" width="6" height="2" fill={C.manila} stroke={C.ink} strokeWidth="1" />
      <rect x="1" y="4" width="14" height="10" fill={C.manila} stroke={C.ink} strokeWidth="1" />
      <rect x="3" y="6" width="10" height="6" fill={C.paper} />
      <rect x="4" y="7" width="8" height="1" fill={C.shadow} />
      <rect x="4" y="9" width="6" height="1" fill={C.shadow} />
      <rect x="4" y="11" width="7" height="1" fill={C.red} />
    </>
  ),
  "sql-exe": (
    <>
      <rect x="1" y="2" width="14" height="12" fill={C.black} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="3" width="12" height="2" fill={C.blue} />
      <rect x="3" y="7" width="2" height="1" fill={C.green} />
      <rect x="5" y="8" width="2" height="1" fill={C.green} />
      <rect x="3" y="9" width="2" height="1" fill={C.green} />
      <rect x="8" y="7" width="5" height="1" fill={C.green} />
      <rect x="8" y="11" width="3" height="1" fill={C.green} />
    </>
  ),
  "recycle-bin": (
    <>
      <path d="M4 4 H12 L11 14 H5 Z" fill={C.light} stroke={C.ink} strokeWidth="1" />
      <rect x="3" y="2" width="10" height="2" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <rect x="6" y="6" width="1" height="6" fill={C.teal} />
      <rect x="8" y="6" width="1" height="6" fill={C.teal} />
      <rect x="10" y="6" width="1" height="6" fill={C.teal} />
    </>
  ),
  floppy: (
    <>
      <rect x="2" y="2" width="12" height="12" fill={C.ink} />
      <rect x="4" y="3" width="8" height="4" fill={C.light} />
      <rect x="9" y="4" width="2" height="3" fill={C.shadow} />
      <rect x="4" y="9" width="8" height="5" fill={C.hilite} />
    </>
  ),
  hdd: (
    <>
      <rect x="1" y="5" width="14" height="7" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="6" width="12" height="3" fill={C.light} />
      <rect x="3" y="10" width="6" height="1" fill={C.shadow} />
      <rect x="12" y="10" width="2" height="1" fill={C.green} />
    </>
  ),
  cdrom: (
    <>
      <rect x="1" y="5" width="14" height="7" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <circle cx="5" cy="8" r="2.5" fill={C.light} stroke={C.ink} />
      <circle cx="5" cy="8" r="0.7" fill={C.ink} />
      <rect x="9" y="10" width="5" height="1" fill={C.shadow} />
    </>
  ),
  folder: (
    <>
      <path d="M1 4 H6 L7 5 H15 V13 H1 Z" fill={C.manila} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="7" width="12" height="5" fill={C.yellow} />
    </>
  ),
  document: (
    <>
      <path d="M3 1 H10 L13 4 V15 H3 Z" fill={C.paper} stroke={C.ink} strokeWidth="1" />
      <rect x="5" y="6" width="6" height="1" fill={C.shadow} />
      <rect x="5" y="8" width="6" height="1" fill={C.shadow} />
      <rect x="5" y="10" width="4" height="1" fill={C.shadow} />
    </>
  ),
  mail: (
    <>
      <rect x="1" y="4" width="14" height="9" fill={C.paper} stroke={C.ink} strokeWidth="1" />
      <path d="M1 4 L8 9 L15 4" fill="none" stroke={C.ink} />
    </>
  ),
  start: (
    <>
      <rect x="1" y="2" width="6" height="6" fill={C.red} />
      <rect x="8" y="1" width="7" height="7" fill={C.green} />
      <rect x="1" y="9" width="6" height="6" fill={C.blue2} />
      <rect x="8" y="9" width="7" height="6" fill={C.yellow} />
    </>
  ),
  shutdown: (
    <>
      <circle cx="8" cy="9" r="5" fill="none" stroke={C.ink} strokeWidth="2" />
      <rect x="7" y="1" width="2" height="7" fill={C.red} stroke={C.ink} strokeWidth="0.5" />
    </>
  ),
  help: (
    <>
      <rect x="2" y="1" width="12" height="14" fill={C.paper} stroke={C.ink} strokeWidth="1" />
      <text x="8" y="12" fontSize="10" textAnchor="middle" fill={C.blue}>
        ?
      </text>
    </>
  ),
  settings: (
    <>
      <rect x="3" y="3" width="10" height="10" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <circle cx="8" cy="8" r="2" fill={C.blue} />
    </>
  ),
  find: (
    <>
      <circle cx="6" cy="6" r="4" fill={C.paper} stroke={C.ink} strokeWidth="1" />
      <rect x="9" y="9" width="5" height="2" fill={C.ink} transform="rotate(45 9 9)" />
    </>
  ),
  programs: (
    <>
      <rect x="1" y="3" width="12" height="10" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <rect x="2" y="4" width="10" height="2" fill={C.blue} />
      <rect x="3" y="8" width="8" height="1" fill={C.shadow} />
    </>
  ),
  warning: (
    <>
      <path d="M8 1 L15 14 H1 Z" fill={C.yellow} stroke={C.ink} strokeWidth="1" />
      <rect x="7" y="6" width="2" height="4" fill={C.ink} />
      <rect x="7" y="11" width="2" height="2" fill={C.ink} />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="7" fill={C.blue} stroke={C.ink} />
      <rect x="7" y="6" width="2" height="6" fill={C.hilite} />
      <rect x="7" y="3" width="2" height="2" fill={C.hilite} />
    </>
  ),
  speaker: (
    <>
      <path d="M2 6 H5 L8 3 V13 L5 10 H2 Z" fill={C.face} stroke={C.ink} strokeWidth="1" />
      <path d="M10 5 Q13 8 10 11" fill="none" stroke={C.ink} />
    </>
  ),
};

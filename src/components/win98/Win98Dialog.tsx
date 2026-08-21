import { Win98Button } from "./Win98Button";
import { TitleBar } from "./TitleBar";
import { Win98Icon, type IconName } from "./Win98Icon";

type Props = {
  title: string;
  message: React.ReactNode;
  icon?: IconName;
  buttons?: { label: string; onClick: () => void }[];
  onClose: () => void;
};

/** Modal system dialog, centered over the desktop with a fake modal veil. */
export function Win98Dialog({ title, message, icon = "warning", buttons, onClose }: Props) {
  const actions = buttons ?? [{ label: "OK", onClick: onClose }];
  return (
    <div className="absolute inset-0 z-[9000] flex items-center justify-center">
      <div className="win98-out anim-snap-open w-[340px] bg-surface p-[3px]">
        <TitleBar title={title} active onClose={onClose} />
        <div className="flex items-start gap-3 px-4 py-5">
          <Win98Icon name={icon} size={32} />
          <div className="pt-1 text-[11px] leading-[1.5] text-ink">{message}</div>
        </div>
        <div className="flex justify-center gap-2 pb-4">
          {actions.map((b) => (
            <Win98Button key={b.label} onClick={b.onClick}>
              {b.label}
            </Win98Button>
          ))}
        </div>
      </div>
    </div>
  );
}

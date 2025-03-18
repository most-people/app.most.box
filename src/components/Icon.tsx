export type IconName =
  | "chat"
  | "chat-active"
  | "note"
  | "note-active"
  | "explore"
  | "explore-active"
  | "mine"
  | "web3"
  | "about"
  | "setting"
  | "join"
  | "download"
  | "exit"
  | "qr-code"
  | "mine-active"
  | "arrow";

interface IconProps {
  name: IconName;
  size?: number;
}

export const Icon = ({ name, size }: IconProps) => {
  return (
    <svg className={`iconpark ${name}`} fontSize={size ?? 24}>
      <use href={`#${name}`}></use>
    </svg>
  );
};

import { createElement } from "react";

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
  | "back"
  | "home"
  | "more"
  | "qr-code"
  | "mine-active"
  | "arrow";

interface IconProps {
  name: IconName;
  size?: number;
}

export const Icon = ({ name, size }: IconProps) => {
  // return (
  //   <svg className={`iconpark ${name}`} fontSize={size ?? 24}>
  //     <use href={`#${name}`}></use>
  //   </svg>
  // );
  return createElement("iconpark-icon", {
    name,
    width: size ?? 24,
    height: size ?? 24,
  });
};

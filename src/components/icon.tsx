import { createElement } from "react";

export type IconName =
  | "chat"
  | "chat-active"
  | "note"
  | "note-active"
  | "explore"
  | "explore-active"
  | "mine"
  | "mine-active";

interface IconProps {
  name: IconName;
  size?: number;
}

export const Icon = ({ name, size }: IconProps) => {
  return createElement("iconpark-icon", {
    name,
    width: size ?? 24,
    height: size ?? 24,
  });
};

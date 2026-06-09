export type TierId = "S" | "A" | "B" | "C" | "D";

export type ContainerId = "tray" | TierId;

export type TierItem = {
  id: string;
  title: string;
  accentClassName: string;
  imageUrl?: string;
};

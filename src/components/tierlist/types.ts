export type TierId = string;

export type ContainerId = "tray" | TierId;

export type Tier = {
  id: TierId;
  label: string;
  colorClassName: string;
  isDefault?: boolean;
};

export type TierItem = {
  id: string;
  title: string;
  accentClassName: string;
  imageUrl?: string;
};

import { IconType } from '@gnosis.pm/safe-react-components';

export type SelectItem = {
  id: string;
  label: string;
  subLabel?: string;
  iconUrl?: string;
};

export type TabItem = {
  id: string;
  icon?: keyof IconType;
  label: string;
  disabled?: boolean;
};

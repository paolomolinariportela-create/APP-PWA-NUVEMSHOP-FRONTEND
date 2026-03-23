export type PhonePreviewMode = 'splash' | 'app';
export type SizeOption = 'xs' | 'small' | 'medium' | 'large' | 'xl';

export interface PhonePreviewProps {
  appName: string;
  themeColor: string;
  logoUrl: string;

  fabEnabled?: boolean;
  fabText?: string;
  fabPosition?: string;
  fabIcon?: string;
  fab_size?: SizeOption;
  fab_color?: string;

  topbar_enabled?: boolean;
  topbar_text?: string;
  topbar_button_text?: string;
  topbar_icon?: string;
  topbar_position?: 'top' | 'bottom';
  topbar_color?: string;
  topbar_text_color?: string;
  topbar_size?: SizeOption;

  popup_enabled?: boolean;
  popup_image_url?: string;

  storeUrl?: string;
  bottomBarBg?: string;
  bottomBarIconColor?: string;
  mode?: PhonePreviewMode;
  showBottomBar?: boolean;
}

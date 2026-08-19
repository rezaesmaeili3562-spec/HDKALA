import type { SVGProps, ReactElement } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
  fill?: string;
};

type IconComponent = (props?: IconProps) => ReactElement;

export const BagIcon: IconComponent;
export const HeartIcon: IconComponent;
export const StarIcon: IconComponent;
export const SearchIcon: IconComponent;
export const MenuIcon: IconComponent;
export const XIcon: IconComponent;
export const SunIcon: IconComponent;
export const MoonIcon: IconComponent;
export const ChevronLeftIcon: IconComponent;
export const ChevronRightIcon: IconComponent;
export const ChevronDownIcon: IconComponent;
export const TrashIcon: IconComponent;
export const PlusIcon: IconComponent;
export const MinusIcon: IconComponent;
export const CheckIcon: IconComponent;
export const AlertIcon: IconComponent;
export const InfoIcon: IconComponent;
export const UserIcon: IconComponent;
export const LogoutIcon: IconComponent;
export const MapPinIcon: IconComponent;
export const PhoneIcon: IconComponent;
export const MailIcon: IconComponent;
export const ClockIcon: IconComponent;
export const TruckIcon: IconComponent;
export const ShieldIcon: IconComponent;
export const CreditCardIcon: IconComponent;
export const HeadsetIcon: IconComponent;
export const PackageIcon: IconComponent;
export const HomeIcon: IconComponent;
export const ShieldCheckIcon: IconComponent;
export const ChartIcon: IconComponent;
export const BoxesIcon: IconComponent;
export const ClipboardIcon: IconComponent;
export const UsersIcon: IconComponent;
export const MessageIcon: IconComponent;
export const TicketIcon: IconComponent;
export const SettingsIcon: IconComponent;
export const PencilIcon: IconComponent;
export const EyeIcon: IconComponent;

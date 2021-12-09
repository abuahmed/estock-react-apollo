import { ReactNode } from "react";

export interface NavItemChildProps {
  href: string;
  title: string;
  role: string;
  icon: ReactNode;
  nested?: boolean;
  clickedText?: string | undefined;
  click?: () => void;
}
export interface NavItemProps {
  href: string;
  title: string;
  role: string;
  icon: ReactNode;
  nested?: boolean;
  clickedText?: string | undefined;
  click?: () => void;
  children?: NavItemChildProps[] | undefined;
}

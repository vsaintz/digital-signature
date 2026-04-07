import {
  BadgeCheck,
  BadgeIndianRupee,
  BadgeQuestionMark,
  BadgeX,
  BicepsFlexed,
  ChevronDown,
  CloudUpload,
  File,
  FileSpreadsheet,
  FolderOpen,
  KeyRound,
  Layers,
  Loader,
  Lock,
  LogOut,
  Settings,
  ShieldAlert,
  Upload,
  Users,
  X,
} from "lucide-angular"

export const APP_ICONS = {
  ChevronDown,
  Layers,
  Settings,
  X,

  File,
  FileSpreadsheet,
  FolderOpen,
  CloudUpload,
  Upload,

  BadgeCheck,
  BadgeQuestionMark,
  BadgeX,
  Loader,
  ShieldAlert,

  KeyRound,
  Lock,
  LogOut,
  Users,

  BadgeIndianRupee,
  BicepsFlexed,
} as const

export type AppIconName = keyof typeof APP_ICONS

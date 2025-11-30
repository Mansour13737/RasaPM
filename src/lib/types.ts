export type UserRole = 'Admin' | 'PM' | 'Technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  imageHint: string;
  technicianId: string;
}

export type TaskType = 'static' | 'dynamic';
export type TaskFieldType = 'checkbox' | 'text' | 'number' | 'photo';

export interface TaskField {
  id: string;
  label: string;
  type: TaskFieldType;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  fields: TaskField[];
}

export type PMStatus = 'Pending' | 'In Progress' | 'Completed' | 'Reviewed' | 'Cancelled';

export interface WeeklyPM {
  id: string;
  weekIdentifier: string; // e.g., "2024-W28"
  siteId: string;
  assignedTechnicianId: string | null;
  status: PMStatus;
  tasks: TaskResult[];
  crNumber?: string;
  comments?: { userId: string; text: string; timestamp: string }[];
}

export interface TaskResult {
  taskId: string;
  isCompleted: boolean;
  notes: string;
  photos: string[]; // URLs to photos
  location: { lat: number; lng: number } | null;
  checklist: { [itemId: string]: boolean };
  customFields: { [fieldId: string]: any };
}

export type CRStatus = 'باز' | 'در حال انجام' | 'انجام شده' | 'رد شده';
export type CRPriority = 'کم' | 'متوسط' | 'زیاد' | 'بحرانی';
export type CRType = 'برای PM' | 'برای رفع خرابی' | 'برای بازدید در موارد خاص';

export interface ChangeRequest {
  id: string;
  siteId: string;
  city: string;
  technicianName: string;
  startDate: string;
  endDate: string;
  title: CRType;
  description: string;
  submittedBy: string; // userId
  createdAt: string;
  status: CRStatus;
  priority: CRPriority;
  photos: string[];
}

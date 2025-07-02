// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  contactNumber: string;
  address: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'resident' | 'admin' | 'staff';

// Document Types
export interface DocumentType {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  fee: number;
  processingTime: string; // e.g., "3-5 business days"
  isActive: boolean;
}

export interface Application {
  id: string;
  userId: string;
  documentTypeId: string;
  purpose: string;
  status: ApplicationStatus;
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  completedAt?: Date;
  rejectionReason?: string;
  attachments: Attachment[];
  trackingNumber: string;
  user?: User;
  documentType?: DocumentType;
}

export type ApplicationStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'completed' 
  | 'cancelled';

export interface Attachment {
  id: string;
  applicationId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: Date;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  contactNumber: string;
  address: string;
}

export interface ApplicationForm {
  documentTypeId: string;
  purpose: string;
  attachments: File[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  completedApplications: number;
  totalUsers: number;
  recentApplications: Application[];
}
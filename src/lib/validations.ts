import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),
  contactNumber: z.string().regex(/^(\+63|0)?9\d{9}$/, 'Invalid Philippine phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Application schemas
export const applicationSchema = z.object({
  documentTypeId: z.string().min(1, 'Please select a document type'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  attachments: z.array(z.instanceof(File)).min(1, 'At least one attachment is required')
});

// User management schemas
export const updateUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),
  contactNumber: z.string().regex(/^(\+63|0)?9\d{9}$/, 'Invalid Philippine phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword']
});

// Admin schemas
export const processApplicationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  notes: z.string().optional(),
  rejectionReason: z.string().optional()
}).refine((data) => {
  if (data.status === 'rejected' && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: 'Rejection reason is required when rejecting an application',
  path: ['rejectionReason']
});

export const documentTypeSchema = z.object({
  name: z.string().min(3, 'Document name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  fee: z.number().min(0, 'Fee cannot be negative'),
  processingTime: z.string().min(1, 'Processing time is required')
});

// Search and filter schemas
export const applicationFilterSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'completed', 'cancelled']).optional(),
  documentType: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional()
});

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10)
});

// File upload schema
export const fileUploadSchema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, 'At least one file is required')
    .max(5, 'Maximum 5 files allowed')
    .refine((files) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      return files.every(file => file.size <= maxSize);
    }, 'Each file must be less than 5MB')
    .refine((files) => {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return files.every(file => allowedTypes.includes(file.type));
    }, 'Invalid file type. Only images, PDF, and Word documents are allowed')
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProcessApplicationFormData = z.infer<typeof processApplicationSchema>;
export type DocumentTypeFormData = z.infer<typeof documentTypeSchema>;
export type ApplicationFilterData = z.infer<typeof applicationFilterSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
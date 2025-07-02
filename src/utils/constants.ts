import { DocumentType, ApplicationStatus } from '@/types';

// Document Types offered by the barangay
export const DOCUMENT_TYPES: Omit<DocumentType, 'id' | 'isActive'>[] = [
  {
    name: 'Barangay Clearance',
    description: 'Certificate of good standing in the barangay',
    requirements: [
      'Valid ID',
      'Proof of residency',
      '1x1 ID picture',
      'Barangay residency certificate'
    ],
    fee: 50,
    processingTime: '1-2 business days'
  },
  {
    name: 'Certificate of Indigency',
    description: 'Certificate for low-income families',
    requirements: [
      'Valid ID',
      'Proof of residency',
      'Income statement or affidavit',
      '1x1 ID picture'
    ],
    fee: 0,
    processingTime: '2-3 business days'
  },
  {
    name: 'Business Permit',
    description: 'Permit to operate a business in the barangay',
    requirements: [
      'Valid ID',
      'Business registration documents',
      'Barangay clearance',
      'Location sketch',
      'Fire safety inspection certificate'
    ],
    fee: 500,
    processingTime: '5-7 business days'
  },
  {
    name: 'Certificate of Residency',
    description: 'Proof of residence in the barangay',
    requirements: [
      'Valid ID',
      'Proof of address',
      '1x1 ID picture',
      'Affidavit of residency'
    ],
    fee: 30,
    processingTime: '1-2 business days'
  },
  {
    name: 'Barangay ID',
    description: 'Official barangay identification card',
    requirements: [
      'Valid government ID',
      'Proof of residency',
      '2x2 ID picture',
      'Voter\'s registration (if applicable)'
    ],
    fee: 100,
    processingTime: '3-5 business days'
  }
];

// Application Status with display information
export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, {
  label: string;
  color: string;
  description: string;
}> = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-600 bg-yellow-50',
    description: 'Application submitted and waiting for review'
  },
  under_review: {
    label: 'Under Review',
    color: 'text-blue-600 bg-blue-50',
    description: 'Application is being reviewed by staff'
  },
  approved: {
    label: 'Approved',
    color: 'text-green-600 bg-green-50',
    description: 'Application approved and ready for processing'
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600 bg-red-50',
    description: 'Application rejected due to incomplete requirements'
  },
  completed: {
    label: 'Completed',
    color: 'text-primary bg-primary/10',
    description: 'Document ready for pickup or delivered'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-gray-600 bg-gray-50',
    description: 'Application cancelled by applicant'
  }
};

// File upload constraints
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxFiles: 5
};

// Pagination defaults
export const PAGINATION_CONFIG = {
  defaultLimit: 10,
  maxLimit: 50
};

// Contact information
export const BARANGAY_INFO = {
  name: 'Barangay Almanza Dos',
  address: 'Las Piñas City, Metro Manila',
  contactNumber: '+63 2 8872-1234',
  email: 'almanzados@laspinas.gov.ph',
  officeHours: 'Monday to Friday, 8:00 AM - 5:00 PM',
  captain: 'Hon. Juan Dela Cruz'
};
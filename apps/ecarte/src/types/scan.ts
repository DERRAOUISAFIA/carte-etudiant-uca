export interface VerifySuccessResponse {
  valid: true;
  student: VerifiedStudent;
}

export interface VerifyFailureResponse {
  valid: false;
  reason: 'QR_EXPIRED' | 'CARD_SUSPENDED' | 'STUDENT_NOT_FOUND';
}

export type VerifyResponse = VerifySuccessResponse | VerifyFailureResponse;

export interface VerifiedStudent {
  id: string;
  cne: string;
  apogee: string;
  filiere: string;
  etablissement: string;
  photoUrl: string | null;
  anneeInscription: string;
}

export interface ScanLogRequest {
  userId: string;
  location?: string;
}

export interface ScanLogResponse {
  id: string;
  userId: string;
  scannedBy: string;
  location: string | null;
  createdAt: string;
}

export interface ScansQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filiere?: string;
  etablissement?: string;
}

export interface ScanLogEntry {
  id: string;
  userId: string;
  scannedBy: string;
  location: string | null;
  createdAt: string;
  user: {
    email: string;
    studentInfo: {
      cne: string;
      apogee: string;
      filiere: string;
      etablissement: string;
    } | null;
  };
}

export interface PaginatedScans {
  data: ScanLogEntry[];
  total: number;
  page: number;
  limit: number;
}

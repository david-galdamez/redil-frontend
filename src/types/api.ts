interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Error[];
}

interface Error {
  field: string;
  message: string;
}

interface PaginatedResponse<T> {
  data: T;
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

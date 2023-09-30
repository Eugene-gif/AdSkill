export interface Pagination {
  page: number;
  pages: number;
  perPage: number;
  totalCount: number;
}

export interface PaginationResponse<T> {
  items: Array<T>;
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  result: T;
}

export interface ErrorResponse {
  error: {
    debug?: {
      message: string;
    };
    message: string;
  };
  success: boolean;
}

export interface ApiPaginateResponse<T> {
  success: boolean;
  result: PaginationResponse<T>;
}

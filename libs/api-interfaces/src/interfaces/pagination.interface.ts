export interface Pagination<T> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  data: T[];
}

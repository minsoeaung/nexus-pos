export type PagedResponse<T> = {
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
  results: T[];
};
export type ApiError = {
  status: number;
  detail: string | undefined;
  title: string;
  type: string;
  errors: Record<string, string[]> | undefined;
}
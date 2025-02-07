export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  monthly_limit?: number;
  usage: number;
  user_id: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

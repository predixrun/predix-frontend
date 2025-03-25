export interface FetchGameHistoryParams {
    category: string;
    page: number;
    take: number;
    status?: "ONGOING" | "END";
  }
export type paginatedResponse = {
  code: number;
  data: Array<Record<any, any>>;
  message: string;
  status: string;
  meta: meta;
};

export type standardResponse = {
  code: number;
  data: Record<any, any> | null;
  message: string;
  status: string;
};

export type meta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export class ResponseManager {
  public static standardResponse(status: string, code: number, message: string, results: Record<any, any> | null, exception?: string) {
    return {
      status,
      code,
      message,
      exception,
      data: results,
    };
  }

  public static paginatedResponse(
    status: string,
    code: number,
    message: string,
    results: Array<Record<any, any>>,
    meta: meta,
  ) {
    return {
      status,
      code,
      message,
      data: results,
      meta,
    };
  }
}

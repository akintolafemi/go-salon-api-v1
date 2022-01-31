export type paginatedResponse = {
  code: number;
  data: Array<Record<any, any>>;
  message: string;
  status: string;
  metaData: metaData;
  exception: string | null;
};

export type standardResponse = {
  code: number;
  data: Record<any, any> | null;
  message: string;
  status: string;
  exception: string | null;
};

export type metaData = {
  rowsReturned: number;
  totalRows: number;
  rowsPerPage: number;
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
    metaData: metaData,
    results: Array<Record<any, any>>,
    exception?: string
  ) {
    return {
      status,
      code,
      message,
      metaData,
      data: results,
      exception
    };
  }
}

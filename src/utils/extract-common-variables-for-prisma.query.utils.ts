import { getCorrectObject } from "@utils/get-correct-object.utils";
import { globalQueryFields, paginationQueryFields, validSelectedQueryFields } from "@constants/global.constants";
import RequestWithUser from "../types/request-with-user.types";
import { PrismaService } from "../prisma.service";
import { DateTime } from "luxon";

export const extractCommonVariablesForPrismaQueryUtils = async (query: Record<any, any>, request: RequestWithUser) => {
  const orderByQuery: Record<string, string> = { ...query.orderby };
  const globalQuery = getCorrectObject(globalQueryFields, query);
  const paginationQuery = getCorrectObject(paginationQueryFields, query);
  const page = paginationQuery["page"] || undefined;
  const limit = paginationQuery["limit"] ? paginationQuery["limit"] : 50;

  let fromDate = undefined;
  let toDate = undefined;
  let fromDaterange = undefined;
  let toDaterange = undefined;
  let datecreated = undefined;
  let datecreatedto = undefined;
  

  //check if there's daterange in param
  if (query["daterange"]) {
    fromDaterange = new Date(query["daterange"][0]);
    toDaterange = new Date(query["daterange"][1]);
  }

  //check if there is datefrom in param
  query["datefrom"] ? fromDate = query["datefrom"] : fromDate = fromDaterange;

  //check if there is dateto in param
  query["dateto"] ? toDate = DateTime.fromISO(query["dateto"]).endOf("day").toISO() : toDate = toDaterange;

  if (query["datecreated"]) {
    datecreated = query["datecreated"];
    var veryEndOfDay = DateTime.fromISO(datecreated).endOf("day").toISO();
    datecreatedto = veryEndOfDay;

    fromDate = datecreated;

    toDate = datecreatedto;
  }

  return {
    globalQuery,
    orderByQuery,
    page,
    fromDate,
    toDate,
    limit,
  };
};

export const extractSelectedVariablesForPrismaQueryUtils = async (query: Record<any, any>) => {
  const selectedQuery = getCorrectObject(validSelectedQueryFields, query);
  
  let datedeleted = selectedQuery["datedeleted"]; 
  let datedeletedto = undefined;
  let deleted = selectedQuery["deleted"]; 
  if (datedeleted) {
    var veryEndOfDay = DateTime.fromISO(datedeleted).endOf("day").toISO();
    datedeletedto = veryEndOfDay;
  }

  return {
    datedeleted: { gte: datedeleted, lt: datedeletedto },
    deleted
  }
}

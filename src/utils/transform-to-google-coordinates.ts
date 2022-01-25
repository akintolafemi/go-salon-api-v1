import { HttpException, HttpStatus } from "@nestjs/common";
import { ResponseManager, standardResponse } from "./response-manager.utils";
import isNumeric from "./is-number";

export const transformToGoogleCoordinatesStrings = (value: string, field: string) => {

  let mapPoints = {}
  //check if value is not 
  if (typeof value === "number") {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `${field} must be type of string`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check if value is not object
  if (typeof value === "object") {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `${field} is not a valid request data`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //remove empty spaces from value
  value = value.replace(/\s/g, '');

  //convert value to an array
  let values = value.split(",");
  
  //check for lengths of array
  if (values.length > 4) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `${field} max length of converted value must be 4`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  if (values.length < 2) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `${field} min length of converted value must be 2`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  mapPoints["latitude"] = values[0];
  mapPoints["longitude"] = values[1];
  mapPoints["latitudeDelta"] = values[2] ? values[2] : null;
  mapPoints["longitudeDelta"] = values[3] ? values[3] : null;

  return JSON.stringify(mapPoints);
  
}
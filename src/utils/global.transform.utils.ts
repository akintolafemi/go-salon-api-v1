import { HttpException, HttpStatus } from "@nestjs/common";
import { ResponseManager } from "@utils/response-manager.utils";
import { DateTime } from "luxon";

const isNumeric = (value: number) => !isNaN(value);

export const transformToValidDateRange = (value: string, fieldName: string) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is NOT an object
  if (typeof value === "object") {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is not just a plain number
  if (isNumeric(Number(value))) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  const dateArray = value.split(",");

  //check that value was split correctly
  if (!dateArray[1]) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //validate dates
  const fromDate = dateArray[0].split("-");
  validateDate(fromDate);

  const toDate = dateArray[1].split("-");
  validateDate(toDate);

  const veryEndOfDay = dateArray[1].concat("T23:59:59.999");

  //convert to ISO string
  return [DateTime.fromISO(dateArray[0]).toISO(), DateTime.fromISO(veryEndOfDay).toISO()];
}

export const transformToNumberArray = (value: string, fieldName: string) => {
  let newArray = [];

  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is NOT an object
  if (typeof value === "object") {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  if (isNumeric(Number(value))) {
    newArray.push(Number(value));
    return newArray;
  } else {
    newArray = value.split(",");

    newArray.forEach((el) => {
      if (!isNumeric(el)) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return newArray.map((el) => Number(el));
  }
};

export const transformToNumber = (value: string, fieldName: string) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is not a string
  if (!isNumeric(Number(value))) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  return Number(value);
}

export const transformToValidDate = (value: string, fieldName: string) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is NOT an object
  if (typeof value === "object") {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is not just a plain number
  if (isNumeric(Number(value))) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //validate dates
  const fromDate = value.split("-");
  validateDate(fromDate);

  //convert to ISO string
  return DateTime.fromISO(value).toISO();
};

const validateDate = (dateArray: string[]) => {
  if (dateArray.length !== 3) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter date is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  dateArray.forEach((el, index) => {
    if (!isNumeric(Number(el))) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter date is invalid`, null),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (index > 0) {
      if (el.length !== 2) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter date is invalid`, null),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  });
};

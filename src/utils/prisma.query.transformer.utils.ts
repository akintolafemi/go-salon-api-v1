import { HttpException, HttpStatus } from "@nestjs/common";
import { ResponseManager } from "@utils/response-manager.utils";

const isNumeric = (value: number) => !isNaN(value);

const validSortKeys = ["gt", "gte", "lt", "lte"];
const validOrderByValues = ["asc", "desc"];

export const transformToPrismaInQueryForNumber = (value: string, fieldName: string) => {
  let newArray = [];

  //ensure value is NOT empty
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
    return { in: newArray };
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

    return { in: newArray.map((el) => Number(el)) };
  }
};

export const transformToPrismaInQueryForString = (value: string, fieldName: string) => {
  let newArray = [];

  //ensure value is NOT empty
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
    newArray.push(value);
    return { in: newArray };
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

    return { in: newArray };
  }
};

export const transformToPrismaInQueryForEnum = (value: string, fieldName: string, validEnumArray: string[]) => {
  let newArray = [];

  //ensure value is NOT empty
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
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  newArray = value.split(",");

  newArray.forEach((el) => {
    if (isNumeric(el)) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!validEnumArray.includes(el)) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
        HttpStatus.BAD_REQUEST,
      );
    }
  });

  return { in: newArray };
};

export const transformToPrismaContainsQueryForString = (value: string | Record<string, string>, fieldName: string) => {
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

  //ensure value is NOT a number
  if (isNumeric(Number(value))) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //transform
  return { contains: value };
};

export const transformToPrismaSortQuery = (value: any, fieldName: string) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check if value is just a number
  if (isNumeric(Number(value))) {
    return Number(value);
  }

  //if process gets here; then value could be an object
  //check that value is an object
  if (typeof value === "object") {
    for (const key in value) {
      //check that key is valid
      if (!validSortKeys.includes(String(key))) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
          HttpStatus.BAD_REQUEST,
        );
      }

      //check that property is valid
      if (!isNumeric(Number(value[key]))) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter id ${fieldName} invalid`, null),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //transform
    for (const key in value) {
      value[key] = Number(value[key]);
    }
    return value;
  }

  //this will only throw if value is NOT a number or a valid object
  throw new HttpException(
    ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
    HttpStatus.BAD_REQUEST,
  );
};

export const transformToPrismaOrderByQuery = (value: any, validOrderByArray: string[]) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `order by query parameter cannot empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  if (typeof value === "object") {
    for (const key in value) {
      //check that properties are valid
      if (!validOrderByValues.includes(String(value[key]))) {
        throw new HttpException(
          ResponseManager.standardResponse(
            "fail",
            HttpStatus.BAD_REQUEST,
            `property: '${value[key]}' in order by query parameter is invalid \n
            property can only  either be 'asc' OR 'desc'`,
            null,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }

      //check that keys are valid
      if (!validOrderByArray.includes(String(key))) {
        throw new HttpException(
          ResponseManager.standardResponse(
            "fail",
            HttpStatus.BAD_REQUEST,
            `key: '${key}' in order by query parameter is invalid;
            key must be a valid field name`,
            null,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }

  //this will only throw if value is NOT a number or a valid object
  throw new HttpException(
    ResponseManager.standardResponse(
      "fail",
      HttpStatus.BAD_REQUEST,
      `value passed in order by query parameter is invalid; the valid format for an order by query parameter would be :; '?orderBy[fieldName]=asc | desc'`,
      null,
    ),
    HttpStatus.BAD_REQUEST,
  );
};

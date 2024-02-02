import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authorization = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    const value = token?.split("")[1];

    if (value) {
      jwt.verify(value, "justasecret", (err: any, data: any) => {
        if (err) {
          return res.status(401).json({
            message: "an error occured while verifying",
          });
        } else {
          req.data = data;
          next();
        }
      });
    } else {
      return res.status(404).json({
        message: "invalid Token",
      });
    }
  } else {
    return res.status(404).json({
      message: "You are not allowed to access this",
    });
  }
};

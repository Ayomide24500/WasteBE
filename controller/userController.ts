import { Request, Response } from "express";
import userModel from "../model/userModel";
import { HTTP } from "../utils/enums";
import { sendEmail } from "../utils/email";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.params;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      status: "user",
      token,
    });
    sendEmail(user);
    return res.status(HTTP.CREATED).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "error creating user",
      status: HTTP.BAD,
    });
  }
};

export const updateUserLocation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const user = await userModel.findById(userID);

    if (user) {
      const location = await userModel.findByIdAndUpdate(
        userID,
        {
          address: "",
        },
        { new: true }
      );
      return res.status(HTTP.CREATED).json({
        message: "user created successfully",
        data: location,
        status: HTTP.CREATED,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "error getting user ",
        status: HTTP.BAD,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "error creating user",
      status: HTTP.BAD,
    });
  }
};

export const verifyAll = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const getFollwers = await userModel.findOne({ token });
    if (getFollwers) {
      await userModel.findByIdAndUpdate(
        getFollwers._id,
        {
          token: "",
          verify: true,
        },
        { new: true }
      );

      return res.status(HTTP.OK).json({
        message: "you have been verified 👍👍",
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "you are not found",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error verifying",
    });
  }
};
export const signinAll = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;
    const getUser = await userModel.findOne({ email });
    if (getUser) {
      const passwordCheck = await bcrypt.compare(password, getUser.password);

      if (passwordCheck) {
        if (getUser.verify && getUser.token === "") {
          const token = jwt.sign(
            {
              id: getUser._id,
              status: getUser.status,
            },
            "justasecret",
            { expiresIn: "2d" }
          );
          req.session.isAuth = true;
          req.session.data = getUser;

          return res.status(HTTP.OK).json({
            message: "you have been verified",
            data: token,
          });
        } else {
          return res.status(HTTP.BAD).json({
            message: "account hasn't been verified",
          });
        }
      } else {
        return res.status(HTTP.BAD).json({
          message: "password error",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        message: "Not found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error Sign_in : User",
    });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.body;

    const user = await userModel.findById(userID);

    return res.status(HTTP.OK).json({
      message: "getting user successfully",
      data: user,
      status: HTTP.OK,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "error verifing user",
      status: HTTP.BAD,
    });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find();

    return res.status(HTTP.OK).json({
      message: "error verifing user",
      data: user,
      status: HTTP.OK,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "error verifing user",
      status: HTTP.BAD,
    });
  }
};

export const logOut = async (req: any, res: Response) => {
  try {
    req.session.destroy();

    return res.status(HTTP.OK).json({
      message: "User has been logged out",
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

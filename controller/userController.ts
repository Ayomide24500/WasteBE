
import { Request, Response } from "express";
import userModel from "../model/userModel";
import crypto from "crypto";
import { HTTP } from "../utils/enums";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail, sendResetPasswordEmail } from "../utils/email";



export const updateUserLocation = async(req:Request, res:Response):Promise<Response> => {
  try {
    const {userID} = req.params;
    

    const user = await userModel.findById(userID);

    if (user) {
      const location = await userModel.findByIdAndUpdate(userID,{
        address: "",
      },
      {new: true}
      );
      return res.status(HTTP.CREATED).json({
      message: 'user created successfully',
      data: location,
      status: HTTP.CREATED
    });
    } else {
      return res.status(HTTP.BAD).json({
      message: 'error getting user ',
      status: HTTP.BAD
    });
    }

    
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: 'error creating user',
      status: HTTP.BAD
    });
  }
}

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

export const resetPassWord = async (req: any, res: Response) => {
  try {
    const { email } = req.body;
    const get = await userModel.findOne({ email });
    if (get) {
      const token = crypto.randomBytes(16).toString("hex");

      const check = await userModel.findByIdAndUpdate(
        get._id,
        {
          token,
        },
        { new: true }
      );

      sendResetPasswordEmail(check);

      return res.status(HTTP.OK).json({
        message: "An email has been sent to confirm your request",
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "Not found",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error signing In..",
    });
  }
}



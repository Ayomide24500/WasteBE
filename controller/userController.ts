import { Request, Response } from "express";
import crypto from "crypto";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel";
import { FOOD, HTTP } from "../utils/enums";
import { sendEmail, sendResetPasswordEmail } from "../utils/email";
import passwordModel from "../model/passwordModel";
import { Types } from "mongoose";
export const createClient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ password });
    if (existingUser) {
      // Password already exists, return an error
      return res.status(HTTP.BAD).json({
        message: "Password already exists",
        createdAt: existingUser.get("createdAt"),
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.client,
    });
    sendEmail(user);
    return res.status(HTTP.CREATED).json({
      message: "client created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user",
    });
  }
};
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.ADMIN,
    });
    return res.status(HTTP.CREATED).json({
      message: "you registered as an admin",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user",
    });
  }
};
export const createVendor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.VENDOR,
    });
    return res.status(HTTP.CREATED).json({
      message: "you registered as an Vendor",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user",
    });
  }
};
export const createLogistics = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.DISPATCHER,
    });
    return res.status(HTTP.CREATED).json({
      message: "you registered as a dispatcher",
      data: user,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user",
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
2;
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
      message: "Error creating : ",
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
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params;

    const getClient = await userModel.findById(userID);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (getClient) {
      if (getClient.token !== "" && getClient.verify) {
        const checker = (
          await getClient.populate({ path: "allpasswords" })
        ).allpassword?.find((el: any) => el.password === password);

        if (checker) {
          return res.status(404).json({
            message: `you have use this password before at ${moment(
              checker.createdAt
            ).fromNow()}`,
          });
        } else {
          await userModel.findByIdAndUpdate(
            getClient._id,
            {
              password: hashedPassword,
              token: "",
            },
            { new: true }
          );
        }
        const newS = await passwordModel.create({ password });
        checker?.allpasswords.push(new Types.ObjectId(newS._id));
        checker.save();
        return res.status(HTTP.OK).json({
          message: "Your password has been changed",
        });
      } else {
        return res.status(HTTP.BAD).json({
          message: "please go and verify your account",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        message: "Not found",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error changing password",
    });
  }
};

export const getAllDealer = async (req: any, res: Response) => {
  try {
    const getThem = await userModel.find();
    const data = req.data;

    console.log(data);

    if (data.status === "admin") {
      return res.status(HTTP.OK).json({
        message: "found...!🚀",
        data: getThem,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "you dont have access to this..!🪶",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error trying to get",
    });
  }
};

export const getAll = async (req: any, res: Response) => {
  try {
    const findAll = await userModel.find();
    return res.status(HTTP.OK).json({
      message: "All has been gotten",
      data: findAll,
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error getting All",
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

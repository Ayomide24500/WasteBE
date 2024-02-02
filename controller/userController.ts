import {Request, Response } from "express";
import userModel from "../model/userModel";
import crypto from 'crypto';
import { HTTP } from "../utils/enums";
import bcrypt from 'bcrypt';

export const createUser = async(req:Request, res:Response):Promise<Response> =>{
  try {
    const {email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");

    const user = await userModel.create({
      email,
      password:hashedPassword,
      token,
      status: "user"
    });
    return res.status(HTTP.CREATED).json({
      message: 'user created successfully',
      data: user,
      status: HTTP.CREATED
    });
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: 'error creating user',
      status: HTTP.BAD
    });
  }
};
import express, { Application, NextFunction, Request, Response } from "express";
import auth from "./router/userRouter";
import { mainError } from "./error/mainError";
import { HTTP } from "./utils/enums";
import { handleError } from "./error/handleError";
import passport from "passport";
import Google from "passport-google-oauth20";
import userModel from "./model/userModel";

const GoogleStrategy = Google.Strategy;
export const mainApp = (app: Application) => {
  app.use("/api/user", auth);
  try {
    app.get("/", (req: Request, res: Response) => {
      try {
        res.status(200).json({
          message: "Welcome to Awesome Api",
        });
      } catch (error) {
        res.status(404).json({
          message: "Error",
        });
      }
    });

    passport.use(
      new GoogleStrategy(
        {
          clientID:
            "338600539682-itev760d42s40r3h9uk69o4n7ks51ch3.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: "/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile: any, cb) {
          console.log(profile);

          const user = await userModel.create({
            email: profile?.email[0]?.value,
            password: "",
            verify: profile?.email[0]?.verified,
            token: "",
            status: "admin",
            AdminCode: Math.floor(Math.random() * 112233).toString(),
          });
          return cb(null, user);
        }
      )
    );

    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      function (req: any, res) {
        //successful authentication, redirect home.
        req.user;
        res.redirect("/");
      }
    );
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new mainError({
          name: "Route Error",
          message: `this endpoint you entered ${req.originalUrl} doesn't exit`,
          status: HTTP.BAD,
          success: false,
        })
      );
    });
    app.use(handleError);
  } catch (error) {
    return error;
  }
};

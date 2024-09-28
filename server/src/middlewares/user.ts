import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        console.log("token", token)
        if(!token) return next();

        const {username}: any = Jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOneBy({username});

        // 유저 정보가 없다면 throw error!
        if(!user) throw new Error("Unauthenticated!");
        console.log("user", user)
        // 유저 정보를 res.locals.user에 넣어주기
        res.locals.user = user;

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Something went wrong"})
    }
}
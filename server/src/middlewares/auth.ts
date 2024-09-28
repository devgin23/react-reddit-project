import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User | undefined = res.locals.user;
        if(!user) throw new Error("Unathenticated");
        console.log("user", user);
        return next();

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Unauthenticated!"});
        
    }
}
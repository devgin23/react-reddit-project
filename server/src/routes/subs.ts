import { Request, Response, Router } from "express";
import Jwt from "jsonwebtoken";
import { User } from "../entities/User";
import userMiddleware from "../middlewares/user" 
import authMiddleware from "../middlewares/auth" 
import { isEmpty } from "class-validator";
import { DataSource, getRepository } from "typeorm";
import Sub from "../entities/Sub";
import { AppDataSource } from "../data-source";

const createSub = async (req: Request, res: Response, next) => {
    const {name, title, description} = req.body;

    // 유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크
    try {
        let errors: any = {};

        if(isEmpty(name)) errors.name = "이름은 비워둘 수 없습니다."
        if(isEmpty(title)) errors.title = "제목은 비워둘 수 없습니다."

        
        const sub = await AppDataSource.getRepository(Sub)
            .createQueryBuilder("sub")
            .where("lower(sub.name) = :name", {name : name.toLowerCase() })
            .getOne();
        if (sub) errors.name = "서브가 이미 존재합니다"

        if (Object.keys(errors).length > 0) {
            throw errors;
        }
    } catch (error) {
        return res.status(500).json({error : "문제가 발생했습니다."});

    }

    try {
        // Sub Instance 생성 후 데이터베이스 저장
        const user: User = res.locals.user;

        const sub = new Sub();

        sub.name = name;
        sub.description = description;
        sub.title = title;
        sub.user = user;

        await sub.save();
        // 저장한 정보 프론트엔드로 전달해주기
        return res.json(sub);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "문제가 발생했습니다."});
    }


}

const router = Router();

router.post("/", userMiddleware, authMiddleware ,createSub);

export default router;
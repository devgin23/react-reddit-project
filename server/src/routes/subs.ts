import { Request, Response, Router } from "express";
import Jwt from "jsonwebtoken";
import { User } from "../entities/User";
import userMiddleware from "../middlewares/user" 
import authMiddleware from "../middlewares/auth" 
import { isEmpty } from "class-validator";
import { DataSource, getRepository } from "typeorm";
import Sub from "../entities/Sub";
import { AppDataSource } from "../data-source";
import Post from "../entities/Post";

const getSub = async (req: Request, res: Response) => {
    const name = req.params.name;

    try {
        const sub = await Sub.findOneByOrFail({ name });
        // 포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기.

        return res.json(sub);
    } catch (error) {
        return res.json(404).json({ error: "서브를 찾을 수 없음"});
    }
}

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
const topSubs = async (_:Request, res: Response) => {
    try {
        const imageUrlExp = `COALESCE(s."imageUrn", 'https://www.gravatar.com/avatar?d=mp&f=y')`;
        const subs = await AppDataSource.createQueryBuilder()
            .select(`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
            .from(Sub, "s")
            .leftJoin(Post, "p", `s.name = p."subName"`)
            .groupBy('s.title, s.name, "imageUrl"')
            .orderBy(`"postCount"`, "DESC")
            .limit(5)
            .execute();
            return res.json(subs);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}
const router = Router();

router.get(":name", userMiddleware, getSub);
router.post("/", userMiddleware, authMiddleware ,createSub);
router.get("/sub/topSubs", topSubs);

export default router;
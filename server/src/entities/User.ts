import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BeforeInsert } from "typeorm"
import BaseEntityClass from "./BaseEntityClass"
import { IsEmail, Length } from "class-validator";
import { Exclude } from "class-transformer";
import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export class User extends BaseEntityClass {

    @Index()
    @IsEmail(undefined, {message: "이메일 주소가 잘못되었습니다."})
    @Length(1, 255, {message: "이메일 주소가 잘못되었습니다."})
    @Column({unique: true})
    email: string;

    @Index()
    @Length(3, 32, { message: "사용자 이름은 3자 이상이어야 합니다."})
    @Column({ unique: true})
    username: string;

    @Exclude()
    @Column()
    @Length(6,255, { message: "비밀번호는 6자리 이상이어야 합니다."})
    password: string;
    
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
        
    }
}

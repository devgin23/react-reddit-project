import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntityClass from "./BaseEntityClass";
import { User } from "./User";
import Post from "./Post";
import Comment from "./Comment";


@Entity("votes")
export default class Vote extends BaseEntityClass {
    @Column()
    value: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username"})
    user: User

    @Column()
    username: string;
    
    @Column({ nullable: true })
    postId: number;

    @ManyToOne(()=> Post)
    post: Post;

    @Column({ nullable: true})
    commentId: number;

    @ManyToOne(() => Comment)
    @JoinColumn({ name: "votes"})
    comment: Comment;
}
import { useAuthState } from '@/context/auth';
import { Comment, Post } from '@/type';
import axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import useSWR from 'swr';

const PostPage = () => {
    const router = useRouter();
    const { identifier, sub, slug } = router.query;
    const { authenticated, user } = useAuthState();
    const [newComment, setNewComment] = useState("");

    const { data: post, error, mutate: postMutate } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null)
    const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )
    console.log('post', post)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === "") {
            return;
        }
        try {
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            await commentMutate();
            setNewComment("");
        } catch (error) {
            console.log(error)
        }
    }
    console.log('comments', comments)

    const vote = async (value: number, comment?: Comment) => {
        if (!authenticated) router.push("/login");

        // 이미 클릭한 vote 버튼을 눌렀을 시에는 reset
        if (
            (!comment && value === post?.userVote) ||
            (comment && comment.userVote === value)
        ) {
            value = 0;
        }

        try {
            console.log('info: ',{
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value
            })
            await axios.post("/votes", {
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value
            })
            await postMutate();
            await commentMutate();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
            <div className='w-full md:mr-3 md:w-8/12'>
                <div className='bg-white rounded'>
                    {post && (
                        <>
                            <div className='flex'>
                                {/* 좋아요 싫어요 기능 부분 */}
                                <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
                                    {/* 좋아요 */}
                                    <div className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                                        onClick={() => vote(1)}
                                    >
                                        {/* <i
                                            className={classNames("fas fa-arrow-up", {
                                                "text-red-500": post.userVote === 1
                                            })}
                                        >

                                        </i> */}
                                        {post.userVote === 1 ?
                                            <FaArrowUp className='mx-auto text-red-500 center' />
                                            : <FaArrowUp />
                                        }
                                    </div>
                                    <p className='text-xs font-bold'>{post.voteScore}</p>
                                    {/* 싫어요 */}
                                    <div className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
                                        onClick={() => vote(-1)}
                                    >
                                        {/* <i
                                            className={classNames("fas fa-arrow-down", {
                                                "text-blue-500": post.userVote === -1
                                            })}
                                        >
                                        </i> */}
                                        {post.userVote === -1 ?
                                            <FaArrowDown className='mx-auto text-blue-500 center' />
                                            : <FaArrowDown />
                                        }
                                    </div>

                                </div>
                                <div className='py-2 pr-2'>
                                    <div className='flex items-center'>
                                        <p className='text-xs text-gray-400'>
                                            Posted by
                                            <Link href={`/u/${post.username}`} className='mx-1 hover:underline'>
                                                /u/{post.username}
                                            </Link>
                                            <Link href={post.url} className='mx-1 hover:underline'>
                                                {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}

                                            </Link>
                                        </p>
                                    </div>
                                    <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                                    <p className='my-3 text-sm'>{post.body}</p>
                                    <div className='flex'>
                                        <button>
                                            <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                                            <span className='font-bold'>
                                                {post.commentCount} Comments
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* 댓글 작성 구간 */}
                                <div className='pr-6 mb-4'>
                                    {authenticated ?
                                        (
                                            <div>
                                                <p className='mb-1 text-xs'>
                                                    <Link href={`/u/${user?.username}`} className='font-semibold text-blue-500'>
                                                        {user?.username}
                                                    </Link>
                                                    {" "}으로 댓글 작성
                                                </p>
                                                <form onSubmit={handleSubmit}>
                                                    <textarea
                                                        className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600'
                                                        onChange={e => setNewComment(e.target.value)}
                                                        value={newComment}
                                                    >

                                                    </textarea>
                                                    <div className='flex justify-end'>
                                                        <button
                                                            className='px-3 py-1 text-white bg-gray-400 rounded'
                                                            disabled={newComment.trim() === ""}
                                                        >
                                                            댓글 작성
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>

                                        ) :
                                        (
                                            <div className='flex items-center justify-between px-2 py-4 border border-gray-200 rounded' >
                                                <p className='font-semibold text-gray-400'>
                                                    댓글 작성을 위해서 로그인 해주세요.
                                                </p>
                                                <div>
                                                    <Link href={`/login`} className='px-3 py-1 text-white bg-gray-400 rounded'>
                                                        로그인
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            {/* 댓글 리스트 부분 */}
                            {comments?.map(comment => (
                                <div className='flex' key={comment.identifier}>
                                    {/* 좋아요 싫어요 기능 부분 */}
                                    <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
                                        {/* 좋아요 */}
                                        <div className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                                            onClick={() => vote(1, comment)}
                                        >
                                            {/* <i
                                                className={classNames("fas fa-arrow-up", {
                                                    "text-red-500": comment.userVote === 1
                                                })}
                                            >
                                            </i> */}
                                            {comment.userVote === 1 ?
                                                <FaArrowUp className='mx-auto text-red-500 center' />
                                                : <FaArrowUp />
                                            }
                                        </div>
                                        <p className='text-xs font-bold'>{comment.voteScore}</p>
                                        {/* 싫어요 */}
                                        <div className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
                                            onClick={() => vote(-1, comment)}
                                        >
                                            {/* <i
                                                className={classNames("fas fa-arrow-down", {
                                                    "text-blue-500": comment.userVote === -1
                                                })}
                                            >
                                            </i> */}
                                            {comment.userVote === -1 ?
                                                <FaArrowDown className='mx-auto text-blue-500 center' />
                                                : <FaArrowDown />
                                            }
                                        </div>

                                    </div>
                                    <div className='py-2 pr-2'>
                                        <p className='mb-1 text-xs leading-none'>
                                            <Link
                                                href={`/u/${comment.username}`}
                                                className='mr-1 font-bold hover:underline'>
                                                {comment.username}
                                            </Link>
                                            <span className='text-gray-500'>
                                                {`
                                                    ${comment.voteScore}
                                                    posts
                                                    ${dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                                                `}
                                            </span>
                                        </p>
                                        <p>{comment.body}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )

                    }
                </div>
            </div>
        </div>
    )
}

export default PostPage
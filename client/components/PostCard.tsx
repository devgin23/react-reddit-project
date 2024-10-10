import { useAuthState } from '@/context/auth'
import { Post } from '@/type'
import axios from 'axios'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

interface PostCardProps {
    post: Post
    subMutate: () => void
}



const PostCard = ({
    post: {
        identifier, 
        slug, 
        title, 
        body, 
        subName, 
        createdAt, 
        voteScore, 
        userVote, 
        commentCount, 
        url, 
        username, 
        sub
    },
    subMutate
}: PostCardProps) => {
    const router = useRouter();
    const { authenticated } = useAuthState();
    const isInSubPage = router.pathname === '/r/[sub]'
    console.log('router.pathname', router.pathname)

    const vote = async (value: number) => {
        if (!authenticated) router.push("/login");
        // 이미 클릭한 vote 버튼을 눌렀을 시에는 reset
        if (userVote === value) {
            value = 0;
        }
        console.log('info: ', {
            identifier, slug, value
        })

        try {
            await axios.post("/votes", {
                identifier,
                slug,
                value
            })
            subMutate();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex mb-4 bg-white rounded'
            id={identifier}
        >
            {/* 좋아요 싫어요 기능 부분 */}
            <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
                {/* 좋아요 */}
                <div className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                    onClick={() => vote(1)}
                >
                    {userVote === 1 ?
                        <FaArrowUp className='mx-auto text-red-500 center' />
                        : <FaArrowUp />
                    }
                </div>
                <p className='text-xs font-bold'>{voteScore}</p>
                {/* 싫어요 */}
                <div className='flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
                    onClick={() => vote(-1)}
                >
                    {userVote === -1 ?
                        <FaArrowDown className='mx-auto text-blue-500 center' />
                        : <FaArrowDown />
                    }
                </div>
            </div>
            {/* 포스트 데이터 부분 */}
            <div className='w-full p-2'>
                {!isInSubPage && (
                    <div className='flex items-center'>
                        <Link href={`/r/${subName}`}>
                            {sub &&
                                <Image
                                    src={sub?.imageUrl}
                                    alt="sub"
                                    className="rounded-full cursor-pointer"
                                    width={12}
                                    height={12}
                                />
                            }
                        </Link>
                        <Link href={`/r/${subName}`} className='ml-2 text-xs font-bold cursor-pointer hover:underline'>
                            /r/{subName}
                        </Link>
                        <span className='mx-1 text-xs text-gray-400'></span>
                    </div>
                )}

                <p className='text-xs text-gray-400'>
                    Posted by
                    <Link href={`/r/${username}`} className='mx-1 hover:underline'>
                        /u/{username}
                    </Link>
                    <Link href={url} className='mx-1 hover:underline'>
                        {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                    </Link>
                </p>
                <Link href={url} className='my-1 text-lg font-medium'>
                    {title}
                </Link>
                {body && <p className='my-1 text-sm'>{body}</p>}
                <div className='flex'>
                    <Link href={url}>
                        <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                        <span>{commentCount}</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PostCard
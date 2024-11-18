import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Loading from "./Loading";
import { supabase } from "../supabase";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import Post from "./Post";
import { useSearchParams } from "react-router-dom";
import PostSelectionBox from "./PostSelectionBox";
import { Countries } from "../countries";
import { Categories } from "../categories";


const PostsState = observable({
    isLoading: true,
    isLoadFirstTime: true,
    isDeadEnd: false,
    posts: [],
    lastPostDateTime: new Date().toISOString(),
    watchingCategory: "all",
    watchingCountry: "all",
    setWatchingCountry: (c) => PostsState.watchingCountry = c,
    setWatchingCategory: (c) => PostsState.watchingCategory = c,
    setLoading: () => PostsState.isLoading = true,
    setLoadingDone: () => PostsState.isLoading = false,
    setDeadEnd: () => PostsState.isDeadEnd = true,
    removeDeadEnd: () => PostsState.isDeadEnd = false,
    setLoadFirstTimeDone: () => PostsState.isLoadFirstTime = false,
    setLastPostDateTime: (t) => PostsState.lastPostDateTime = t,
    updatePosts: (posts) => {
        const referenceIds = PostsState.posts.map(post => post.reference_id);
        let filteredPosts = posts.filter(post => !referenceIds.includes(post.reference_id))
        const donePosts = [...filteredPosts, ...PostsState.posts];
        if(donePosts != PostsState.posts){
            PostsState.posts = donePosts
        }
        if(filteredPosts.length > 0){
            PostsState.setLastPostDateTime(filteredPosts[filteredPosts.length-1].created_date)
        }
    },
    updatePostsEnd: (posts) => {
        const referenceIds = PostsState.posts.map(post => post.reference_id);
        let filteredPosts = posts.filter(post => !referenceIds.includes(post.reference_id))
        const donePosts = [...PostsState.posts, ...filteredPosts];
        if(donePosts != PostsState.posts){
            PostsState.posts = donePosts
        }
        if(filteredPosts.length > 0){
            PostsState.setLastPostDateTime(filteredPosts[filteredPosts.length-1].created_date)
        }
    },
    clearPosts: () => PostsState.posts = []
})

const Posts = observer(({ addNote }) => {
    const [searchParams, setSearchParams] = useSearchParams(window.location)

    const fetchPosts = async (callback) => {
        if(PostsState.isDeadEnd === true){
            if(callback){callback()}
            return;
        }
        const { data, error } = await supabase.rpc("get_posts", {
            "from_date": PostsState.lastPostDateTime,
            "country_specific": PostsState.watchingCountry,
            "category_specific": PostsState.watchingCategory,
        })
        if (error) {
            addNote("Could not retreive posts, tryagain later!", "error")
        } else {
            if(data.length === 0){
                PostsState.setDeadEnd()
            } else {
                if(PostsState.isLoadFirstTime === true){
                    PostsState.updatePosts(data)
                } else {
                    PostsState.updatePostsEnd(data)
                }
            }
        }
        if (!(!callback)) {
            callback()
        }
    }

    const onScrollEvent = () => {
        if( PostsState.isDeadEnd === true){return}
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if ((scrollTop + clientHeight) >= scrollHeight) {
            if (PostsState.isLoading === false) {
                PostsState.setLoading()
                fetchPosts(()=>{
                    PostsState.setLoadingDone()
                })
            }
        }
    }

    useEffect(()=>{
        if(PostsState.isLoading === false){
            PostsState.clearPosts();
            PostsState.removeDeadEnd();
            PostsState.setLastPostDateTime(new Date().toISOString())
            
            PostsState.setLoading()
            fetchPosts(() => {
                PostsState.setLoadingDone()
            })
        }
    },[searchParams])

    useEffect(()=>{
        if(searchParams.get("country") !== PostsState.watchingCountry || searchParams.get("category") !== PostsState.watchingCategory){
            setSearchParams({
                'country': PostsState.watchingCountry.toLowerCase(),
                'category': PostsState.watchingCategory.toLowerCase(),
            });
        }
    }, [PostsState.watchingCategory, PostsState.watchingCountry])

    useEffect(()=>{
        window.localStorage.setItem("countryWatching", PostsState.watchingCountry)
    }, [PostsState.watchingCountry])

    useEffect(()=>{
        window.localStorage.setItem("categoryWatching", PostsState.watchingCategory)
    }, [PostsState.watchingCategory])

    useEffect(() => {
        document.title = "All posts - F4nsix"

        if(PostsState.isLoadFirstTime === true){
            PostsState.setLoading()
            fetchPosts(() => {
                PostsState.setLoadFirstTimeDone()
                PostsState.setLoadingDone()
                window.addEventListener('scroll', onScrollEvent);
            })
        }
        return (() => window.removeEventListener("scroll", onScrollEvent))
    }, [])

    return (
        <div className={`flex flex-col items-center min-h-screen ${PostsState.posts.length > 0 ? 'bg-neutral-300 dark:bg-transparent' : ''}`}>
            <div className="w-full bg-white dark:bg-zinc-800">
                <PostSelectionBox objectWithCodeAndName={Countries} activeItem={PostsState.watchingCountry} onClickFunction={PostsState.setWatchingCountry} />
                <PostSelectionBox objectWithCodeAndName={Categories} activeItem={PostsState.watchingCategory} onClickFunction={PostsState.setWatchingCategory} />
            </div>
            {
                PostsState.isLoadFirstTime === false ?
                    PostsState.isError === true ?
                        <div className="flex items-center justify-center flex-col min-h-screen">
                            <BsFillExclamationCircleFill className="block w-12 h-12 mx-auto my-5" />
                            <p className="text-center">Could not retrieve the posts, check the network connection and tryagain after some time!</p>
                        </div>
                        :
                        PostsState.posts.length > 0 ?
                            <div className="flex flex-col w-full max-w-xl max-md:pb-20">
                                {PostsState.posts.map(post => {
                                    return <Post {...post} key={post.reference_id} />
                                })}
                            </div>
                            :
                            PostsState.isLoading === true ?
                            []
                            :
                            <div className="my-5 text-lg font-mono p-10">
                                <BsFillExclamationCircleFill className="block w-12 h-12 mx-auto my-5" />
                                <p className="text-center">Sorry, no posts found published by any user, tryagain soon!</p>
                            </div>
                    :
                    []
            }
            {
                PostsState.isLoading === true ?
                <Loading text={"Getting posts..."} /> : []
            }
        </div>
    )
})

export default Posts;

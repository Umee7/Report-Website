import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";
import SpecificPostComment from "./SpecificPostComment";
import { observer, useLocalObservable } from "mobx-react";

const SpecificPostComments = observer(({referenceId, frozenComments, addNote, commentsCount}) => {
    const state = useLocalObservable(()=>({
        isLoading: false,
        setLoading: value => state.isLoading = value,
        commentsData: [],
        setCommentsData: value => state.commentsData = value,
        lastCommentPostDate: new Date().toISOString(),
        setLastCommentPostDate: value => state.lastCommentPostDate = value,
        allCommentsFetched: false,
        setAllCommentsFetched: () => state.allCommentsFetched = true,
        isReachedEnd: false,
        setReachedEnd: () => state.isReachedEnd = true
    }))

    const commentsReference = useRef()

    const fetchComments = async() => {
        if(state.isReachedEnd === true){return}
        state.setLoading(true)
        const {data, error} = await supabase.rpc("get_comments",{
            "referenceid": referenceId,
            "from_date": state.lastCommentPostDate
        })
        if(error){
            addNote("Could not retrieve comments, tryagain soon!", 'error')
        } else {
            state.setCommentsData([...state.commentsData, ...data, ])
            if(data.length > 0){
                state.setLastCommentPostDate(data[data.length-1].created_date)
            } else {
                state.setReachedEnd()
            }
        }
        state.setLoading(false);
    }

    const onScrollEvent = () => {
        if( state.isLoading === true){return}
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if ((scrollTop + clientHeight) >= scrollHeight) {
            fetchComments()
        }
    }

    useEffect(()=>{
        if(commentsCount > 0){
            fetchComments()
        }
        window.addEventListener("scroll", onScrollEvent)
        return ()=>window.removeEventListener("scroll", onScrollEvent)
    },[])

    return(
        <div ref={commentsReference}>
            {frozenComments.map(comment => <SpecificPostComment {...comment} key={comment.created_date} />)}
            {state.commentsData.map(comment => <SpecificPostComment {...comment} key={comment.created_date} />)}
        </div>
    )
})

export default SpecificPostComments;
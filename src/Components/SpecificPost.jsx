import { observable } from "mobx";
import { observer } from "mobx-react";
import Loading from "./Loading";
import { useEffect } from "react";
import { supabase } from "../supabase";
import { useParams } from "react-router-dom";
import SpecificPostCommentsFull from "./SpecificPostCommentsFull";
import Post from "./Post";


const SpecificPostState = observable({
    isLoaded: false,
    found: false,
    postData: {},

    setLoaded: ()=>SpecificPostState.isLoaded = true,
    setFound: ()=>SpecificPostState.found = true,
    setPostData: (postData)=>SpecificPostState.postData = postData,
    setCommentCount: count => {
        const postDataModified = {...SpecificPostState.postData}
        postDataModified.comments_count = postDataModified.comments_count+count
        SpecificPostState.setPostData(postDataModified)
    },
    resetData: () => {
        SpecificPostState.isLoaded = false
        SpecificPostState.found = false
        SpecificPostState.postData = {}
    }
})

const SpecificPost = observer(({addNote}) => {
    const params = useParams()

    const fetchPost = async() => {
        const {data, error} = await supabase.rpc("get_post", {
            reference_id_param: params.referenceId
        })
        if(error){
            addNote("Could not retrieve the post, refresh the page and tryagain!", "error")
        } else {
            SpecificPostState.setLoaded()
            if(data.length > 0){
                SpecificPostState.setPostData(data[0])
                SpecificPostState.setFound()
                document.title = SpecificPostState.postData.title
            } else {
                document.title = 'Post not found!'
            }
        }
    }

    useEffect(()=>{
        SpecificPostState.resetData()
        fetchPost()
    }, [])

    return(
        SpecificPostState.isLoaded === true ?
        SpecificPostState.found === true ?
        <div className="pb-16">
            <Post {...SpecificPostState.postData} isSpecificPost={true} />
            <SpecificPostCommentsFull {...SpecificPostState.postData} addNote={addNote} updateCommentCount={SpecificPostState.setCommentCount} />
        </div>
        :
        <div className="text-center">
            <h2 className="text-2xl my-5">Not Found</h2>
            <p>Post does not exists, if you've entered the URL manually then check and tryagain!</p>
        </div>
        :
        <div className="my-5 flex items-center justify-center">
            <Loading text={"Loading post"} />
        </div>
    )
})

export default SpecificPost;
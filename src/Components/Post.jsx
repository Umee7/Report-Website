import Carousel from "./Carousel";
import PostHeader from "./PostHeader";
import SpecificPostHeader from "./SpecificPostHeader";
import PostFooter from "./PostFooter";
import SpecificPostFooter from "./SpecificPostFooter";


const Post = (props) => {
    return (
        <div className="bg-white dark:bg-zinc-200/10 dark:text-white flex flex-col w-full my-3 first:mt-5 last:mb-2 shadow dark:border-y-0 rounded max-md:rounded-none dark:border-neutral-200">
            {
                props.isSpecificPost === true ?
                <SpecificPostHeader {...props} />
                :
                <PostHeader {...props} />
            }
            {
                props.files.length > 0 ?
                    <div className="border-y-2 border-zinc-400">
                        <Carousel
                            posts={[...props.files].map(file => {
                                return {
                                    postURL: file.url,
                                    postType: file.type
                                }
                            })}
                        />
                    </div>
                    :
                    []
            }
            {
                props.isSpecificPost === true ?
                <SpecificPostFooter {...props} />
                :
                <PostFooter {...props} />
            }
        </div>
    )
}

export default Post;
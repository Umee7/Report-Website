import { Link } from "react-router-dom";
import { dateMapper } from "../functions";

const PostHeader = (props) => {
    return (
        <Link to={`/p/${props.reference_id}`}>
            <div className="p-2 px-4 rounded-t">
                <span className="block text-2xl my-1 font-hand">{props.title}</span>
                <span className="flex items-center">
                    {
                        props.username ?
                            <>
                                <span>{props.username}</span>
                                <span className="mx-2 text-black/70 dark:text-white/60">&#x2022;</span>
                            </>
                            :
                            []
                    }
                    <span className="block text-sm my-1">{dateMapper(new Date(props.created_date).getTime())}</span>
                </span>
            </div>
        </Link>
    )
}

export default PostHeader;
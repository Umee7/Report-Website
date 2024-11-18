import { getCountryByCode } from "../countries";
import { getCategoryByCode } from "../categories";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formatNumber } from "../functions";


const PostFooter = (props) => {
    const escapeOutput = (toOutput) => {
        return toOutput.replace(/\&/g, '&amp;')
            .replace(/\</g, '&lt;')
            .replace(/\>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/\'/g, '&#x27;')
    }

    const POST_CONTENT =  (escapeOutput(props.content) || "").replace(/(https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/ig, (k)=>{
        return `<a style="text-decoration: underline;" target="_blank" href="${k}">${k}</a>`
    })

    return (
        <>
            <Link to={`/p/${props.reference_id}`}>
            <div className="px-4 py-1 mb-2 text-lg whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: POST_CONTENT.substring(0,128)+(POST_CONTENT.length > 128 ? "..." : "" ) }}>
            </div>
            </Link>
            <div className="mx-2 flex">
                <span className="block bg-zinc-300/50 dark:bg-zinc-800 dark:text-white py-1 p-2 rounded text-xs m-1">
                    {getCountryByCode(props.country).name}
                </span>
                <span className="block bg-zinc-300/50 dark:bg-zinc-800 dark:text-white py-1 p-2 rounded text-xs m-1">
                    {getCategoryByCode(props.category).name}
                </span>
            </div>
            <div className="mt-3 flex items-center justify-around border-t px-2 py-3">
                <Link to={`/p/${props.reference_id}`} className="flex items-center">
                    <BiMessageRounded className="w-5 h-5 mr-0.5" />
                    <span>{formatNumber(props.comments_count)}</span>
                </Link>
                <button type="button" className="max-md:cursor-default" onClick={()=>{
                    const url = `/p/${props.reference_id}`
                    navigator.share({
                        url: url,
                        title: `Share post \'${props.title}\'`
                    })
                }}>
                    <AiOutlineShareAlt className="w-6 h-6" />
                </button>
            </div>
        </>
    )
}

export default PostFooter;

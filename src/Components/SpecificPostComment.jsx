import { dateMapper } from "../functions";

const SpecificPostComment = ({data, created_date}) => {
    return (
        <div className="flex flex-row bg-white shadow dark:bg-zinc-800 p-5 p-3 my-5 first:mt-10 border-y border-zinc-700 dark:border-white">
            <div className="font-mono text-lg whitespace-pre-wrap">{data}</div>
            <span className="mx-2 text-xs">{dateMapper(new Date(created_date).getTime())}</span>
        </div>
    )
}

export default SpecificPostComment;
import { observer, useLocalObservable } from "mobx-react";
import { formatNumber } from "../functions";
import SpecificPostCommentBox from "./SpecificPostCommentBox";
import SpecificPostComments from "./SpecificPostComments";

const SpecificPostCommentFull = observer(((props) => {
    const state = useLocalObservable(()=>({
        frozenComments: [],
        addFrozenComment: (comment) => state.frozenComments = [comment, ...state.frozenComments]
    }))

    return (
    <div>
        <h2 className="p-2 text-xl">Comments<span className="text-sm mx-1">({formatNumber(props.comments_count)})</span></h2>
        <SpecificPostCommentBox referenceid={props.reference_id} addNote={props.addNote} addComment={(comment)=>{
            state.addFrozenComment(comment)
            props.updateCommentCount(1)
        }
        } />
        <SpecificPostComments referenceId={props.reference_id} commentsCount={props.comments_count} addNote={props.addNote} frozenComments={state.frozenComments} />
    </div>
    )
}))

export default SpecificPostCommentFull;

import { useState } from "react";
import Note from "./Note";
import { observer } from "mobx-react";

const Notes = observer(({notes, removeNote}) => {
    return(
        <div className="flex flex-col justify-center items-center top-0 right-0 fixed w-96 px-2 max-md:w-full">
            {notes.map(note => {
                return <Note {...note} key={note.id} removeFunction={e => {
                    e.preventDefault();
                    removeNote(note.id)
                }} />
            })}
        </div>
    )
})

export default Notes;
import { useEffect, useState } from "react";

const InputBox = ({mainElementMargin, labelName, inputType, minLength, maxLength, required, stateVariable, updateData, onChange, multiLine=false, fontFamily="font-regular", ...inputProps}) => {
    const [id, setId] = useState(Math.round(Math.random()*999999999))

    return(
        <div className={`flex flex-col text-black dark:text-white ${mainElementMargin ? mainElementMargin : 'my-10'}`}>
            <label htmlFor={id} className="text-black border border-b-0 p-3 dark:border-white border-neutral-700 dark:text-white">{labelName}</label>
            {
                multiLine === true ?
                <textarea
                    title={`Input text length must be between ${minLength} and ${maxLength}`}
                    // required={required}
                    value={stateVariable}
                    onChange={e => {
                        if(onChange){
                            onChange(e)
                        } else {
                            if(e.target.value.length <= maxLength){
                                updateData(e.target.value)
                            }
                        }
                    }}
                    className={`${fontFamily} px-2 py-3 border border-neutral-700 w-full bg-white text-black dark:bg-neutral-800/50 dark:text-white dark:border-white focus:dark:border-cyan-300 focus:border-neutral-700 focus:outline-none`}
                    rows={5}
                    placeholder={labelName}
                    id={id}
                    {...inputProps}
                ></textarea>
                :
                <input
                    title={`Input text length must be between ${minLength} and ${maxLength}`}
                    type={inputType}
                    // required={required}
                    value={stateVariable}
                    onChange={e => {
                        if(onChange){
                            onChange(e)
                        } else {
                            if(e.target.value.length <= maxLength){
                                updateData(e.target.value)
                            }
                        }
                    }}
                    className={`${fontFamily} px-2 py-3 border border-neutral-700 text-lg w-full bg-white text-black dark:bg-neutral-800/50 dark:text-white dark:border-white focus:dark:border-cyan-300 focus:border-neutral-700 focus:outline-none`}
                    placeholder={labelName}
                    id={id}
                    {...inputProps}
                />
            }
            {
                maxLength?
                <small className="block font-mono self-end">{stateVariable.length}/{maxLength}</small>
                :
                []
            }
        </div>
    )
}

export default InputBox;
const Question = ({question, answer}) => {
    return(
        <details className="my-5 border border-black dark:border-white p-5">
            <summary className="text-2xl my-3 font-hand">{question}</summary>
            {answer.map((an)=>{
                return <p className="font-mono text-lg p-2" key={answer.indexOf(an)}>{an}</p>
            })}
        </details>
    )
}

export default Question;
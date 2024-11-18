const SpecificPostHeader = (props) => {
    return (
        <div className="p-2 px-4 rounded-t">
            <h2 className="block text-3xl my-1 font-hand">{props.title}</h2>
            <span className="flex items-center">
                {
                    props.username ?
                        <>
                            <span>{props.username}</span>
                            <span className="mx-2 text-black/50 dark:text-white/60">&#x2022;</span>
                        </>
                        :
                        []
                }
                <span className="block text-sm my-1">{new Date(props.created_date).toLocaleString()}</span>
            </span>
        </div>
    )
}

export default SpecificPostHeader;
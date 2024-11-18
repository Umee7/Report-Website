const Button = ({text, ...props}) => {
    return (
    <button
        type="submit"
        className="bg-neutral-700 w-full text-white dark:bg-cyan-300 dark:text-black text-lg font-hand p-2 rounded flex items-center justify-center"
        {...props}
    >{text}</button>
    )
}

export default Button;
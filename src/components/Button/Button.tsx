import cn from 'classnames'

export interface ButtonProps {
    text: string;
    className?: string
    onClick?: () => void
}

const Button = ({ text, className, onClick }: ButtonProps) => {
    return (
        <button className={cn("text-white bg-purple-600 rounded-sm p-3 cursor-pointer hover:bg-white hover:text-purple-600 transition-colors", className)} onClick={onClick}>{text}</button>
    )
}

export default Button
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useClickAway } from "@uidotdev/usehooks";

export interface DialogProps {
    children: React.ReactNode;
    onClose?: () => void;
    title?: string;
    disableClickAway?: boolean;
}

const Dialog = ({ children, title, disableClickAway = false, onClose }: DialogProps) => {
    const ref = useClickAway<HTMLDialogElement>(() => {
        if (!disableClickAway && onClose) {
            onClose()
        }
    });

    return (
        <div className="flex items-center justify-center w-screen h-screen absolute z-10">
            <dialog ref={ref} open className="bg-white m-auto z-10 p-2 rounded w-[75%] animate-fade-in">
                {onClose && (
                    <XMarkIcon className="size-6 absolute cursor-pointer top-2 right-2" onClick={() => onClose()} />
                )}
                {title && (
                    <header className="text-2xl py-2">{title}</header>
                )}
                <section className="my-4">
                    {children}
                </section>
            </dialog>
            <div className="bg-black opacity-60 w-screen h-screen">
            </div>
        </div>
    )
}

export default Dialog
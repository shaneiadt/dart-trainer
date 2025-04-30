import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { calculateCheckout, resetPath, setMaxCheckoutValue, setMinCheckoutValue, showPath, startGame } from "../../features/checkoutTrainer/checkoutTrainerSlice";
import { getCheckoutValue, getIsCheckedOut, getIsCheckoutTrainerGameInProgress, getIsLastDartDouble, getMaxCheckoutValue, getMinCheckoutValue, getShowPath, getUserCheckoutPath, getUserCheckoutValue } from "../../features/checkoutTrainer/selectors";
import { isEqual } from "lodash";
import cn from "classnames";
import { CHECKOUTS, CheckoutsType } from "../../constants/checkouts";
import Button from "../Button/Button";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Dialog from "../Dialog/Dialog";

const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

type MessageType = 'success' | 'error'

const Header = () => {
    const [message, setMessage] = useState<{ text: string; type: MessageType } | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const dispatch = useAppDispatch()
    const checkout = useAppSelector(getCheckoutValue)
    const minCheckoutValue = useAppSelector(getMinCheckoutValue)
    const maxCheckoutValue = useAppSelector(getMaxCheckoutValue)
    const showCheckoutPath = useAppSelector(getShowPath)
    const userCheckoutValue = useAppSelector(getUserCheckoutValue)
    const userCheckoutPath = useAppSelector(getUserCheckoutPath)
    const isGameInProgress = useAppSelector(getIsCheckoutTrainerGameInProgress)

    const isLastDartDouble = useAppSelector(getIsLastDartDouble)

    const checkedOut = useAppSelector(getIsCheckedOut);

    useEffect(() => {
        if (checkedOut) {
            console.log('CHECKED OUT');
        }
    }, [checkedOut, checkout, isLastDartDouble, userCheckoutPath, userCheckoutValue])

    const onMinRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMinCheckoutValue(Number(e.target.value)))
    }

    const onMaxRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMaxCheckoutValue(Number(e.target.value)))
    }

    const isUserPathValidCheckout = useMemo(() => {
        const outs = CHECKOUTS[checkout]

        if (outs?.length) {
            for (const out of outs) {
                if (out.join('') === userCheckoutPath.join('')) {
                    return true
                }
            }
        }

        return false
    }, [checkout, userCheckoutPath]);

    const checkoutPaths = useMemo(() => {
        const outs = CHECKOUTS[checkout]
        const paths: ReactElement[] = []

        let i = 0;

        if (outs?.length) {
            for (const out of outs) {
                const pathItems: ReactElement[] = []

                for (const key of out) {
                    const itemKey = `${key}-${i++}`
                    pathItems.push(<span className="m-1" key={itemKey}>{key}</span>);
                }

                paths.push(<div key={`path-${i}`} className={cn("bg-green-800 p-2 rounded-lg", { 'text-green-950': isEqual(out, userCheckoutPath), 'bg-white': isEqual(out, userCheckoutPath) })}>{pathItems}</div>)
            }
        }

        return paths
    }, [checkout, userCheckoutPath]);

    const onToggleCheckoutClick = () => dispatch(showPath(!showCheckoutPath));
    const onNextCheckoutClick = () => {
        if (minCheckoutValue >= maxCheckoutValue) {
            setMessage({ text: 'Min must be less than Max', type: 'error' });
        } else {
            setMessage(null);
            dispatch(calculateCheckout())
            dispatch(resetPath())
        }
    };

    return (
        <>
            {isDialogOpen && (
                <Dialog
                    onClose={() => setIsDialogOpen(!isDialogOpen)}
                    title="Checkout Trainer Settings"
                >
                    CONTENT
                </Dialog>
            )}
            <header className="fixed">
                <Cog6ToothIcon className="hover:rotate-45 transition-transform size-6 absolute cursor-pointer top-5 right-2" onClick={() => setIsDialogOpen(!isDialogOpen)} />
                <div className='flex w-screen items-center justify-evenly content-center bg-green-950'>
                    <div className='pt-2 pb-2'>
                        <div>
                            {minCheckoutValue}
                        </div>
                        <input
                            onChange={onMinRangeChange}
                            type="range"
                            step="1"
                            id="range"
                            name="range"
                            value={minCheckoutValue}
                            min={firstKey}
                        /></div>
                    <div className='w-20 text-2xl bg-green-800 self-stretch content-center'>
                        <h2>{checkout}</h2>
                    </div>
                    <div className='pt-2 pb-2'>
                        <div>
                            {maxCheckoutValue}
                        </div>
                        <input
                            onChange={onMaxRangeChange}
                            type="range"
                            step="1"
                            id="range"
                            name="range"
                            value={maxCheckoutValue}
                            max={lastKey}
                        />
                    </div>
                </div>
                <div className="w-screen">
                    {message && <div className={cn('p-2', { "bg-red-800": message.type === 'error', "bg-green-800": message.type === 'success' })}>{message.text}</div>}

                    {(isUserPathValidCheckout || showCheckoutPath && message?.type !== 'error') && <div className="bg-[#011006] flex flex-wrap items-center justify-center gap-4 p-2">{checkoutPaths}</div>}

                    <div className='w-80 bg-green-950 flex items-center justify-between m-auto p-4 rounded-[0px_0px_20px_20px]'>
                        {isGameInProgress ? (
                            <>
                                {message?.type !== 'error' && (
                                    <Button text={`${showCheckoutPath ? 'Hide' : 'Show'} Checkout`} onClick={onToggleCheckoutClick} />
                                )}
                                <Button className={`${message?.type === 'error' && 'w-full'}`} text="Next Checkout" onClick={onNextCheckoutClick} />
                            </>
                        ) : (
                            <Button className="w-full" text="Start" onClick={() => {
                                onNextCheckoutClick();
                                dispatch(startGame());
                            }} />
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
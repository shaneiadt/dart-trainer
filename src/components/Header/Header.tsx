import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks";
import { CHECKOUTS, CheckoutsType } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { calculateCheckout, resetPath, setMaxCheckoutValue, setMinCheckoutValue, showPath } from "../../features/checkout/checkoutSlice";
import { getCheckoutValue, getIsCheckedOut, getIsLastDartDouble, getMaxCheckoutValue, getMinCheckoutValue, getShowPath, getUserCheckoutPath, getUserCheckoutValue } from "../../features/checkout/selectors";
import { isEqual } from "lodash";
import cn from "classnames";

const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

type MessageType = 'success' | 'error'

const Header = () => {
    const [message, setMessage] = useState<{ text: string; type: MessageType } | null>(null)

    const dispatch = useAppDispatch()
    const checkout = useAppSelector(getCheckoutValue)
    const minCheckoutValue = useAppSelector(getMinCheckoutValue)
    const maxCheckoutValue = useAppSelector(getMaxCheckoutValue)
    const showCheckoutPath = useAppSelector(getShowPath)
    const userCheckoutValue = useAppSelector(getUserCheckoutValue)
    const userCheckoutPath = useAppSelector(getUserCheckoutPath)

    const isLastDartDouble = useAppSelector(getIsLastDartDouble)

    const checkedOut = useAppSelector(getIsCheckedOut);

    useEffect(() => {
        if (checkedOut) {
            console.log('CHECKED OUT');
        }
    }, [checkedOut, checkout, isLastDartDouble, userCheckoutPath, userCheckoutValue])

    // TODO: Debounce this with listener middleware
    const debouncedCheckoutCalulation = useDebounce(() => {
        if (minCheckoutValue >= maxCheckoutValue) {
            setMessage({ text: 'Min must be less than Max', type: 'error' });
        } else {
            setMessage(null);
            dispatch(calculateCheckout())
        }
    });

    const onMinRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMinCheckoutValue(Number(e.target.value)))
        debouncedCheckoutCalulation()
    }

    const onMaxRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMaxCheckoutValue(Number(e.target.value)))
        debouncedCheckoutCalulation()
    }

    const checkoutPaths = useMemo(() => {
        const outs = CHECKOUTS[checkout]
        const paths: ReactElement[] = []

        let i = 0;

        if (outs?.length) {
            for (const out of outs) {
                const pathItems: ReactElement[] = []

                if (out.join('') === userCheckoutPath.join('')) {
                    console.log('CHECKOUT PATH MATCH', { out });
                    console.log(out);
                }

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
        dispatch(calculateCheckout());
        dispatch(resetPath())
    };

    return (
        <header className="fixed">
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
            <div>
                {message && <div className={cn('p-2',{ "bg-red-800": message.type === 'error', "bg-green-800": message.type === 'success' })}>{message.text}</div>}
                {showCheckoutPath && <div className="bg-[#011006] flex items-center justify-center gap-4 p-2">{checkoutPaths}</div>}
                <div className='bg-green-950 flex w-80 items-center justify-between m-auto p-4 rounded-[0px_0px_20px_20px]'>
                    <button className="bg-purple-600 rounded-sm p-3 cursor-pointer hover:bg-white hover:text-purple-600 transition-colors" onClick={onToggleCheckoutClick}>{showCheckoutPath ? 'Hide' : 'Show'} Checkout</button>
                    <button className="bg-purple-600 rounded-sm p-3 cursor-pointer hover:bg-white hover:text-purple-600 transition-colors" onClick={onNextCheckoutClick}>Next Checkout</button>
                </div>
            </div>
        </header>
    )
}

export default Header
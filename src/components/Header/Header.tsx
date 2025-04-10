import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks";
import { CHECKOUTS, CheckoutsType } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { calculateCheckout, setMaxCheckoutValue, setMinCheckoutValue, showPath } from "../../features/checkout/checkoutSlice";
import { getCheckoutValue, getIsCheckedOut, getIsLastDartDouble, getMaxCheckoutValue, getMinCheckoutValue, getShowPath, getUserCheckoutPath, getUserCheckoutValue } from "../../features/checkout/selectors";
import { resetHitsState } from "../../features/hits/hitsSlice";
import { isEqual } from "lodash";
import cn from "classnames";

const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

const Header = () => {
    const [error, setError] = useState<string | null>(null)

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
            setError('Invalid Checkout Range');
        } else {
            setError(null);
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
                    pathItems.push(<span key={itemKey}>{key}</span>);
                }

                paths.push(<div key={`path-${i}`} className={cn("checkout-path", { 'checkout-path--match': isEqual(out, userCheckoutPath) })}>{pathItems}</div>)
            }
        }

        return paths
    }, [checkout, userCheckoutPath]);

    const onToggleCheckoutClick = () => dispatch(showPath(!showCheckoutPath));
    const onNextCheckoutClick = () => {
        dispatch(calculateCheckout());
        dispatch(resetHitsState())
    };

    return (
        <header>
            <div className='toolbar-primary'>
                <div className='range'>
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
                <div className='checkout'>
                    <h2>{checkout}</h2>
                </div>
                <div className='range'>
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
            <div className='toolbar-secondary'>
                {error && <div className="error">{error}</div>}
                {showCheckoutPath && <div className="checkout-paths">{checkoutPaths}</div>}
                <div className='checkout-buttons'>
                    <button onClick={onToggleCheckoutClick}>{showCheckoutPath ? 'Hide' : 'Show'} Checkout</button>
                    <button onClick={onNextCheckoutClick}>Next Checkout</button>
                </div>
            </div>
        </header>
    )
}

export default Header
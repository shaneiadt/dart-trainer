import { ChangeEvent, ReactElement, useMemo, useState } from "react";
import { useDebounce } from "../../hooks";
import { CHECKOUTS, CheckoutsType } from "../../constants";

export interface HeaderProps {
    calculateCheckout: () => void;
    setCheckoutMinValue: (value: number) => void;
    setCheckoutMaxValue: (value: number) => void;
    minCheckoutValue: number;
    maxCheckoutValue: number;
    checkout: number;
}

const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

const Header = ({ checkout, minCheckoutValue, maxCheckoutValue, calculateCheckout, setCheckoutMinValue, setCheckoutMaxValue }: HeaderProps) => {
    const [error, setError] = useState<string | null>(null)
    const [showCheckoutPath, setShowCheckoutPath] = useState<boolean | null>(false)
    const debouncedCheckoutCalulation = useDebounce(() => {
        if (minCheckoutValue >= maxCheckoutValue) {
            setError('Invalid Checkout Range');
        } else {
            setError(null);
            calculateCheckout()
        }
    });

    const onMinRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckoutMinValue(Number(e.target.value))
        debouncedCheckoutCalulation()
    }

    const onMaxRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckoutMaxValue(Number(e.target.value))
        debouncedCheckoutCalulation()
    }

    const checkoutPaths = useMemo(() => {
        const outs = CHECKOUTS[checkout]
        const paths: ReactElement[] = []

        let i = 0;

        if (outs?.length) {
            for (const out of outs) {
                const pathItems: ReactElement[] = []

                for (const key of out) {
                    const itemKey = `${key}-${i++}`
                    pathItems.push(<span key={itemKey}>{key}</span>);
                }

                paths.push(<div key={`path-${i}`} className="checkout-path">{pathItems}</div>)
            }
        }

        return paths
    }, [checkout]);

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
                    <button onClick={() => setShowCheckoutPath(!showCheckoutPath)}>{showCheckoutPath ? 'Hide' : 'Show'} Checkout</button>
                    <button onClick={() => { setShowCheckoutPath(false); calculateCheckout() }}>Next Checkout</button>
                </div>
            </div>
        </header>
    )
}

export default Header
import { ChangeEvent } from "react";
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
    const debouncedCheckoutCalulation = useDebounce(() => {
        if (minCheckoutValue >= maxCheckoutValue) {
            // setCheckoutSliderError('Invalid Checkout Range')
            console.log('TODO: Invalid Checkout Range');
        } else {
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
    return (
        <header>
            <div className='toolbar-primary'>
                <div className='range'>
                    {minCheckoutValue}
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
                    {maxCheckoutValue}
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
                <div className='checkout-buttons'>
                    <button onClick={calculateCheckout}>Next Checkout</button>
                    {/* <button onClick={() => setShowCheckout(true)}>Show Checkout</button> */}
                </div>
            </div>
        </header>
    )
}

export default Header
import React from 'react';
import { useReducer, useContext } from 'react';
import { bitReducer, initState, actions } from './reducer';
import { Item, Bitwise, Radix } from './enum';

const CalcContext = React.createContext(undefined);


export default function BitCalc () {

    const [ state, dispatch ] = useReducer(bitReducer, initState);

    return (
        <div id='app__container'>
            <CalcContext.Provider value={{state, dispatch}}>
                <Window>
                    <BinaryTable />
                    <OperationButtons />
                    <hr />
                    <OutputResult />
                    <UserInput />
                </Window>    
            </CalcContext.Provider>
        </div>
    )
}


//******* COMPONENTS FOR WINDOW (WRAPPER) *******
function Window (props) {

    const { dispatch } = useContext(CalcContext);

    const onClick = () => {
        if (confirm('Do you want to reset all values?'))
            dispatch({ type: actions.reset });
    }

    return (
        <div className='window'>
            <div className='window__menubar'>
                <button className='window__menubar-button' type='button' onClick={onClick}></button>
            </div>
            <div className='window__content-wrapper'>
                {props.children}
            </div> 
        </div>
    )
}


//******* COMPONENTS FOR BINTABLE SECTION *******
function BinaryTable () {

    const { state, dispatch} = useContext(CalcContext);
    const { input1, input2, result } = state;
    const ary = [...new Array(32)];
    const binAt = (v, i) => (v >> i) & 1;
    const input1_click = (i) =>
        () => dispatch({ type: actions.bits.flip, item: Item.Input1, index: i });
    const input2_click = (i) =>
        () => dispatch({ type: actions.bits.flip, item: Item.Input2, index: i });
    const result_click = 
        () => dispatch({ type: actions.item.update, item: Item.Result});
    const getClass = (item: Item) => {
        const className = ' binTable__tr--highlight';
        return (item === state.item)? className : ' ';
    } 

    return (
    <div className='binTable__wrapper'>
        <table className='binTable'>
            <thead>
                <tr>
                    { ary.map((d, i) => <th key={'header' + i}>{ 31 - i }</th>) }
                </tr>
            </thead>
            <tbody>
                <tr className={'binTable__input1' + getClass(Item.Input1)}>
                    { ary.map((d, i) => 
                    <td onClick={input1_click(31 - i)} 
                        key={'input1_' + i}>
                        {binAt(input1, 31 - i)}
                    </td>)}
                </tr>
                <tr className={'binTable__input2' + getClass(Item.Input2)}>
                    { ary.map((d, i) => 
                    <td onClick={input2_click(31 - i)} 
                        key={'input2_' + i}>
                        {binAt(input2, 31 - i)}
                    </td>)}
                </tr>
                <tr>
                    <td colSpan={32} key='binTable_separator'>
                        <hr className='binTable__separator'/>
                    </td>
                </tr>
                <tr className={'binTable__result' + getClass(Item.Result)}
                    onClick={result_click}>
                    { ary.map((d, i) => 
                    <td key={'result_' + i}>
                        { binAt(result, 31 - i) }
                    </td> )}
                </tr>
            </tbody>
        </table>
    </div>)
}


//******* COMPONENTS FOR UI SECTION *******
function OperationButtons (props) {
    return (
        <div className='oper-button-wrapper'>
            <BitwiseButtons />
            <BitMnpButtngs />
        </div>
    )
}


function OperationButton (props) {

    const { cname, disabled } = props;

    return (
        <button 
            className={'oper-button ' + cname}
            type='button'
            onClick={props.onClick}
            disabled={disabled}>
            {props.text} 
        </button>
    );
}


function BitwiseButtons () {
    const { state, dispatch } = useContext(CalcContext);
    const getClass = (bw: Bitwise) => state.bitwise !== bw? 
        '' : 'oper-button--grayout'
    const createAction = (oper:Bitwise) => () => dispatch({
        type: actions.bitwise.change,
        value: oper
    })

    return (
        <div className="bitwise-buttons">
            <OperationButton text='AND' 
                cname={getClass(Bitwise.AND)}
                onClick={createAction(Bitwise.AND)}/>
            <OperationButton text='OR'
                cname={getClass(Bitwise.OR)}  
                onClick={createAction(Bitwise.OR)} />
            <OperationButton text='XOR'
                cname={getClass(Bitwise.XOR)} 
                onClick={createAction(Bitwise.XOR)}/>
        </div>
    )
}


function BitMnpButtngs () {
    const { state, dispatch } = useContext(CalcContext);
    const disabled = state.item === Item.Result;
    const cname = (disabled)? 'bit-mnp-button--disabled' : '';

    return (
        <div className="bit-mnp-buttons">
            <OperationButton text='<<' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.shift_left})}/>
            <OperationButton text='>>' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.shift_right})}/>
            <OperationButton text='NOT' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.not})}/>
            <OperationButton text='Clear' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.clear})}/>
        </div>
    )
}


//******* COMPONENTS FOR OUPUT SECTION *******
function OutputResult () {
    return (
        <div>
            <OutputNavi/>
            <OutputBars/>
        </div>
    )
}

function OutputNavi () {
    const { state, dispatch } = useContext(CalcContext);
    const getClass = (item: Item) => state.item == item? 
        'navi__item navi__item--highlight' : 'navi__item';
    const createAction = (item) => 
        () => dispatch({type: actions.item.click, item});

    return (
        <nav className='navi'>
            <ul className='navi__item-list'>
                <li key='item-input1' 
                    onClick={createAction(Item.Input1)}
                    className={getClass(Item.Input1)}>Input1
                </li>
                <li key='item-separator1'>/</li>
                <li key='item-input2' 
                    onClick={createAction(Item.Input2)}
                    className={getClass(Item.Input2)}>Input2
                </li>
                <li key='item-separator2'>/</li>
                <li key='item-result' 
                    onClick={createAction(Item.Result)}
                    className={getClass(Item.Result)}>Result
                </li>
            </ul>
        </nav>
    )
}

function OutputBars() {

    const { state } = useContext(CalcContext);     
    let base_val: number = 0;
    let bin_val: string = '';
    let dec_val: string = '';
    let hex_val: string = '';
    const onClick = (val) => () => {
        navigator.clipboard.writeText(val);
    }

    if (state.item === Item.Input1)
        base_val = state.input1;
    else if (state.item === Item.Input2)
        base_val = state.input2;
    else if (state.item === Item.Result)
        base_val = state.result;

    if (base_val !== 0) {
        bin_val = "0b";
        hex_val = (base_val < 0)? '-0x' : '0x';
    }

    dec_val = base_val.toString(10);
    bin_val += (base_val >>> 0).toString(2);
    hex_val += Math.abs(base_val).toString(16).toUpperCase();


    return (
        <div>
            <OutputBar header='BIN' value={bin_val} onClick={onClick(bin_val)}/>
            <OutputBar header='DEC' value={dec_val} onClick={onClick(dec_val)}/>
            <OutputBar header='HEX' value={hex_val} onClick={onClick(hex_val)}/>
        </div>
    )
}

function OutputBar(props) {
    const {header, value, id, onClick }= props;

    return (
        <div className='output-bar__wrapper'>
            <label className='output-bar__label'>{header}</label>
            <input className='output-bar__input' id={id} type="text" value={value} readOnly/>  
            <button className='output-bar__copy-btn' type="button" onClick={onClick}>Copy</button>
        </div>
    )
}


function UserInput () {

    const { state } = useContext(CalcContext);

    return (
        <div className='user-input__wrapper'>
            <UserInputBar />
            <ValidationMassage message={state.validation_message}/>
        </div>
    )
}


function UserInputBar () {
    
    const { dispatch, state } = useContext(CalcContext);
    const placeholder = 'Enter your value here';
    const disabled = state.item === Item.Result;
    const inputBarId = 'user-input__bar';
    const selectId = 'user-input__radix-select';
    const btnCls = 'user-input__enter-btn' + 
        (disabled? ' user-input__enter-btn--disabled' : '');
    const getInputValue = () => 
        (document.getElementById(inputBarId) as HTMLInputElement).value; 
    const onInput = () => 
        dispatch({ type: actions.input.validate, value: getInputValue() })
    const onClick = () => 
        dispatch({ type: actions.input.update, value: getInputValue() });
    const onChange = () => {
        let radix: Radix = Radix.DEC;
        let value = 
            (document.getElementById(selectId) as HTMLSelectElement).value;
        
        if (value === "BIN") radix = Radix.BIN; 
        if (value === "HEX") radix = Radix.HEX; 
        
        dispatch({ type: actions.radix.change, value: radix});
        onInput();
    };
    
    return (
        <div className='user-input__bar-wrapper'>
            <div className='user-input__radix-select-wrapper'>
                <select id={selectId}
                    defaultValue='DEC'
                    onChange={onChange} >
                    <option value='BIN'>BIN</option>
                    <option value='DEC'>DEC</option>
                    <option value='HEX'>HEX</option>
                </select>
                <span className='user-input__radix-select-arrow'>&#9660;</span>
            </div>
            <input id={inputBarId} type="text" 
                onInput={onInput}                
                placeholder={placeholder} disabled={disabled}/>  
            <button className={btnCls} type="button" 
                onClick={onClick} disabled={disabled}>Enter</button>
        </div>
    )
}

function ValidationMassage (prop) {

    const { state } = useContext(CalcContext);
    const disabled = state.item === Item.Result;

    return (
        <div className='user-input__validation-msg-wrapper'> 
            <p className='user-input__validation-msg'>
                { disabled? '' : prop.message}
            </p>
        </div>
    )
}







import React from 'react';
import { useReducer, useContext } from 'react';
import { bitReducer, initState, actions } from './reducer';
import { Item, Bitwise, Radix } from './enum';


const CalcContext = React.createContext(undefined);

export default function BitCalc () {

    const [ state, dispatch ] = useReducer(bitReducer, initState);

    return (
        <div>
            <CalcContext.Provider value={{state, dispatch}}>
                <Window>
                    <HighlightBar />
                    <BinaryTable />
                    <UIButtons />
                    <hr />
                    <OutputSection />
                    <UserInputSection />
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
        <div id='window'>
            <div id='window__menubar'>
                <button id='window__menubar-button' type='button' onClick={onClick}></button>
            </div>
            <div id='window__content-wrapper'>
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
    const bin_at = (v, i) => (v >> i) & 1;
    const input1_click = (i) =>
        () => dispatch({ type: actions.bits.flip, item: Item.Input1, index: i });
    const input2_click = (i) =>
        () => dispatch({ type: actions.bits.flip, item: Item.Input2, index: i });
    const result_click = 
        () => dispatch({ type: actions.item.update, item: Item.Result});

    return (
        <table id='binTable'>
            <thead>
                <tr>
                    { ary.map((d, i) => <th key={'header' + i}>{ 31 - i }</th>) }
                </tr>
            </thead>
            <tbody>
                <tr id='binTable__input1'>
                    { ary.map((d, i) => 
                        <td onClick={input1_click(31 - i)} 
                            key={'input1_' + i}>
                            {bin_at(input1, 31 - i)}
                        </td>)}
                </tr>
                <tr id='binTable__input2'>
                  { ary.map((d, i) => 
                        <td onClick={input2_click(31 - i)} 
                            key={'input2_' + i}>
                            {bin_at(input2, 31 - i)}
                        </td>)}
                </tr>
                <tr>
                    <td colSpan={32} key='binTable_separator'>
                        <hr id='binTable__separator'/>
                    </td>
                </tr>
                <tr id='binTable__result' onClick={result_click}>
                    { ary.map((d, i) => 
                        <td key={'result_' + i}>
                            { bin_at(result, 31 - i) }
                        </td> )}
                </tr>
            </tbody>
        </table>
    )
}

function HighlightBar () {

    const { state } = useContext(CalcContext);
    const { item } = state;

    let cls = 'binTable__highlight-bar binTable__highlight-bar__';
    if (item === Item.Input1)
        cls += 'input1';
    else if (item === Item.Input2)
        cls += 'input2';
    else if (item === Item.Result)
        cls += 'result'

    return (
        <div className={cls}></div>
    )
}



//******* COMPONENTS FOR UI SECTION *******
function UIButtons (props) {
    return (
        <div className='ui__button-wrapper'>
            <BitwiseButtons />
            <BitMnpButtngs />
        </div>
    )
}


function UIButton (props) {

    const { cname, disabled } = props;

    return (
        <button 
            className={'ui__button' + ' ' + cname}
            onClick={props.onClick}
            disabled={disabled}>
            {props.text} 
        </button>
    );
}


function BitwiseButtons () {
    const { state, dispatch } = useContext(CalcContext);
    const getClass = (bw: Bitwise) => state.bitwise === bw? 
        '' : 'ui__button__grayout'
    const createAction = (oper:Bitwise) => () => dispatch({
        type: actions.bitwise.change,
        value: oper
    })

    return (
        <div id="ui__bitwise-buttons">
            <UIButton text='AND' 
                cname={getClass(Bitwise.AND)}
                onClick={createAction(Bitwise.AND)}/>
            <UIButton text='OR'
                cname={getClass(Bitwise.OR)}  
                onClick={createAction(Bitwise.OR)} />
            <UIButton text='XOR'
                cname={getClass(Bitwise.XOR)} 
                onClick={createAction(Bitwise.XOR)}/>
        </div>
    )
}


function BitMnpButtngs () {
    const { state, dispatch } = useContext(CalcContext);
    const disabled = state.item === Item.Result;
    const cname = (disabled)? 'ui__bit-mnp-button__disabled' : '';

    return (
        <div id="ui__bit-mnp-buttons">
            <UIButton text='<<' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.shift_left})}/>
            <UIButton text='>>' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.shift_right})}/>
            <UIButton text='NOT' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.not})}/>
            <UIButton text='All 1s' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.all1s})}/>
            <UIButton text='Clear' 
                disabled={disabled} 
                cname={cname}
                onClick={() => dispatch({ type: actions.bits.clear})}/>
        </div>
    )
}


//******* COMPONENTS FOR OUPUT SECTION *******
function OutputSection () {
    return (
        <div id='output-section'>
            <OutputNavi/>
            <OutputBars/>
        </div>
    )
}

function OutputNavi () {
    const { state, dispatch } = useContext(CalcContext);
    const getClass = (item: Item) => state.item == item? 
        'navi__item navi__item__highlight' : 'navi__item';
    const createAction = (item) => 
        () => dispatch({type: actions.item.click, item});

    return (
        <nav id='navi'>
            <ul id='navi__item-list'>
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

    dec_val = base_val.toString(10);
    hex_val = base_val.toString(16);
    bin_val = (base_val >>> 0).toString(2);

    return (
        <div>
            <OutputBar header='BIN:' value={bin_val} onClick={onClick(bin_val)}/>
            <OutputBar header='DEC:' value={dec_val} onClick={onClick(dec_val)}/>
            <OutputBar header='HEX:' value={hex_val} onClick={onClick(hex_val)}/>
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


function UserInputSection () {

    const { state } = useContext(CalcContext);

    return (
        <div id='user-input__container'>
            <RadixSelector />
            <UserInputBar />
            <ValidationMassage message={state.validation_message}/>
        </div>
    )
}


function RadixSelector () {

    const { state, dispatch } = useContext(CalcContext);
    const radix_for_input = state.radix_for_input;
    const cls = 'user-input__radix-item';
    const getClass = (radix: Radix) => radix === radix_for_input? 
        cls + ' user-input__radix-item__highlight' : cls;
    const onClick = (radix) => () => {
        dispatch({type: actions.radix.change, value: radix });
    }

    return (
        <div>
            <ol id='user-input__radix-list'>
                <li className={getClass(Radix.BIN)} onClick={onClick(Radix.BIN)}>BIN</li>
                <li>/</li>
                <li className={getClass(Radix.DEC)} onClick={onClick(Radix.DEC)}>DEC</li>
                <li>/</li>
                <li className={getClass(Radix.HEX)} onClick={onClick(Radix.HEX)}>HEX</li>
            </ol>
        </div>
    )
}

function UserInputBar () {

    const { dispatch, state } = useContext(CalcContext);
    const placeholder = 'You can enter your value through here';
    const disabled = state.item === Item.Result;
    const onClick = () => {
        const value = (document.getElementById('user-input__bar') as HTMLInputElement).value;
        dispatch({ type: actions.input.update, value });
    }
    const btnCls = 'user-input__enter-btn' + 
        ((disabled)? ' user-input__enter-btn__disabled' : '');

    return (
        <div className='user-input__bar-wrapper'>
            <input id='user-input__bar' type="text" 
                placeholder={placeholder} disabled={disabled}/>  
            <button className={btnCls} type="button" 
                onClick={onClick} disabled={disabled}>Enter</button>
        </div>
    )
}

function ValidationMassage (prop) {
    return <p id='user-input__validation-msg'>{prop.message}</p>
}







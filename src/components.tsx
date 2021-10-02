import React from 'react';
import { useReducer, useContext } from 'react';
import { bitReducer, initState, actions } from './reducer';
import { Item, Bitwise } from './enum';


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
                    <OutputSeparator />
                    <OutputSection />
                </Window>    
            </CalcContext.Provider>
        </div>
    )
}


//******* COMPONENTS FOR WINDOW (WRAPPER) *******
function Window (props) {
    return (
        <div id='window'>
            <div id='window__menubar'></div>
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
    const bin_at = (v, i) => (v >> (31 - i)) & 1;
    const input1_click = (i) =>
        () => dispatch({ type: actions.bits.flip, item: Item.Input1, index: i });
    const input2_click = (i) =>
        () => dispatch({ type: actions.bits.flip, item: Item.Input2, index: i });

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
                            {bin_at(input1, i)}
                        </td>)}
                </tr>
                <tr id='binTable__input2'>
                  { ary.map((d, i) => 
                        <td onClick={input2_click(31 - i)} 
                            key={'input2_' + i}>
                            {bin_at(input2, i)}
                        </td>)}
                </tr>
                <tr>
                    <td colSpan={32} key='binTable_separator'>
                        <hr id='binTable__separator'/>
                    </td>
                </tr>
                <tr id='binTable__result'>
                    { ary.map((d, i) => 
                        <td key={'result_' + i}>
                            { bin_at(result, i) }
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
    return (
        <button 
            className='ui__button'
            onClick={props.onClick}>
            {props.text} 
        </button>
    );
}


function BitwiseButtons () {
    const { state, dispatch } = useContext(CalcContext);
    const createAction = (oper:Bitwise) => () => dispatch({
        type: actions.bitwise.change,
        value: oper
    })

    return (
        <div id="ui__bitwise-buttons">
            <UIButton text='AND' onClick={createAction(Bitwise.AND)}/>
            <UIButton text='OR'  onClick={createAction(Bitwise.OR)} />
            <UIButton text='XOR' onClick={createAction(Bitwise.XOR)}/>
        </div>
    )
}

function BitMnpButtngs () {
    const { state, dispatch } = useContext(CalcContext);

    return (
        <div id="ui__bit-mnp-buttons">
            <UIButton text='<<' onClick={() => 
                dispatch({ type: actions.bits.shift_left})}/>
            <UIButton text='>>' onClick={() => 
                dispatch({ type: actions.bits.shift_right})}/>
            <UIButton text='All 1s' onClick={() => 
                dispatch({ type: actions.bits.all1s})}/>
            <UIButton text='Clear' onClick={() => 
                dispatch({ type: actions.bits.clear})}/>
        </div>
    )
}


//******* COMPONENTS FOR OUPUT SECTION *******
function OutputSeparator () {
    return <div><hr/></div>
}

function OutputSection () {

    return (
        <div id='output-section'>
            <OutputNavi/>
            <OutputBars/>
        </div>
    )
}

function OutputNavi () {

    return (
        <nav id='navi'>
            <ul id='navi__item-list'>
                <li key='item-input1'>Input1</li>
                <li key='item-separator1'>|</li>
                <li key='item-input2'>Input2</li>
                <li key='item-separator2'>|</li>
                <li key='item-result'>Result</li>
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

    if (state.item === Item.Input1)
        base_val = state.input1;
    else if (state.item === Item.Input2)
        base_val = state.input2;
    else if (state.item === Item.Result)
        base_val = state.result;

    bin_val = base_val.toString(2);
    dec_val = base_val.toString(10);
    hex_val = base_val.toString(16);

    return (
        <div>
            <OutputBar header='BIN:' value={bin_val} />
            <OutputBar header='DEC:' value={dec_val} />
            <OutputBar header='HEX:' value={hex_val} />
        </div>
    )
}

function OutputBar(props) {
    
    const {header, value, onKeyUp }= props;

    return (
        <div className='output-bar__wrapper'>
            <label className='output-bar__label'>{header}</label>
            <input className='output-bar__input' type="text" value={value} onChange={() => {}}/>  
            <button className='output-bar__copy-btn' type="button">Copy</button>
        </div>
    )
}









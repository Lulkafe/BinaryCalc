import React from 'react';
import { useReducer, useContext } from 'react';

enum NumBase { BIN, DEC, HEX };
enum Bitwise { AND, OR, XOR };
enum Item { Input1, Input2, Result };

const actions = {
    bits: {
        flip: 'Update a bit',
        shift_left: 'Left shift',
        shift_right: 'Right shift',
        clear: 'Clear all bits',
        all1s: 'Make all bits 1'
    },
    bitwise: {
        change: 'Changed the bitwise operator'
    },
    tab: {
        click: 'Clicked an output tab'
    }, 
    input: {
        update: 'User gave an input value'
    }
}

const initState = {
    input1: 0,
    input2: 0,
    result: 0,
    bitwise: Bitwise.AND,
    item: Item.Input1
}


const bitReducer = (state, action) => {

    console.log(`New Action comes: ${action.type}`);
    console.log(action);

    const { input1, input2,  bitwise } = state;
    const calculateResult = (v1, v2, oper=bitwise) => {
        if (oper === Bitwise.AND)
            return v1 & v2;
        if (oper === Bitwise.OR)
            return v1 | v2;
        if (oper === Bitwise.XOR)
            return v1 ^ v2;            
    }

    switch(action.type) {
        case actions.bits.flip:
            if (action.item === Item.Input1) {
                const new_val = input1 ^ (1 << action.index);
                return {
                    ...state,
                    input1: new_val,
                    result: calculateResult(new_val, input2),
                    item: action.item
                }
            }
            if (action.item === Item.Input2) {
                const new_val = input2 ^ (1 << action.index);
                return {
                    ...state,
                    input2: new_val,
                    result: calculateResult(input1, new_val),
                    item: action.item
                }
            }
            break;

        case actions.bits.shift_left:
            if (state.item === Item.Input1)
                return {
                    ...state,
                    input1: input1 << 1,
                    result: calculateResult(input1 << 1, input2)
                }
            if (state.item === Item.Input2)
                return {
                    ...state,
                    input2: input2 << 1,
                    result: calculateResult(input1, input2 << 1)
                }
            break;

        case actions.bits.shift_right:
            if (state.item === Item.Input1)
                return {
                    ...state,
                    input1: input1 >> 1,
                    result: calculateResult(input1 >> 1, input2)
                }
            if (state.item === Item.Input2)
                return {
                    ...state,
                    input2: input2 >> 1,
                    result: calculateResult(input1, input2 >> 1)
                }
            break;
        
        case actions.bits.clear:
            if (state.item === Item.Input1)
                return { 
                    ...state, 
                    input1: 0,
                    result: calculateResult(0, input2) 
                };
            if (state.item === Item.Input2)
                return { 
                    ...state, 
                    input2: 0,
                    result: calculateResult(input1, 0)
                };  
            break;

        case actions.bits.all1s:
            if (state.item === Item.Input1)
                return { 
                    ...state, 
                    input1: -1,
                    result: calculateResult(-1, input2)
                };
            if (state.item === Item.Input2)
                return { ...state, input2: -1 };
            break;

        case actions.bitwise.change:
            {
                const new_oper: Bitwise = action.value;

                return {
                    ...state,
                    bitwise: new_oper,
                    result: calculateResult(input1, input2, new_oper)
                }
            }

        case actions.tab.click:
            return {
                ...state,
                tab: action.value
            }
    }

    return state;
}


const CalcContext = React.createContext(undefined);

export default function BitCalc () {

    const [ state, dispatch ] = useReducer(bitReducer, initState);

    return (
        <div>
            <CalcContext.Provider value={{state, dispatch}}>
                <Window>
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
            {props.children}
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



//******* COMPONENTS FOR UI SECTION *******
function UIButtons (props) {
    return (
        <div>
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
        <div>
            <OutputNavi/>
            <OutputBars/>
        </div>
    )
}

function OutputNavi () {

    return (
        <nav>
            <ul>
                <li key='item-input1'>Input 1</li>
                <li key='item-input2'>Input 2</li>
                <li key='item-result'>Result</li>
            </ul>
        </nav>
    )
}
function OutputBars(props) {

    const { state, dispatch } = useContext(CalcContext); 
    const onKeyUp = function () {
        dispatch({ action: actions.input.update, value: this.value })
    }

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
            <OutputBar header='BIN:' value={bin_val} onKeyUp={onKeyUp}/>
            <OutputBar header='DEC:' value={dec_val} onKeyUp={onKeyUp}/>
            <OutputBar header='HEX:' value={hex_val} onKeyUp={onKeyUp}/>
        </div>
    )
}

function OutputBar(props) {
    
    const {header, value, onKeyUp }= props;

    return (
        <div>
            <label className='output-bar__label'>{header}</label>
            <input type="text" value={value} onKeyUp={onKeyUp} onChange={()=>{}}/>  
            <button type="button">Copy</button>
        </div>
    )
}









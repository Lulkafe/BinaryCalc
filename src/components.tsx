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
    }
}

const initState = {
    input1: 128,
    input2: 0,
    result: 0,
    bitwise: Bitwise.AND,
    item: Item.Input1
}


const bitReducer = (state, action) => {

    console.log(`New Action comes: ${action.type}`);
    const { input1, input2,  bitwise } = state;
    const recalculateResult = (v1, v2, oper=bitwise) => {
        if (oper === Bitwise.AND)
            return v1 & v2;
        if (oper === Bitwise.OR)
            return v1 | v2;
        if (oper === Bitwise.XOR)
            return v1 ^ v2;            
    }

    switch(action.type) {
        case actions.bits.flip:
            break;

        case actions.bits.shift_left:
            if (action.item === Item.Input1)
                return {
                    ...state,
                    input1: input1 << 1,
                    result: recalculateResult(input1 << 1, input2)
                }
            if (action.item === Item.Input2)
                return {
                    ...state,
                    input2: input2 << 1,
                    result: recalculateResult(input1, input2 << 1)
                }
            break;

        case actions.bits.shift_right:
            if (action.item === Item.Input1)
                return {
                    ...state,
                    input1: input1 >> 1,
                    result: recalculateResult(input1 >> 1, input2)
                }
            if (action.item === Item.Input2)
                return {
                    ...state,
                    input2: input2 >> 1,
                    result: recalculateResult(input1, input2 >> 1)
                }
            break;
        
        case actions.bits.clear:
            if (action.item === Item.Input1)
                return { 
                    ...state, 
                    input1: 0,
                    result: recalculateResult(0, input2) 
                };
            if (action.item === Item.Input2)
                return { 
                    ...state, 
                    input2: 0,
                    result: recalculateResult(input1, 0)
                };  
            break;

        case actions.bits.all1s:
            if (action.item === Item.Input1)
                return { 
                    ...state, 
                    input1: -1,
                    result: recalculateResult(-1, input2)
                };
            if (action.item === Item.Input2)
                return { ...state, input2: ~0 };
            break;

        case actions.bitwise.change:
            return {
                ...state,
                bitwise: action.value
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
    const input1_click = 
        () => dispatch({ type: actions.bits.flip, item: Item.Input1 });
    const input2_click = 
        () => dispatch({ type: actions.bits.flip, item: Item.Input2 });

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
                        <td onClick={input1_click} 
                            key={'input1_' + i}>
                            {bin_at(input1,i)}
                        </td>)}
                </tr>
                <tr id='binTable__input2'>
                  { ary.map((d, i) => 
                        <td onClick={input2_click} 
                            key={'input2_' + i}>
                            {bin_at(input2,i)}
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
            <UIButton text='<<' 
                onClick={() => dispatch({ type: actions.bits.shift_left})}/>
            <UIButton text='>>'
                onClick={() => dispatch({ type: actions.bits.shift_right})}/>
            <UIButton text='All 1s'
                onClick={() => dispatch({ type: actions.bits.all1s})}/>
            <UIButton text='Clear' 
                onClick={() => dispatch({ type: actions.bits.clear})}/>
        </div>
    )
}


//******* COMPONENTS FOR OUPUT SECTION *******
function OutputSeparator () {
    
}

function OutputSection () {

}

function OutputNavi () {
    return (
        <nav>
            <ul>
                <li>Input 1</li>
                <li>Input 2</li>
                <li>Result</li>
            </ul>
        </nav>
    )
}

function OutputBar(sys) {
    
    let header: string = '';
    let init_val: string  = '';

    switch(sys) {
      case NumBase.BIN: 
        header = 'BIN';
        init_val = '0b0000000000000000000000000000';
        break;
      case NumBase.DEC:
        header = 'DEC';
        init_val = '0';
        break;
      case NumBase.HEX:
        header = 'HEX';
        init_val = '0x0';
        break;
    }
 
    return (
        <div>
            <label>{header}</label>
            <input type="text" /> 
            <button type="button">Copy</button>
        </div>
    )
}











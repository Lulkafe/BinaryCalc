import React from 'react';
import { useReducer, useContext } from 'react';

enum NumBase { BIN, DEC, HEX };
enum Bitwise { AND, OR, XOR, NOT };
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
    input1: 0,
    input2: 0,
    result: 0,
    bitwise: Bitwise.AND,
    item: Item.Input1
}

const BitReducer = (state, action) => {

    switch(action.type) {
        case actions.bits.flip:
            break;
        case actions.bits.shift_left:
            
            break;
        case actions.bits.shift_right:
            break;
        case actions.bits.clear:
            
            break;
        case actions.bits.all1s:
            
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
        default:
            return state;
    }

}


const CalcContext = React.createContext(undefined);


export default function BitCalc () {

    const [ state, dispatch ] = useReducer(BitReducer, initState);

    return (
        <div>
            <CalcContext.Provider value={{state, dispatch}}>
                <Window>
                    <BinaryTable />
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

    return (
        <table>
            <thead>
                <tr>
                    { [...new Array(31)].map((d, i) => <th>{ 31 - i }</th>) }
                </tr>
            </thead>
            <tbody>
                <tr id='binTable__input1'>
                    
                </tr>

                <tr id='binTable__input2'>

                </tr>

                <tr>
                    <td colSpan={32}>
                        <hr id='binTable__separator'/>
                    </td>
                </tr>

                <tr id='binTable__result'>

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
        <button className=''>{props.text}</button>
    );
}


function BitwiseButtons () {
    return (
        <div id="ui__bitwise-buttons">
            <UIButton text='AND' />
            <UIButton text='OR' />
            <UIButton text='XOR' />
            <UIButton text='NOT' />
        </div>
    )
}

function BitMnpButtngs () {
    return (
        <div id="ui__bit-mnp-buttons">
            <UIButton text='<<' />
            <UIButton text='>>' />
            <UIButton text='All 1s' />
            <UIButton text='Clear' />
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











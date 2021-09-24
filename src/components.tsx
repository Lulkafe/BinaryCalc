import React from 'react';
import { useState } from 'react';

enum NumBase {
    BIN, DEC, HEX
}

enum BitOper {
    AND, OR, XOR, NOT
}

enum PageTab {
    Input1, Input2, Result
}

export default function BitCalc () {
    return (
        <div>
            <Window>
            </Window>
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

    return (
        <table>
            <thead>
                <tr>
                    { 
                        [...new Array(31)].map((d, i) => <th>{ 31 - i }</th>) 
                    }
                </tr>
            </thead>
            <tbody>
                <tr id='binTable__input1'>

                </tr>
                <tr id='binTable__input2'>

                </tr>
                <tr>
                    <hr id='binTable__separator'/>
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
        <button>{props.text}</button>
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











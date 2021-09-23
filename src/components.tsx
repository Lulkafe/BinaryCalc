import React from 'react';
import { useState } from 'react';

enum NumBase {
    BIN, DEC, HEX
}

enum BitOper {
    AND, OR, XOR, NOT
}

export default function BitCalc () {
    return (
        <div>
            <p>Greeting from React!</p>
        </div>
    )
}


//******* COMPONENTS FOR WINDOW (WRAPPER) *******
function Window () {
    return (
        <div id='window'>
            <div id='window__menubar'></div>

        </div>
    )
}


//******* COMPONENTS FOR BINTABLE SECTION *******
function BinaryTable (input1: number = 0, input2: number = 0, oper: BitOper = BitOper.OR) {

    const num_bits = 31;
    const bin_input1 = input1.toString(2);
    const bin_input2 = input2.toString(2);
    let bin_result = 0;


    return (
        <table>
            <thead>
                <tr>
                    { 
                        [...new Array(num_bits)].map((d, i) => <th>{ num_bits - i }</th>) 
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
function UIButton (text: string) {
    return (
        <button>{text}</button>
    );
}


function BitwiseButtons () {
    return (
        <div id="ui__bitwise-buttons">
            
        </div>
    )
}

function BitCngButtngs () {

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

function OutputBar(sys: NumBase) {
    
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











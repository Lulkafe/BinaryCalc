import React from 'react';
import { useState } from 'react';

enum NumBase {
    BIN, DEC, HEX
}

export default function BitCalc () {
    return (
        <div>
            <p>Greeting from React!</p>
        </div>
    )
}


//******* COMPONENTS FOR WRAPPER WINDOW *******
function Window () {

}



//******* COMPONENTS FOR INPUT SECTION *******
function InputSection () {
    
}



//******* COMPONENTS FOR UI SECTION *******
function UIButton (text: string) {
    return (
        <button>{text}</button>
    );
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











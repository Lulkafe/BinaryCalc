import ReactDOM from 'react-dom';
import React from 'react';

const text: string = 'Hello React';
const Test = <p>Greeting From React</p>;

console.log(text);
ReactDOM.render(Test, document.getElementById('root'))

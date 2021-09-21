import ReactDOM from 'react-dom';
import React from 'react';
import './style.css';

const text: string = 'Hello React';
const Test = <p>Greeting From React</p>;

ReactDOM.render(Test, document.getElementById('root'))

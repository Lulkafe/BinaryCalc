import { Bitwise, Item } from './enum';

export const initState = {
    input1: 0,
    input2: 0,
    result: 0,
    bitwise: Bitwise.AND,
    item: Item.Result
}

export const actions = {
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
    item: {
        click: 'Clicked an output tab item',
        update: 'Update a tab item'
    }, 
    input: {
        update: 'User gave an input value'
    }
}


export const bitReducer = (state, action) => {

    console.log(`New Action dispatched: ${action.type}`);
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

                if (new_oper === state.bitwise)
                    return state;

                return {
                    ...state,
                    bitwise: new_oper,
                    result: calculateResult(input1, input2, new_oper)
                }
            }

        case actions.item.click:
            return {
                ...state,
                item: action.item
            }
        
        case actions.item.update:
            return {
                ...state,
                item: action.item
            }
                
    }

    return state;
}
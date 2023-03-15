import React, { useReducer, useState, useEffect } from 'react';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { currencyStore } from '../../stores/currencyStore.ts';
import { observer } from 'mobx-react-lite';
import { converterStore } from '../../stores/converterStore.ts';


type IConverterBlock = {
    currencyStore?: currencyStore;
    converterStore? : converterStore;
}

type TReducerState = {
    value1: string;
    value2: string;
    inPrice: number;
    outPrice: number
}

function reducer(state: TReducerState, action: any): TReducerState {
    switch (action.type) {
      case 'SET_VALUE':
        return {
          ...state,
          [action.payload.name]: action.payload.value,
          value2: String((Number(action.payload.value) * state.inPrice) / state.outPrice),
        };
  
      case 'SET_PRICES':
        return {
          ...state,
          inPrice: action.payload.in,
          outPrice: action.payload.out,
        };
  
      default:
        return state;
    }
  }

const ConverterBlock:React.FC<IConverterBlock> = observer(() => {

    const coins: string [] = currencyStore.getItems.map((coin: any) => coin.name);

    const [curr1, setCurr1] = useState(`BTC`);
    const [curr2, setCurr2] = useState('USDT');

    const inPrice = converterStore.getSelectedCoin.price ? Number(converterStore?.getSelectedCoin.price) : Number(currencyStore!.getItems.find((obj: any) => obj.name === curr1)?.price);
    const outPrice = Number(currencyStore!.getItems.find((obj: any) => obj.name === curr2)?.price) || 0;

    const [state, dispatch] = useReducer(reducer, {
        value1: '',
        value2: '',
        inPrice,
        outPrice
    })
    
    const onUpdateField = (name: string, value: string) => {
        dispatch({
            type: 'SET_VALUE',
            payload: {
                name,
                value
            }
        });
    }

    useEffect(() => {
        console.log(inPrice, outPrice)
        console.log(converterStore?.getSelectedCoin.name)
        dispatch({
            type: 'SET_PRICES',
            payload: {
                in: inPrice,
                out: outPrice
            }
        });
    },[inPrice, outPrice]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const CryptoInputBox = styled("div")(({ theme }) => ({
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }));
    
    const InputFormControl = styled(FormControl)(({ theme }) => ({
        padding: theme.spacing(1),
        minWidth: 'calc(70% - 10px)'
    }));
    
    const SelectFormControl = styled(FormControl)(({ theme }) => ({
        padding: theme.spacing(1),
        minWidth: '30%'
    }));

    const CustomLabel = styled(InputLabel)(() => ({
        top: 10
    }));
        

    return (
            <Item>
                <CryptoInputBox>
                    <InputFormControl>
                    <TextField 
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                        value={state.value1} 
                        onChange={(e: any) => onUpdateField('value1', e.target.value)} 
                        label="Сумма" variant="standard" 
                    />
                    </InputFormControl>
                
                    <SelectFormControl>
                    <CustomLabel id="currency-1-label">Валюта</CustomLabel>
                    <Select
                        variant="standard"
                        value={converterStore?.getSelectedCoin.name || curr1}
                        label="Валюта"
                        onChange={(e) => {
                            setCurr1(e.target.value as string)
                            converterStore?.setSelectedCoin(e.target.value as string) 
                        }}
                    >
                        
                        {
                            coins.map((coin: string) => {
                                return (
                                    <MenuItem key={coin} value={coin}>{coin}</MenuItem>
                                )
                            })
                        }
                    </Select>
                    </SelectFormControl>
                </CryptoInputBox>

                <CryptoInputBox>
                    <InputFormControl>
                    <TextField type="number" value={state.value2} label="Сумма" variant="standard" />
                    </InputFormControl>
                
                    <SelectFormControl>
                    <CustomLabel id="currency-2-label">Валюта</CustomLabel>
                    <Select
                        variant="standard"
                        value={curr2}
                        label="Валюта"
                        onChange={(e) => {
                            setCurr2(e.target.value as string)
                        }}
                    >
                        {
                            coins.map((coin: string) => {
                                return (
                                    <MenuItem key={coin} value={coin}>{coin}</MenuItem>
                                )
                            })
                        }
                    </Select>
                    </SelectFormControl>
                </CryptoInputBox>
            </Item>
    )
})

export default ConverterBlock;
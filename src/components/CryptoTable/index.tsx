import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import { TCoin, TCoinDiff } from '../../types';
import {currencyStore} from '../../stores/currencyStore.ts';
import {converterStore} from '../../stores/converterStore.ts'



const CryptoTable = observer(() => {
    const [isLoading, setLoader] = useState(false);

    const items: TCoin[] = currencyStore!.items;
    const diffObj: TCoinDiff = currencyStore!.diffObj;

    const onClickRow = (coin: TCoin) => {
        if (converterStore) {
            converterStore.setSelectedCoin(coin)
        }
    }

    useEffect(() => {
      setLoader(true)
        if (currencyStore) {
          currencyStore.fetchItems();
          setInterval(() => {
            currencyStore.fetchItems();
          }, 20 * 1000);
        }
        setLoader(false)
      }, []);
    
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight: 780,
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center'
    }));

    const CustomBody = styled(TableBody)(() => ({
      flexGrow: 1,
      // display: 'flex',
      // alignItems: "center",
      // justifyContent: 'center'
  }));

    const CurrencyIcon = styled("img")(() => ({
        width: 30,
        height: 30
    }));

  return (
    <>
        <TableContainer component={Item}> 
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Fullname</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">volume24hour</TableCell>
              </TableRow>
            </TableHead>
            <CustomBody>
              {isLoading && (<CircularProgress /> )}

              {(!isLoading && items.length) && 
                items.map((item: TCoin) => {
                  return (
                      <TableRow
                          onClick = {() => onClickRow(item)}
                          hover
                          key={item.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <CurrencyIcon src={item.imageUrl} alt={item.fullName} />
                        </TableCell>
                        <TableCell align="left">{item.name}</TableCell>
                        <TableCell align="left">{item.fullName}</TableCell>
                        
                        <TableCell style={{backgroundColor: diffObj[item.name] ? (diffObj[item.name]) : 'transparent'}} align="left">$ {item.price}</TableCell>
                        <TableCell align="left">$ {item.volume}</TableCell>
                      </TableRow>
                  )
                })}
            </CustomBody>
          </Table>
          </TableContainer>
    </>
  )
})

export default CryptoTable;
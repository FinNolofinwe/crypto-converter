import React from 'react';
import { TCoin } from './types';
import {styled} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';


import {CryptoTable, ConverterBlock} from './components/index.ts';


function App() {


  const GridContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(10),
  }));

  const CustomGrid = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(2),
  }));

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  

  return (
    <div className="App">
      <GridContainer maxWidth="lg">
      <Grid container spacing={2}>
        <CustomGrid item xs={8}>
          <CryptoTable/>
        </CustomGrid>
        <CustomGrid item xs={4}>
          <ConverterBlock />
        </CustomGrid>
      </Grid>
      </GridContainer>
    </div>
  );
}

export default App;

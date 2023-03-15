import axios from 'axios';
import { TCoin, TCoinDiff } from "../types";
import { makeAutoObservable, runInAction, observable, action, computed } from "mobx";
import { converterStore } from './converterStore.ts';

class CurrencyStore {
    items: TCoin[] = [];
    diffObj: TCoinDiff = {};

    constructor() {
      makeAutoObservable(this, {
        items: observable,
        diffObj: observable,
        setItems: action,
        fetchItems: action,
        getDiffObj: computed,
        getItems: computed
      });
    }

    get getItems () {
        return this.items
    }

    get getDiffObj () {
        return this.diffObj
    }
    
    setItems = (items: TCoin[]): void => {
      
      console.log(this.diffObj)
        this.diffObj = this.diffCurrencies(this.items, items).reduce(
          (initObj: TCoinDiff, obj: TCoin) => {
            const newObj: TCoin = items.find(o => o.name === obj.name)!;
            const oldObj: TCoin = this.items.find(itemObj => itemObj.name === newObj.name)!;
            console.log(newObj)
            console.log(oldObj)

            const color: string =
              newObj.price === oldObj.price ? '' : newObj.price > oldObj.price ? 'green' : 'red';
    
            initObj[newObj.name] = color;
    
            return initObj;
          },
          {},
        );
        this.items = items;
          console.log('updated')
        setTimeout(() => {
          runInAction(() => {
            this.diffObj = {};
          })
        }, 5000);
      };

    fetchItems = async () => {
        try {
           const response = await axios.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD')
                    const coins:TCoin[] = response.data.Data
                    .map((coin: any) => {
                        const obj: TCoin = {
                            name: coin.CoinInfo.Name,
                            fullName: coin.CoinInfo.FullName,
                            imageUrl: `https://www.cryptocompare.com/${coin.CoinInfo.ImageUrl}`,
                            price: parseFloat(coin.RAW.USD.PRICE.toFixed(3)),
                            volume: parseFloat(coin.RAW.USD.VOLUME24HOUR.toFixed(3))
                        }
                        return obj
                    })
                    runInAction(() => {
                      this.setItems(coins)
                      console.log(coins)
                      converterStore.setSelectedCoin(coins[0]);
                    })
                    
        } catch(e) {
            runInAction(() => {
                            console.log(e)
                        })
        }
        

    }

    diffCurrencies(arr1: TCoin[], arr2: TCoin[]) {
        return arr1.filter((obj, index) => {
          if (obj.price !== arr2[index].price) {
            return true;
          }
          return false;
        });
      }
  
}

export const currencyStore = new CurrencyStore();
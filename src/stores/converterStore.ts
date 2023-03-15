import { TCoin, TSelectedCoin } from "../types";
import { makeAutoObservable, observable, computed, action } from 'mobx';



class ConverterStore {
    selectedCoin: TSelectedCoin = {
        name: '',
        price: 0,
    };

    constructor() {
      makeAutoObservable(this, {
        selectedCoin: observable,
        getSelectedCoin: computed,
        setSelectedCoin: action
      });
    }

    get getSelectedCoin() {
        return this.selectedCoin
    }

    setSelectedCoin(coin: TCoin) {
        this.selectedCoin = {
          name: coin.name,
          price: coin.price,
        };
    }
  
}

export const converterStore = new ConverterStore();
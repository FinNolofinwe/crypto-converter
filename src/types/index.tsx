export type TCoin = {
  name: string;
  fullName: string;
  imageUrl: string;
  price: number;
  volume: number;
};

export type TCoinDiff = { [key: string]: string };

export type TSelectedCoin = {
  name: string;
  price: number;
};
import { DEFAULT_CURRENCY } from '../../constants/general';
import { RateDTO } from '../../interfaces';

export const getExchangeRateFromCollection = (
  rates: RateDTO[],
  sign: string,
  date: Date
) => {
  return rates.find(
    (rate) => rate.date?.getTime() === date.getTime() && rate.sign === sign
  );
};

export const convertCurrency = (
  rates: RateDTO[],
  sign: string,
  date: Date,
  amount: number
) => {
  let exchangeRate = 1;
  if (sign !== DEFAULT_CURRENCY) {
    const rate = getExchangeRateFromCollection(rates, sign, date);
    if (!rate) {
      throw Error('Could not get exchange rate');
    }
    exchangeRate = rate.value ?? 0;
  }
  return amount * exchangeRate;
};

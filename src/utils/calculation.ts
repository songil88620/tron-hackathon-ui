import { BigNumber } from 'bignumber.js';

export const unitToDecimalBalance = (amount: number | string, decimals: number) =>
    new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toNumber();

export const balanceToUnitByDecimals = (amount: number | string, decimals: number) =>
    Math.trunc(new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toNumber());
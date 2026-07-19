/* ============================================================
   Pixel&Games — Currency Exchange config
   The ONE place the coins<->USD rate is defined. Both api/exchange.js
   and api/admin.js (Exchange Requests admin actions) import this —
   nothing else should hardcode the rate.
   ============================================================ */

const COINS_PER_USD = 1000; // 1000 coins = $1

function coinsToUsd(coins) {
  const n = Number(coins) || 0;
  return Math.round((n / COINS_PER_USD) * 100) / 100; // round to cents
}

function isValidExchangeAmount(coins) {
  return Number.isInteger(coins) && coins >= COINS_PER_USD;
}

module.exports = { COINS_PER_USD, coinsToUsd, isValidExchangeAmount };
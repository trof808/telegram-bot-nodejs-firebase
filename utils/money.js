export const CURRENCIES = {
    RUB: 'RUB',
}

const currencyLang = {
    [CURRENCIES.RUB]: 'ru-RU'
}

export const money = (amount, currency) => {
    return new Intl.NumberFormat(currencyLang[currency], { style: 'currency', currency }).format(amount)
}
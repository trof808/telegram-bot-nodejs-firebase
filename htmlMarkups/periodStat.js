import { CURRENCIES, money } from '../utils/money.js';

export const periodStat = ({date, planned, notPlanned, incomeAmount, onCard, categories}) => {
    const cats = Object.entries(categories);
    return `
 __________________________________
|<strong>📆 Дата: </strong>${date}
|
|<strong>🏦 Пришло: </strong>${money(incomeAmount, CURRENCIES.RUB)}
|<strong>🔒 Запланировано: </strong>${money(planned, CURRENCIES.RUB)}
|<strong>💰 Не запланированно: </strong>${money(notPlanned, CURRENCIES.RUB)}
|
|<strong>💳 Всего на карте: </strong>${money(onCard, CURRENCIES.RUB)}
|<strong>💸 Свободных на карте: </strong>${money(notPlanned, CURRENCIES.RUB)}
|
|<strong>Категории:</strong>
${cats.map(([cat, amount]) => {
    return `|<strong>🔵 ${cat}: </strong>${money(amount, CURRENCIES.RUB)}\n`
}).reduce((result, current) => result += current, '')}
`
}
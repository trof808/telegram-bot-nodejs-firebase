import { CURRENCIES, money } from '../utils/money.js';

export const periodStat = ({date, planned, notPlanned, incomeAmount}) => {
    return `
<strong>📆 Дата: </strong>${date}
<strong>🏦 Пришло: </strong>${money(incomeAmount, CURRENCIES.RUB)}
<strong>🔒 Запланировано: </strong>${money(planned, CURRENCIES.RUB)}
<strong>💰 Не запланированно: </strong>${money(notPlanned, CURRENCIES.RUB)}
<strong>💳 Всего на карте: </strong>${money(notPlanned, CURRENCIES.RUB)}
<strong>💸 Свободных на карте: </strong>${money(notPlanned, CURRENCIES.RUB)}
`
}
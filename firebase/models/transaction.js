import { Timestamp } from "firebase/firestore";
import parse from 'date-fns/parse/index.js'

export class Transaction {
    constructor ({category, currency, amount, cashback, tag, date}) {
        this.category = category;
        this.currency = currency;
        this.amount = amount;
        this.cashback = cashback;
        this.tag = tag;
        this.date = date;
    }
    toString() {
        return this.date + ', ' + this.amount + ', ' + this.tag;
    }
}

export const transactionConverter = {
    toFirestore: (transaction) => {
        return {
            ...transaction,
            amount: parseFloat(transaction.amount.replace(',', '.')) || 0,
            cashback: parseFloat(transaction.cashback.replace(',', '.')) || 0,
            date: Timestamp.fromDate(parse(transaction.date, 'dd.MM.yyyy HH:mm:ss', new Date()))
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Transaction({...data});
    }
};
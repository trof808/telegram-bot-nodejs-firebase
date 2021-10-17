import { Timestamp } from "firebase/firestore";
import parse from 'date-fns/parse/index.js'

export class Plan {
    constructor({ date, incomeAmount, fundPlan }) {
        this.date = date;
        this.incomeAmount = incomeAmount;
        this.fundPlan = fundPlan;
    }

    get fundsAmount() {
        return Object.values(this.fundPlan).reduce((prev, current) => prev + current, 0);
    }

    get leftToSpend() {
        return this.incomeAmount - this.fundsAmount;
    }

    toString() {
        return this.date + ', ' + this.incomeAmount + ', ' + this.fundsAmount;
    }
}

export const planConverter = {
    toFirestore: (plan) => {
        return {
            ...plan,
            date: Timestamp.fromDate(parse(plan.date, 'dd.MM.yyyy', new Date()))
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Plan({...data});
    }
};
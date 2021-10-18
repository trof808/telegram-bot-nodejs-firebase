export class Statistic {
    #transactions = [];
    #plan = {};

    constructor(transactions, plan) {
        this.#transactions = transactions;
        this.#plan = plan;
    }

    get expensesAmount() {
        return this.#transactions.reduce((result, current) => result += current.amount, 0);
    }

    get leftMoneyForPlan() {
        return this.#plan.incomeAmount - this.expensesAmount;
    }

    get plan() {
        return this.#plan;
    }
}
import { getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";
import { transactionsRef } from "../firebase/index.js";
import { transactionConverter } from "../firebase/models/transaction.js";

export const getTransactionsForPeriod = async (from, to = Timestamp.now()) => {
    const q = query(
        transactionsRef.withConverter(transactionConverter),
        where("date", ">=", from),
        where("date", "<=", to),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}
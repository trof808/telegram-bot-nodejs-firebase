import { getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { plannerRef } from '../firebase/index.js';
import { planConverter } from '../firebase/models/plan.js';

/**
 * План на текущий период. С момента
 * последнего поступления и до сегодняшнего дня
 * 
 * @returns 
 */
export const getCurrentPeriodPlan = async () => {
    const q = query(
        plannerRef.withConverter(planConverter),
        where("date", "<=", Timestamp.now()),
        orderBy("date", "desc"),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data();
}
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { database } from './firebase/index.js';
import { Transaction, transactionConverter } from './firebase/models/transaction.js';
import { Plan, planConverter } from './firebase/models/plan.js';
import { parseCsv } from './utils/parseCsv.js';
import { splitLines } from './utils/splitLines.js';
import { TINKOFF_COLUMNS } from './constants.js';
import { periodStat } from './htmlMarkups/periodStat.js';
import format from 'date-fns/format/index.js';
import { getCurrentPeriodPlan } from './service/planner.service.js';

const bot = new Telegraf(process.env.BOT_TOKEN)

const getCurrentPeriodStat = async () => {
    const currentPeriodPlan = await getCurrentPeriodPlan();
    return currentPeriodPlan;
}

bot.start((ctx) => {
    ctx.reply(`
        Выбери действие.\nТакже можно:\n 1. Прислать выписку из тинька в формате csv\n 2. Запланировать расходы
    `, {
        reply_markup: {
            keyboard: [
                [{text: 'Текущий период'}]
            ]
        }
    })
});

bot.on('document', async (ctx) => {
    let results = [];

    const {file_id: fileId} = ctx.update.message.document;
    const fileUrl = await ctx.telegram.getFileLink(fileId);
    const response = await axios(fileUrl.href);
    results = parseCsv(response.data);
    console.log(results);
    console.log(results.length);
    results.forEach(async (value, index) => {
        const ref = doc(database, "transactions", value[TINKOFF_COLUMNS.PAYMENT_DATE]).withConverter(transactionConverter);
        await setDoc(ref, new Transaction({
            category: value[TINKOFF_COLUMNS.CATEGORY],
            currency: value[TINKOFF_COLUMNS.CURRENCY],
            amount: value[TINKOFF_COLUMNS.PAYMENT_AMOUNT],
            cashback: value[TINKOFF_COLUMNS.CASHBACK],
            tag: value[TINKOFF_COLUMNS.DESCRIPTION],
            date: value[TINKOFF_COLUMNS.PAYMENT_DATE]
        }));
    });
    
    ctx.reply('I read the file for you! The contents were:\n\n');
});

bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id)

  // Using context shortcut
  ctx.leaveChat()
})

bot.on('callback_query', (ctx) => {
  // Explicit usage
  ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

  // Using context shortcut
  ctx.answerCbQuery()
})

bot.on('inline_query', (ctx) => {
  const result = []
  // Explicit usage
  ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

  // Using context shortcut
  ctx.answerInlineQuery(result)
})

bot.action('current_period', async (ctx) => {
    ctx.deleteMessage();

});

bot.on('text', async (ctx) => {
    const lines = splitLines(ctx.message.text);
    console.log(lines);
    if (lines[0] === 'Текущий период') {
        ctx.deleteMessage();
        const result = await getCurrentPeriodStat();
        ctx.reply(
            periodStat({
                date: format(result.date.toDate(), 'dd.MM.yyyy'),
                planned: result.fundsAmount,
                notPlanned: result.leftToSpend,
                incomeAmount: result.incomeAmount
            }),
            {parse_mode: 'HTML'}
        );
    }
    if (lines[0] === 'Запланировать') {
        const date = lines[1];
        const incomeAmount = +lines[2];
        const fundPlan = {};
    
        for (let i = 3; i < lines.length; i++) {
            const splited = lines[i].split(':');
            fundPlan[splited[0]] = +splited[1];
        }
    
        const plan = new Plan({date, incomeAmount, fundPlan})
    
        const docRef = doc(database, "planner", date).withConverter(planConverter);
        try {
            await setDoc(docRef, plan);
        } catch(e) {
            console.log(e);
        }
        ctx.reply(`Запланировано на ${plan.date}\nНераспланировано - ${plan.leftToSpend}`)
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

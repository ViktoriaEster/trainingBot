require('dotenv').config();
const {Bot, Keyboard, InlineKeyboard, GrammyError, HttpError} = require("grammy");
const {getRandomQuestion, getCorrectAnswer} = require('./utils');


const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
    const startKeybord = new Keyboard()
        .text('HTML')
        .text('CSS')
        .row()
        .text('React')
        .text("JavaScript")
        .row()
        .text('Случайный вопрос')
        .resized();
    await ctx.reply('Привет! Я помогу тебе подготовиться к интервью по Frontend dev');
    await ctx.reply('Выбери тему вопроса в меню ниже 👇',
        {reply_markup: startKeybord});

});

bot.hears(['HTML', 'CSS', 'React', 'JavaScript', 'Случайный вопрос'], async (ctx) => {
    const topic = ctx.message.text.toLowerCase();
    const {question, questionTopic} = getRandomQuestion(topic);

    let inlineKeyboard;
    if (question.hasOptions) {
        inlineKeyboard = new InlineKeyboard();
        question.options.forEach(option => {
            inlineKeyboard.text(option.text, JSON.stringify({
                t: questionTopic,
                q: question.id,
                c: option.isCorrect ? 1 : 0,
                o: question.hasOptions ? 1 : 0
            }));
            inlineKeyboard.row();
        });
    } else {
        inlineKeyboard = new InlineKeyboard().text('Узнать ответ', JSON.stringify({
            t: questionTopic,
            q: question.id,
            o: 0
        }));
    }
    await ctx.reply(question.text, {reply_markup:inlineKeyboard});
});

bot.on('callback_query:data', async (ctx) => {
    const { t: topic, q: questionId, c: isCorrect, o: isOption } = JSON.parse(ctx.callbackQuery.data);
    const answer = getCorrectAnswer(topic, questionId);

    if (!isOption) {
        await ctx.reply(`Правильный ответ: ${answer}`, { parse_mode: 'HTML' });
    } else if (isCorrect) {
        await ctx.reply(`Верно ✅`, { parse_mode: 'HTML' });
    } else {
        await ctx.reply(`Не верно ❌ Правильный ответ: ${answer}`, { parse_mode: 'HTML' });
    }

    await ctx.answerCallbackQuery();
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start();
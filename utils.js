const questions = require('./questions.json');
const {Random} = require('random-js');

const getRandomQuestion = (topic) => {
    const random = new Random();
    const topicLC = topic.toLowerCase();
    let questionTopic;
    if (!questions[topicLC]) {
        const topics= Object.keys(questions);
    const randomTopicIndex = random.integer(0, topics.length-1);
    questionTopic = topics[randomTopicIndex];
    }
    else questionTopic = topicLC;

    const randomQuestionIndex = random.integer(0, questions[questionTopic].length-1);
    const question = questions[questionTopic][randomQuestionIndex];
    return {question, questionTopic};
};

    const getCorrectAnswer = (topic, id) => {
    const question = questions[topic].find(item => item.id===id);

    if (!question.hasOptions) {
        return question.answer;
    }
    else {const correctAnswer = question.options.find(item => item.isCorrect===true);
          return correctAnswer.text; }
};

module.exports = {getRandomQuestion, getCorrectAnswer};
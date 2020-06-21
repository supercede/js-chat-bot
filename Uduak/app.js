const replyInput = document.getElementById('reply');
const userForm = document.getElementById('user-form');
const messageContainer = document.querySelector('.message');
const container = document.querySelector('.container');
const bodyContainer = document.querySelector('.body');

bodyContainer.scrollTop = bodyContainer.scrollHeight;

let count = 0;
let current, jokeList, triviaList;

const replies = {
  yes: [
    'Ah! sly one, Trying out your work I see...',
    'Expecting an upgrade soon :(...',
    'You lie...',
  ],
  no: [
    'Oh well...',
    "Let's get down to why you're here then...",
    'You probably lie...',
  ],
  followUp: [
    "You're here because you're probably bored, or just checking me out <br> I'm good with jokes and trivias. Reply with your choice",
    'Would you like a joke or trivia?',
  ],
  joke: [
    'Get ready to be blown apart by my comedic brilliance...',
    'Coming up - a mindblowing dad joke...',
    'Make I burst your brain...',
  ],
  trivia: [
    "Alright, It's pretty easy - True or False:",
    'Okay Einstein!, You just need to answer true or false:',
    'True or False:',
    "OK... Just answer True or False, don't try to discombobulate my basic algorithm:",
    "Alright then. <br> PS: I have been programmed to only respond to True/False answers to this, Don't make it hard please",
  ],
  confused: [
    "I'm not as smart as you think I am, do reply accordingly...",
    'It seems like you are expcting a few lines of code to hold a brillant conversation, be considerate 😃...',
    'I can give you jokes and trivia but I cannot reply to this...',
    'You overestimate my conversational skills sensei...',
  ],
};

const formatReply = (message, sender) => {
  if (sender === 'uduak') {
    const p = document.createElement('p');
    p.className = 'send content float-left';
    p.innerHTML = message;
    return p;
  } else {
    const p = document.createElement('p');
    p.className = 'reply send content float-right bg-info';
    p.innerHTML = message;
    return p;
  }
};

const checkStrIncludes = (str, substr) => substr.some((v) => str.includes(v));
const randomiseArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

const handleReply = (input) => {
  messageContainer.appendChild(input);
  bodyContainer.scrollTop = bodyContainer.scrollHeight;
};

const handleUduakReply = (input) => setTimeout(() => handleReply(input), 300);

const sendResponse = (reply, sender) => {
  const response = formatReply(reply, sender);

  if (sender === 'uduak') return handleUduakReply(response);

  return handleReply(response);
};

const getJokes = async () => {
  const api = 'https://official-joke-api.appspot.com/jokes/ten';
  const response = await fetch(api);
  const result = await response.json();
  return result;
};

const getTrivia = async () => {
  const api = 'https://opentdb.com/api.php?amount=10&type=boolean';
  const response = await fetch(api);
  const result = await response.json();
  return result.results;
};

// const trivia = getTrivia();

// console.log(jokes);

const sendJoke = (item) => {
  const { setup, punchline } = item;

  sendResponse(setup, 'uduak');
  setTimeout(() => sendResponse(punchline, 'uduak'), 400);
};

const sendTrivia = (item) => {
  const { question, correct_answer } = item;
  console.log({ question, correct_answer });

  sendResponse(question, 'uduak');
};

const uduak = () =>
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const reply = replyInput.value;
    let response, game;
    console.log(game);

    sendResponse(reply, 'user');

    if (count === 0) {
      count++;
      if (checkStrIncludes(reply.toLowerCase(), ['yes', 'yeah', 'of course'])) {
        response = randomiseArr(replies.yes);
        sendResponse(response, 'uduak');
      } else if (
        checkStrIncludes(reply.toLowerCase(), ['no', 'not', 'nah', 'at all'])
      ) {
        response = randomiseArr(replies.no);
        sendResponse(response, 'uduak');
      } else {
        response = randomiseArr(replies.confused);
        sendResponse(response, 'uduak');
      }
      response = randomiseArr(replies.followUp);
      setTimeout(() => sendResponse(response, 'uduak'), 500);
    } else {
      if (checkStrIncludes(reply.toLowerCase(), ['joke', 'joke', 'laugh'])) {
        game = 'jokes';

        response = randomiseArr(replies.joke);
        sendResponse(response, 'uduak');
        setTimeout(() => sendJoke(randomiseArr(jokeList)), 300);
      } else if (
        checkStrIncludes(reply.toLowerCase(), ['trivia', 'triva', 'trivial'])
      ) {
        game = 'trivia';
        response = randomiseArr(replies.trivia, 'uduak');
        sendResponse(response, 'uduak');

        setTimeout(() => sendTrivia(randomiseArr(triviaList)), 300);
      } else {
        response = randomiseArr(replies.confused);
        sendResponse(response, 'uduak');
        response = randomiseArr(replies.followUp);
        setTimeout(() => sendResponse(response, 'uduak'), 300);
      }
    }
    userForm.reset();
    console.log(reply);
  });

window.addEventListener('load', async () => {
  jokeList = await getJokes();
  triviaList = await getTrivia();
  console.log(jokeList);
  console.log(triviaList);
  uduak();
});

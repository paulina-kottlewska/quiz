import './App.css';
import React from 'react';
import {nanoid} from "nanoid";
import Question from './Question';

function App() {
  const [startQuiz, setStartQuiz] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [checkAnswers, setCheckAnswers] = React.useState(false);
  const [newGame, setNewGame] = React.useState(false);
  const [disabledBtn, setDisabledBtn] = React.useState(true);
  const [score, setScore] = React.useState(0);

  // Fetch the questions from API and create an object with data for each question. 
  React.useEffect(() => {
    async function getQuestions() {
      const res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy");
      const data = await res.json();
      const quizData = data.results.map(result => (
        {
          id: nanoid(),
          question: result.question,
          correct: result.correct_answer,
          answers: shuffleAnswers([result.correct_answer, ...result.incorrect_answers]),
          usersAnswer: " ",
          selected: false
        }
      ))
      setQuestions(quizData);
      setCheckAnswers(false);
    }
    getQuestions();
  }, [newGame])

  // If every answer is selected, enable the button; otherwise keep it disabled.
  React.useEffect(() => {
    setDisabledBtn(questions.every(question => question.selected) ? false : true);
  }, [questions])

  // Once the start button is clicked, change the state to true to display the page with questions.
  function start() {
    return setStartQuiz(prevState => !prevState)
  }

  // Change the order of the answers randomly.
  function shuffleAnswers(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Update the 'usersAnswer' to the chosen answer and set 'selected' to true based on the question's ID.
  function handleSelected(qId, answer) {
    setQuestions(questions.map(question => (
      question.id === qId ? {...question, selected: true, usersAnswer: answer} : question
      ))
    )
  }

  // Change the state of the 'check answers' button, compare the user's answers with the correct answers, count the points, and update the score.
  function check() {
    setCheckAnswers(prevState => !prevState);

    let correct = 0;

    for(let i = 0; i < questions.length; i++) {
      if(questions[i].usersAnswer === questions[i].correct) {
        correct++;
      }
    }

    setScore(correct);
  }

  // Change the state of 'new game' to true to load a new set of questions, and reset the score to 0.
  function playAgain() {
    setNewGame(prevState => !prevState);
    setScore(0);
    
  }

  const quizElements = questions.map(question => (
    <Question 
      key={nanoid()}
      id={question.id}
      question={question.question}
      correct={question.correct}
      answers={question.answers}
      usersAnswer={question.usersAnswer}
      handleSelected={handleSelected}
      checkAnswers={checkAnswers}
     />
  ))
  
  // Based on the 'startQuiz' state, display the start page or the page with questions.
  return (
    <main className="container">
      {startQuiz ? 
      <>
         <div className="questions-container">
            {quizElements}
         </div>
         <div className="buttons-container">
          {checkAnswers && <p className="score">You scored {score}/5 correct answers</p>}
          {checkAnswers ? 
          <button className="play-btn" onClick={playAgain}>Play again</button> 
          : 
          <button className="check-btn" onClick={check} disabled={disabledBtn}>Check answers</button>}
         </div>
      </>
      :
      <>
        <h1 className="quiz-title">Quizzcal</h1>
        <p className="quiz-description">Click the button below and check your knowledge</p>
        <button className="start-btn" onClick={start}>Start quiz</button>
      </>
      }
    </main>
 
  );
}

export default App;

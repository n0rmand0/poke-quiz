/** @jsxImportSource @emotion/react */
import logo from "./logo.png";
import "./styles/global.scss";
import Question from "./Question";
import { pokedex } from "./pokedex";
import { useEffect, useState } from "react";
let startSlide: any, // timeout for starting gameplay
  pauseSlide: any, // timeout for pausing gameplay
  nextSlide: any, // timeout for go to next slide
  startTime: any, // Date of start
  stopTime: any; // Date of finish
let quizLength = 15;
let questionTimeout = 6000;

export default function App() {
  const [mode, setMode] = useState(0); // 0=start menu // 1=play // 2=end game menu
  const [quiz, setQuiz] = useState<any[]>([]); // contains all the questions to build the quiz
  const [progress, setProgress] = useState(0); // tracks current question/slide
  const [visible, setVisible] = useState(true); // is question visible
  const [silhouette, setSilhouette] = useState(true); // is pokemon blacked out
  const [time, setTime] = useState(true); // is timer ui visible
  const [score, setScore] = useState(0); // trakcs score
  const [correct, setCorrect] = useState(0); // tracks numer of correct answers
  const [alert, setAlert] = useState(""); // sets alert message
  const [lock, setLock] = useState(false); // locks slide so multiple selections cannot be made

  // on load
  useEffect(() => {
    buildQuiz();
  }, []);

  // on progress change
  useEffect(() => {
    if (mode === 1) {
      setAlert("");
      setTime(true);
      setSilhouette(true);
      setLock(false);
      startTime = new Date();
      startSlide = setTimeout(() => {
        setAlert("Out of Time!");
        nextQuestion();
      }, questionTimeout);
    }
  }, [mode, progress]);

  //// building the quiz.  Each quiz is randomized from 800+ pokemon.
  function buildQuiz() {
    let answerKey: any[] = [];
    let questions: any[] = [];
    getRandomUniqueAnswers();

    // get random pokemon from pokedex. Add them to answer key.
    function getRandomUniqueAnswers() {
      let key = Math.floor(Math.random() * (pokedex.length - 1));
      // ensure key is unique (no repeats)
      if (answerKey.indexOf(key) < 0) {
        answerKey.push(key);
      } else {
        // not unique - start over
        console.log("repeat answer");
        getRandomUniqueAnswers();
        return;
      }
      // repeat until quizLength unique answers
      if (answerKey.length > quizLength - 1) {
        // done, go to next step
        getOptions();
      } else {
        getRandomUniqueAnswers();
      }
    }
    // get options and build question data
    function getOptions() {
      answerKey.map((k, i) => {
        // for each key, return 4 random wrong options that are not in the answer key
        let options: any[] = [];
        function getRandomUniqueOptions() {
          let key = Math.floor(Math.random() * (pokedex.length - 1));
          // ensure key is unique (no repeats)
          if (answerKey.indexOf(key) < 0 && options.indexOf(key) < 0) {
            options.push(key);
          } else {
            // not unique - start over
            console.log("repeat options");
            getRandomUniqueOptions();
            return;
          }
          // repeat until 4 unique options
          if (options.length > 3) {
            // add correct answer and shuffle
            options.push(k);
            // this will enable only 1 answer for question 1
            if (i === 0) {
              options = [k];
            }
            shuffleArray(options);
            // add question data to question array
            questions.push({
              answer: pokedex[k],
              options: options.map((o) => pokedex[o]),
            });
            return;
          } else {
            getRandomUniqueOptions();
          }
        }
        getRandomUniqueOptions();
      });
      console.log(answerKey, questions);
      setQuiz(questions);
    }
  } // end buildQuiz

  //// Randomize array in-place using Durstenfeld shuffle algorithm
  function shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function handleSelect(selection: string) {
    if (lock) {
      return;
    }
    // check for right selection and add points
    if (selection === quiz[progress].answer.name) {
      stopTime = new Date();
      // calculate points - add bonus for quick time
      let roundPoints = Math.floor(
        5000 + 5000 * (1 - (stopTime - startTime) / questionTimeout)
      );
      let updatedScore = score + roundPoints;
      setScore(updatedScore);
      setCorrect(correct + 1);
      setAlert("Correct!");
      console.log("Correct!");
      console.log(
        "round:",
        roundPoints,
        "total:",
        updatedScore,
        "percent:",
        (correct + 1) / quizLength
      );
      nextQuestion();
    } else {
      setAlert("Wrong");
      console.log("Incorrect!");
      console.log("round:", 0, "total:", score);
      nextQuestion();
    }
  }

  function nextQuestion() {
    // clear all timeouts
    clearTimeout(startSlide);
    clearTimeout(pauseSlide);
    clearTimeout(nextSlide);
    // turn off timer and show image
    setSilhouette(false);
    setTime(false);
    // lock question so user cannot select again
    setLock(true);

    // pause so user can see image, fade out, then show next
    if (progress < quizLength - 1) {
      pauseSlide = setTimeout(() => {
        setVisible(false);
        setSilhouette(true);
        setProgress(progress + 1);
        setAlert("");
      }, 2500);
      nextSlide = setTimeout(() => {
        setVisible(true);
        startTime = new Date();
      }, 2700);
    } else {
      // end game
      setTimeout(() => {
        setMode(2);
        buildQuiz();
        setProgress(0);
      }, 2000);
    }
  }

  return (
    <div className="app">
      <h1 className={mode === 1 ? "header header--small" : "header"}>
        Who's that <img src={logo} alt="Pokémon" />
        <span>?</span>
      </h1>

      {mode === 0 && (
        <div>
          <a
            className="button button--large"
            onClick={() => {
              setMode(1);
            }}
          >
            Start
          </a>
          <div className="instructions">
            <h3>Instructions:</h3>
            <h4>
              Guess the hidden Pokémon as quickly as you can.
              <br /> You only have 5 seconds for each round.
              <br /> The quicker you answer, the more points you will earn!
              <br /> Every game is random, so keep trying!
            </h4>
          </div>
        </div>
      )}
      {mode === 1 && visible && quiz[0] && (
        <>
          <a
            className="back-button button--link"
            href=""
            onClick={() => setMode(0)}
          >
            Back
          </a>
          <h2 className="progress">
            {progress + 1}/{quizLength}
          </h2>
          {alert && <div className="alert">{alert}</div>}
          <div className="timer">
            <div className={time ? "timer__progress" : ""}></div>
          </div>
          <Question
            onSelect={(e: any) => handleSelect(e)}
            data={quiz[progress]}
            silhouette={silhouette}
          />
        </>
      )}
      {mode === 2 && (
        <div>
          <h1 className="score">
            You scored <span>{score}</span>
          </h1>
          <h2>
            You answered {Math.floor((correct / quizLength) * 100)}% Correct
          </h2>
          <br />

          <a
            className="button button--large"
            onClick={() => {
              setScore(0);
              setMode(0);
              setCorrect(0);
            }}
          >
            Play Again
          </a>
        </div>
      )}
    </div>
  );
}

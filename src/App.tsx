/** @jsxImportSource @emotion/react */
import logo from "./logo.png";
import "./styles/global.scss";
import MenuScreen from "./MenuScreen";
import QuizScreen from "./QuizScreen";
import EndScreen from "./EndScreen";
import { pokedex } from "./pokedex";
import { useEffect, useState } from "react";
let startQuestionTimeout: any, // timeout for starting gameplay
  pauseQuestionTimeout: any, // timeout for pausing gameplay
  startTime: any, // Date of start
  stopTime: any; // Date of finish
let quizLength = 3; // number of questions
let questionTimeout = 6000; // time (ms) for each question

export default function App() {
  const [screen, setScreen] = useState(0); // 0=start menu // 1=play // 2=end game menu
  const [quiz, setQuiz] = useState<any[]>([]); // contains all the questions to build the quiz
  const [progress, setProgress] = useState(0); // tracks current question
  const [visible, setVisible] = useState(true); // is question visible
  const [silhouette, setSilhouette] = useState(true); // is pokemon blacked out
  const [timer, setTimer] = useState(true); // is timer ui visible
  const [score, setScore] = useState(0); // tracks score
  const [correct, setCorrect] = useState(0); // tracks numer of correct answers
  const [alert, setAlert] = useState(""); // sets alert message
  const [lock, setLock] = useState(false); // locks slide so multiple selections cannot be made
  const [hiScores, setHiScores] = useState<any[]>([]); // track high scores

  // on load
  useEffect(() => {
    buildQuiz();
    let storage = localStorage.getItem("hiScores");
    if (storage) {
      setHiScores(JSON.parse(storage));
    }
  }, []);

  // on screen change
  useEffect(() => {
    if (screen === 2) {
      // add score to hi scores
      let date = new Date();
      let dateString =
        date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
      let updatedHighScores: any[] = hiScores;
      let newScore = { score: score, date: dateString };
      updatedHighScores.push(newScore);
      // sort scores
      updatedHighScores.sort((a, b) => b.score - a.score);
      // only keep top 3 scores
      updatedHighScores = updatedHighScores.slice(0, 3);
      localStorage.setItem("hiScores", JSON.stringify(updatedHighScores));
      setHiScores(updatedHighScores);
    }
  }, [screen]);

  // on progress change
  useEffect(() => {
    if (screen === 1) {
      setAlert("");
      setTimer(true);
      setSilhouette(true);
      setLock(false);
      startTime = new Date();
      startQuestionTimeout = setTimeout(() => {
        setAlert("Out of Time!");
        nextQuestion();
      }, questionTimeout);
    }
  }, [progress]);

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
            // not unique - try again
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
      // console.log(answerKey, questions);
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

  //// handle selection of an answer ////
  function handleSelect(selection: string) {
    if (lock) {
      return;
    }
    // check for right selection and add points
    if (selection === quiz[progress].answer.name) {
      stopTime = new Date();
      // calculate points - add bonus for quick time
      let roundPoints = Math.floor(
        500 + 500 * (1 - (stopTime - startTime) / questionTimeout)
      );
      let updatedScore = score + roundPoints;
      setScore(updatedScore);
      setCorrect(correct + 1);
      setAlert("Correct!");
      console.log("Correct!");
      console.log("round:", roundPoints, "total:", updatedScore);
      nextQuestion();
    } else {
      setAlert("Wrong");
      console.log("Incorrect!");
      nextQuestion();
    }
  }

  //// go to next question
  function nextQuestion() {
    // clear all timeouts
    clearTimeout(startQuestionTimeout);
    clearTimeout(pauseQuestionTimeout);
    // turn off timer and show image
    setSilhouette(false);
    setTimer(false);
    // lock question so user cannot select again
    setLock(true);
    // pause so user can see image, then show next
    if (progress < quizLength - 1) {
      pauseQuestionTimeout = setTimeout(() => {
        setVisible(false);
        setSilhouette(true);
        setProgress(progress + 1);
        setAlert("");
        // delay before showing next
        setTimeout(() => {
          setVisible(true);
          startTime = new Date();
        }, 200);
      }, 2500);
    } else {
      // end game
      setTimeout(() => {
        setScreen(2);
        buildQuiz();
        setProgress(0);
      }, 2000);
    }
  }

  //// reset the game
  function resetGame() {
    setScore(0);
    setScreen(0);
    setCorrect(0);
  }

  return (
    <div className="app">
      <h1 className={screen === 1 ? "header header--small" : "header"}>
        Who's that <img src={logo} alt="Pokémon" />
        <span>?</span>
      </h1>

      {screen === 0 && <MenuScreen setScreen={(e) => setScreen(e)} />}
      {screen === 1 && quiz[0] && (
        <QuizScreen
          setScreen={(e: number) => setScreen(e)}
          progress={progress}
          quizLength={quizLength}
          timer={timer}
          visible={visible}
          onSelect={(e: string) => handleSelect(e)}
          silhouette={silhouette}
          alert={alert}
          data={quiz[progress]}
        />
      )}
      {screen === 2 && (
        <EndScreen
          setScreen={(e: number) => setScreen(e)}
          progress={progress}
          quizLength={quizLength}
          score={score}
          hiScores={hiScores}
          correct={correct}
          resetGame={() => resetGame()}
        />
      )}
    </div>
  );
}

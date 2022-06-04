/** @jsxImportSource @emotion/react */
import "./styles/global.scss";
import "./styles/modules/app.scss";
import Question from "./Question";
import { pokedex } from "./pokedex";
import { useEffect, useState } from "react";
let startSlide: any, pauseSlide: any, nextSlide: any;
let startTime: any, stopTime: any;

export default function App() {
  const [mode, setMode] = useState(0); // 0 = start menu // 1 = play // 2 = end game menu
  const [quiz, setQuiz] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [silhouette, setSilhouette] = useState(true);
  const [time, setTime] = useState(true);
  const [score, setScore] = useState(0);

  // on load
  useEffect(() => {
    buildQuiz();
  }, []);

  // on progress change
  useEffect(() => {
    if (mode === 1) {
      setTime(true);
      startTime = new Date();
      startSlide = setTimeout(() => {
        setSilhouette(true);
        nextQuestion(false);
      }, 5000);
    }
  }, [mode, progress]);

  //// building the quiz.  Each quiz is randomized from 800+ pokemon.
  function buildQuiz() {
    let answerKey: any[] = [];
    let questions: any[] = [];
    getRandomUniqueAnswers();

    // get 10 random pokemon from pokedex. Add them to answer key.
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
      // repeat until 10 unique answers
      if (answerKey.length > 9) {
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
    // console.log(selection);
    if (selection === quiz[progress].answer.name) {
      console.log("Correct!");
      nextQuestion(true);
    } else {
      console.log("Incorrect!");
      nextQuestion(false);
    }
  }

  function nextQuestion(correct: boolean) {
    stopTime = new Date();
    // clear all timeouts
    clearTimeout(startSlide);
    clearTimeout(pauseSlide);
    clearTimeout(nextSlide);
    // turn off timer and show image
    setSilhouette(false);
    setTime(false);
    // calculate score - subtract milliseconds spent on question
    let roundPoints = 10000 - (stopTime - startTime);
    if (correct) {
      setScore(score + roundPoints);
    }
    // pause so user can see image, fade out, then show next
    console.log(progress, score);
    if (progress < 9) {
      pauseSlide = setTimeout(() => {
        setVisible(false);
        setSilhouette(true);
      }, 2000);
      nextSlide = setTimeout(() => {
        setVisible(true);
        setProgress(progress + 1);
        startTime = new Date();
      }, 2200);
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
    <div>
      <h1>Who's that Pokemon</h1>

      {mode === 1 && visible && quiz[0] && (
        <>
          <h2>{progress + 1}/10</h2>
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
      {mode === 0 && (
        <div>
          <a
            onClick={() => {
              setMode(1);
            }}
          >
            Play
          </a>
        </div>
      )}
      {mode === 2 && (
        <div>
          <a
            onClick={() => {
              setScore(0);
              setMode(1);
            }}
          >
            Play Again
          </a>
          <h1>{score}</h1>
        </div>
      )}
    </div>
  );
}

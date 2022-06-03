/** @jsxImportSource @emotion/react */
import "./styles/global.scss";
import "./styles/modules/app.scss";
import Question from "./Question";
import { pokedex } from "./pokedex";
import { useEffect, useState } from "react";

export default function App() {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(true);

  // on load
  useEffect(() => {
    buildQuiz();
  }, []);

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
    } else {
      console.log("Incorrect!");
    }

    setTime(false);
    // wait 2 seconds
    setTimeout(() => {
      setVisible(true);
      setProgress(progress + 1);
    }, 2000);
    // then show next
    setTimeout(() => {
      setVisible(false);
      setTime(true);
    }, 2500);
  }

  return (
    <div>
      <h1>Who's that Pokemon</h1>
      <h2>{progress + 1}/10</h2>
      <div className="timer">
        <div className={time ? "timer__progress" : ""}></div>
      </div>
      {!visible && quiz[0] && (
        <Question onSelect={(e) => handleSelect(e)} data={quiz[progress]} />
      )}
    </div>
  );
}

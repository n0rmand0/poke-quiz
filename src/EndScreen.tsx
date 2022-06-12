export default function EndScreen(props: any) {
  return (
    <div>
      <div className="end-screen">
        <div>
          <h1 className="score">
            {props.hiScores[0] && props.hiScores[0].score <= props.score
              ? "High Score!"
              : "You Scored"}{" "}
            <span>{props.score}</span>
          </h1>
          <h3 className="percentage">
            You answered {Math.floor((props.correct / props.quizLength) * 100)}%
            Correct
          </h3>
          <br />
        </div>
        <div>
          <table className="score-table">
            <thead>
              <tr>
                <td>Top Scores</td>
                <td>Date</td>
              </tr>
            </thead>
            <tbody>
              {props.hiScores.map((h: any, key: number) => (
                <tr key={key}>
                  <td>{h.score}</td>
                  <td>{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <a
        className="button button--large"
        onClick={() => {
          props.setScreen(0);
        }}
      >
        Menu
      </a>
    </div>
  );
}

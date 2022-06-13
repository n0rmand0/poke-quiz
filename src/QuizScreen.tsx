export default function QuizScreen(props: any) {
  return (
    <>
      <a
        className="back-button button--link"
        onClick={() => props.setScreen(0)}
      >
        Back
      </a>
      <h2 className="progress">
        {props.progress + 1} / {props.quizLength}
      </h2>
      {props.alert && <div className="alert">{props.alert}</div>}
      <div className="timer">
        <div className={props.timer ? "timer__progress" : ""}></div>
      </div>

      <div className="question">
        <div className="question__image">
          <div className="question__image__burst"></div>
          <div className="question__image__burst2"></div>

          {props.visible && (
            <img
              className={props.silhouette ? "is-hidden" : ""}
              src={props.question.answer.image}
              alt={props.question.answer.name}
            />
          )}
        </div>
        <ul className="question__buttons">
          {props.question.options.map((o: any, key: number) => (
            <li key={key}>
              <a
                className={
                  !props.silhouette && props.question.answer.name === o.name
                    ? "button button--reveal"
                    : "button"
                }
                onClick={() => {
                  props.onSelect(o.name);
                }}
              >
                {o.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

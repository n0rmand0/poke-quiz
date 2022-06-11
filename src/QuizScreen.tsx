export default function QuizScreen(props: any) {
  return (
    <>
      <a
        className="back-button button--link"
        href=""
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
      {props.visible && (
        <div className="question">
          <div className="question__image">
            <div className="question__image__burst"></div>
            <div className="question__image__burst2"></div>
            <img
              className={props.silhouette ? "is-hidden" : ""}
              src={props.data.answer.image}
              alt=""
            />
          </div>

          <ul className="question__buttons">
            {props.data.options.map((o: any, key: number) => (
              <li>
                <a
                  className={
                    !props.silhouette && props.data.answer.name === o.name
                      ? "button button--reveal"
                      : "button"
                  }
                  key={key}
                  onClick={() => {
                    console.log("gains");
                    props.onSelect(o.name);
                  }}
                >
                  {o.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

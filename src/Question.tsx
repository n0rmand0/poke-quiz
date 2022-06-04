import { useEffect, useState } from "react";

export default function Question(props: any) {
  //   useEffect(() => {}, [props.data]);

  return (
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
                props.onSelect(o.name);
              }}
            >
              {o.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import "./styles/modules/question.scss";

export default function Question(props: any) {
  //   useEffect(() => {}, [props.data]);

  return (
    <div className="question">
      <img
        className={props.silhouette ? "is-hidden" : ""}
        src={props.data.answer.image}
        alt=""
      />
      <ul>
        {props.data.options.map((o, key) => (
          <li
            className="button"
            key={key}
            onClick={() => {
              props.onSelect(o.name);
            }}
          >
            {o.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import "./styles/modules/question.scss";

export default function Question(props: any) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(true);
  }, [props.data]);

  return (
    <div className="question">
      <img
        className={hidden ? "is-hidden" : ""}
        src={props.data.answer.image}
        alt=""
      />
      <ul>
        {props.data.options.map((o, key) => (
          <li
            key={key}
            onClick={() => {
              setHidden(false);
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

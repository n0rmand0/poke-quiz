export default function MenuScreen(props: any) {
  return (
    <div>
      <a
        className="button button--large"
        onClick={() => {
          props.startGame();
        }}
      >
        Start
      </a>
      <div className="instructions">
        <h2>Instructions:</h2>
        <h4>
          Guess the hidden Pokémon as quickly as you can.
          <br /> You only have 5 seconds for each round.
          <br /> The quicker you answer, the more points you will earn!
          <br /> Every game is random, so keep trying!
        </h4>
      </div>
    </div>
  );
}

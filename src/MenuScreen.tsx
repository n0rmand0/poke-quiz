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
        <p>
          Guess the hidden Pokémon as quickly as you can. You only have 5
          seconds for each round. The quicker you answer, the more points you
          will earn!
        </p>
        <p>Every game is random, so keep trying!</p>
      </div>
    </div>
  );
}

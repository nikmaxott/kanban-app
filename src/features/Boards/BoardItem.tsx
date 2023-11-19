import { Board } from ".";
const BoardItem = ({ board }: { board: Board }) => {
  return (
    <div>
      <h2 className="text-xl">{board.name}</h2>
      <h3 className="text-xs">{board.description}</h3>
    </div>
  );
};

export default BoardItem;

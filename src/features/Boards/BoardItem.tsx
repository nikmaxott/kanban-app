import { useEffect, useState } from "react";
import { supabase } from "../../helpers/supabase";
import { Board } from ".";

const BoardItem = ({ board }: { board: Board }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getColumns() {
      setLoading(true);
      const { data: columns, error } = await supabase
        .from("columns")
        .select("*")
        .eq("board_id", board.id);

      if (error) {
        console.warn(error);
      } else if (columns) {
        setColumns(columns);
      }

      setLoading(false);
    }

    getColumns();
  }, []);

  return (
    <div>
      <h2 className="text-xl">{board.name}</h2>
      <h3 className="text-xs">{board.description}</h3>
      {loading ? (
        <p>Loading</p>
      ) : (
        columns.map((column) => <div>{column.name}</div>)
      )}
    </div>
  );
};

export default BoardItem;

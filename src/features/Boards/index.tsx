import { useEffect, useState } from "react";
import { supabase } from "../../helpers/supabase";
import { Session } from "@supabase/supabase-js";

export default function BoardView() {
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    async function getBoard() {
      setLoading(true);

      const { data: boards, error } = await supabase
        .from("boards")
        .select(`name, id, description`);

      if (error) {
        console.warn(error);
      } else if (boards) {
        setBoards(boards);
      }

      setLoading(false);
    }

    getBoard();
  }, []);

  return (
    <>
      <h1 className="text-xl">Board View</h1>
      {boards.map((board) => (
        <BoardItem board={board} />
      ))}
    </>
  );
}

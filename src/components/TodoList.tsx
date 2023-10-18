import { useEffect, useState } from "react";
import { supabase } from "../helpers/supabase";
import { Todo } from "../type";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>();

  useEffect(() => {
    async function getList() {
      setLoading(true);

      const { data: todos, error } = await supabase
        .from("todos")
        .select(`task, is_complete, inserted_at, id, end_date`);

      if (error) {
        console.warn(error);
      } else if (todos) {
        setTodos(todos);
      }

      setLoading(false);
    }

    getList();
  }, []);

  // useEffect(() => {}, [todos]);

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {todos
            ?.filter((val) => !val.is_complete)
            .map((task: Todo) => <TodoItem item={task} key={task.id} />)}

          <h2 className="text-xl mt-4">Done</h2>
          {todos
            ?.filter((val) => val.is_complete)
            .map((task: Todo) => <TodoItem item={task} key={task.id} />)}
        </>
      )}
    </>
  );
}

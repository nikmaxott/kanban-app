import { useEffect, useRef, useState } from "react";
import { supabase } from "../helpers/supabase";
import { Todo } from "../type";
import TodoItem from "./TodoItem";
import { ItemModal } from "./ItemModal";

export default function TodoList() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentItem, setCurrentItem] = useState<Todo>();

  const addDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    async function getList() {
      setLoading(true);

      const { data: todos, error } = await supabase
        .from("todos")
        .select(`task, is_complete, inserted_at, id, end_date, start_date`);

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
          <div className="w-full flex justify-end">
            <button
              className="inline align-middle justify-center rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4"
              onClick={() => {
                setCurrentItem(undefined);
                addDialog.current?.showModal();
              }}
            >
              <i className="ri-add-line mr-2 "></i>Add Dog
            </button>
          </div>
          {todos
            ?.filter((val) => !val.is_complete)
            .map((task: Todo) => (
              <TodoItem
                item={task}
                key={task.id}
                setCurrentItem={setCurrentItem}
                dialog={addDialog}
              />
            ))}

          <h2 className="text-xl mt-4">Done</h2>
          {todos
            ?.filter((val) => val.is_complete)
            .map((task: Todo) => (
              <TodoItem
                item={task}
                key={task.id}
                setCurrentItem={setCurrentItem}
                dialog={addDialog}
              />
            ))}
        </>
      )}
      <ItemModal
        addDialog={addDialog}
        todos={todos}
        setTodos={setTodos}
        item={currentItem}
      />
    </>
  );
}

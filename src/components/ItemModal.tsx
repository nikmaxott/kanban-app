import { FormEvent, RefObject, useEffect, useState } from "react";
import { Todo } from "../type";
import { supabase } from "../helpers/supabase";
import { Session } from "@supabase/supabase-js";

export function ItemModal({
  addDialog,
  todos,
  setTodos,
  item,
}: {
  addDialog: RefObject<HTMLDialogElement>;
  setTodos: (dogs: Todo[]) => void;
  todos?: Array<Todo>;
  item?: Todo;
}): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>();

  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    if (!item) {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${
        date.getMonth() >= 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1).toString()
      }-${date.getDate()}`;
      setName("");
      setEndDate("");
      setStartDate(formattedDate);
    } else {
      setName(item.task || "");
      setEndDate(item.end_date);
      setStartDate(item.start_date || "");
    }
  }, [item]);

  async function addItem(item: Todo) {
    setLoading(true);

    const { user } = session;

    const { data: todo, error } = await supabase
      .from("todos")
      .insert({
        task: item.task,
        start_date: startDate,
        end_date: endDate,
        user_id: user.id,
      })
      .select().single();

    if (error) alert(error.message);
    else {
      setTodos([...todos, todo]);
    }
    setLoading(false);
  }

  async function editItem(item: Todo) {
    setLoading(true);

    const { error } = await supabase
      .from("todos")
      .update({ task: item.task, start_date: startDate, end_date: endDate })
      .eq("id", item.id)
      .select();

    if (error) {
      alert(error.message);
    } else {
      // Filter by ID
      const nextTodos = todos?.map((t) => {
        if (t.id == item.id) {
          return item;
        } else {
          return t;
        }
      });

      setTodos(nextTodos || []);
    }
    setLoading(false);
  }

  async function submit(event: FormEvent) {
    event.preventDefault;
    const nItem: Todo = {
      id: item?.id || 0,
      task: name,
    };

    if (!item?.id) {
      addItem(nItem);
    } else {
      editItem(nItem);
    }
  }

  const deleteTodo = async (id: number) => {
    // this should never happen
    if (!todos) return;

    try {
      await supabase.from("todos").delete().eq("id", id);
      setTodos(todos.filter((x) => x.id !== id));

      addDialog.current?.close();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <dialog
      className="md:w-1/2 w-full backdrop:bg-gray-600 backdrop:opacity-80"
      ref={addDialog}
    >
      <div className="container p-8 flex justify-between items-start bg-white text-black dark:bg-gray-900 dark:text-white">
        <div className="w-full">
          <h2 className="text-2xl">Add Item</h2>
          <form className="space-y-6 mt-4" onSubmit={submit}>
            <label htmlFor="name">Task</label>
            <input
              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <fieldset className="flex">
              <legend className="text-lg">Dates</legend>

              <div className="w-full p-2 pl-0">
                <label htmlFor="end-date">End date</label>
                <input
                  className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
                  id="end-date"
                  type="date"
                  required
                  defaultValue={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="w-full p-2 pl-0">
                <label htmlFor="start-date">Start date</label>
                <input
                  className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
                  id="start-date"
                  type="date"
                  required
                  defaultValue={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </fieldset>

            <div className="flex">
              <button
                type="submit"
                formMethod="dialog"
                disabled={loading}
                className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {loading ? "Loading" : !item?.id ? "Add" : "Update"}
              </button>
              <button
                type="button"
                className="rounded bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100 ml-2"
                disabled={loading}
                onClick={() => addDialog.current?.close()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100 ml-2"
                disabled={loading}
                onClick={() => deleteTodo(item?.id)}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
        <button onClick={() => addDialog.current?.close()}>
          <i className="ri-close-line">Close</i>
        </button>
      </div>
    </dialog>
  );
}

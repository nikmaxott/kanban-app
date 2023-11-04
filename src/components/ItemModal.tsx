import { FormEvent, RefObject, useEffect, useState } from "react";
import { Todo } from "../type";
import { supabase } from "../helpers/supabase";
import { Session } from "@supabase/supabase-js";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import StyledInput from "./Styled/Input";

const TodoSchema = Yup.object().shape({
  task: Yup.string().required("A task name is requird"),
  startDate: Yup.date(),
  endDate: Yup.date(),
});

const date = new Date();
const formattedDate = `${date.getFullYear()}-${
  date.getMonth() >= 9
    ? date.getMonth() + 1
    : "0" + (date.getMonth() + 1).toString()
}-${date.getDate()}`;

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
  const [initialValues] = useState({
    task: item?.task || "",
    "end-date": item?.end_date || "",
    "start-date": item?.start_date || formattedDate,
  });

  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  async function addItem(item: Todo) {
    setLoading(true);

    const { user } = session;

    const { data: todo, error } = await supabase
      .from("todos")
      .insert({
        task: item.task,
        start_date: item?.start_date || undefined,
        end_date: item?.end_date || undefined,
        user_id: user.id,
      })
      .select()
      .single();

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
      .update({
        task: item.task,
        start_date: item?.start_date || undefined,
        end_date: item?.end_date || undefined,
      })
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
          <Formik
            initialValues={initialValues}
            validationSchema={TodoSchema}
            onSubmit={async (values) => {
              const nItem: Todo = {
                id: item?.id || 0,
                task: values.task,
                end_date: values["end-date"],
                start_date: values["start-date"],
              };

              console.log(nItem);

              if (!item?.id) {
                addItem(nItem);
              } else {
                editItem(nItem);
              }
            }}
          >
            <Form className="space-y-6 mt-4">
              <label htmlFor="task">Task</label>
              <StyledInput id="task" name="task" type="text" required={true} />

              <fieldset className="flex">
                <legend className="text-lg">Dates</legend>

                <div className="w-full p-2 pl-0">
                  <label htmlFor="end-date">End date</label>
                  <StyledInput
                    id={"end-date"}
                    name={"end-date"}
                    type={"date"}
                    required={false}
                  />
                </div>
                <div className="w-full p-2 pl-0">
                  <label htmlFor="start-date">Start date</label>
                  <StyledInput
                    id={"start-date"}
                    name={"start-date"}
                    type={"date"}
                    required={false}
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
            </Form>
          </Formik>
        </div>
        <button onClick={() => addDialog.current?.close()}>
          <i className="ri-close-line">Close</i>
        </button>
      </div>
    </dialog>
  );
}

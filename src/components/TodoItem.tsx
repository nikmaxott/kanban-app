import { supabase } from "../helpers/supabase";
import { Todo } from "../type";

export default function TodoItem({
  item,
  dialog,
  setCurrentItem,
}: {
  item: Todo;
  dialog: React.RefObject<HTMLDialogElement>;
  setCurrentItem: (item: Todo) => void;
}) {
  const dueDate = new Date(item.end_date || "");
  const currentDate = new Date();

  async function markDone() {
    const { data, error } = await supabase
      .from("todos")
      .update({ is_complete: !item.is_complete })
      .eq("id", item.id)
      .select();

    if (!error) item.is_complete = !data[0].is_complete;
  }

  return (
    <div className="flex items-center justify-between w-full sm:w-1/3 py-2 px-4 bg-white rounded-sm shadow mt-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          className="rounded-full bg-gray-300 border border-black"
          checked={item.is_complete}
          onChange={() => markDone()}
        />
        <p
          className={`pl-2 ${
            item.is_complete ? "text-gray-600" : "text-black"
          } ${currentDate > dueDate && !item.is_complete && `text-red-600`}`}
          onClick={() => {
            setCurrentItem(item);
            dialog.current?.showModal();
            console.log("edit");
          }}
        >
          {item.task}
        </p>
      </div>
      {!item.is_complete && item.end_date && (
        <span className={`${currentDate > dueDate && "text-red-600"}`}>
          {dueDate.getDate()}/{dueDate.getMonth() + 1}/{dueDate.getFullYear()}
        </span>
      )}
    </div>
  );
}

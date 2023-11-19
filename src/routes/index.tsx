import BoardView from "../components/BoardView";
import TodoList from "../components/TodoList";
import { useState } from "react";
import { supabase } from "../helpers/supabase";

export default function Index() {
  const [isListView, setIsListView] = useState(true);

  const { data } = await supabase.auth.getSession();

  const toggleView = () => {
    setIsListView(!isListView);
  };

  return (
    <>
      <div className="flex mt-8">
        <div className="flex items-center space-x-4">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              className=" absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={isListView}
              onChange={toggleView}
            />
            <label
              htmlFor="toggle"
              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
          Show List View
        </div>
      </div>
      {isListView ? <TodoList /> : <BoardView />}
    </>
  );
}

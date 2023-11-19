import { Outlet, NavLink, useNavigation, useNavigate } from "react-router-dom";
import { supabase } from "../helpers/supabase";

export default function Root() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  return (
    <div className="flex">
      <aside className="flex flex-col w-1/5 h-[100vh] px-4 bg-gray-200">
        <NavLink
          to={`/`}
          className={({ isActive }) =>
            `${isActive ? "text-red-600" : "text-black"} mt-10 p-2`
          }
        >
          Home
        </NavLink>
        <NavLink
          to={`settings`}
          className={({ isActive }) =>
            `${isActive ? "text-red-600" : "text-black"} p-2`
          }
        >
          Settings
        </NavLink>
        <button
          type="button"
          className="mt-auto mb-4 w-1/2 justify-center rounded bg-gray-600 h-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => {
            supabase.auth.signOut();
            navigate("/login");
          }}
        >
          Sign Out
        </button>
      </aside>
      <article
        className={`p-4 ${
          navigation.state === "loading" ? "bg-black" : "bg-white"
        } w-4/5`}
      >
        <Outlet />
      </article>
    </div>
  );
}

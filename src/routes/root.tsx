import { Outlet, NavLink, useNavigation, useNavigate } from "react-router-dom";
import { supabase } from "../helpers/supabase";

export default function Root() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  return (
    <div className="flex">
      <aside className="flex flex-col w-1/5">
        <NavLink
          to={`/`}
          className={({ isActive }) =>
            isActive ? "text-red-600" : "text-black"
          }
        >
          Home
        </NavLink>
        <NavLink
          to={`app`}
          className={({ isActive }) =>
            isActive ? "text-red-600" : "text-black"
          }
        >
          Settings
        </NavLink>
        <button
          type="button"
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

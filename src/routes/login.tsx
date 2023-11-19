import Auth from "../features/Login";
import { NavLink } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex min-h-full flex-col justify-center ">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-10 bg-gray-100 rounded space-y-4">
        <h1 className="text-2xl h-[200px] w-[200px] text-center mx-auto border rounded-full border-gray-600">
          Kanban App
        </h1>

        <Auth />

        <p>
          <NavLink to={`/forgot-password`} className={"hover:underline"}>
            Reset password
          </NavLink>
        </p>

        <p className="text-gray-600">
          No account?{" "}
          <NavLink to={`/register`} className={"text-black hover:underline"}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

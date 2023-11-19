import { FormEvent, useState } from "react";
import { supabase } from "../../helpers/supabase";

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handlePasswordUpdate(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    console.log(data, error);

    setLoading(false);
  }

  return (
    <form className="space-y-4 mt-4" onSubmit={handlePasswordUpdate}>
      <div>
        <label htmlFor="email">Password</label>
        <input
          className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
          id="password"
          type="password"
          placeholder="password"
          autoComplete="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className=" w-full justify-center rounded bg-blue-600 h-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        disabled={loading}
      >
        {loading ? <span>Loading</span> : <span>Update Password</span>}
      </button>
    </form>
  );
}

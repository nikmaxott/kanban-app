import { FormEvent, useState } from "react";
import { supabase } from "../helpers/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useSSO, setUseSSO] = useState(false);

  const navigate = useNavigate()

  const handleLoginSSO = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.cause || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(location.search);
    const from = params.get("from") || "/";

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.log(error.cause || error.message);
    } else {
      navigate(from)
    }
  };

  return (
    <>
      {useSSO ? (
        <>
          <p className="mt-1">Sign in via SSO with your email below.</p>
          <form className="space-y-6 mt-4" onSubmit={handleLoginSSO}>
            <div>
              <input
                className="h-10 w-full mt-2 rounded border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
              autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className=" w-full justify-center rounded bg-blue-600 h-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              disabled={loading}
            >
              {loading ? <span>Loading</span> : <span>Login</span>}
            </button>
          </form>
          <button
            // className="mt-4 w-full justify-center rounded bg-white h-10 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
            className={"hover:underline pt-4"}
            onClick={() => setUseSSO(!useSSO)}
          >
            Use Email + Password
          </button>
        </>
      ) : (
        <div>
          <form className="space-y-4 mt-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
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
              {loading ? <span>Loading</span> : <span>Login</span>}
            </button>
          </form>
          <button
            className={"hover:underline pt-4"}
            onClick={() => setUseSSO(!useSSO)}
          >
            Use single sign-on
          </button>
        </div>
      )}
    </>
  );
}

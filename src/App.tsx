import { useEffect, useState } from "react";
import "./App.css";
import Account from "./components/Account";
import Auth from "./components/Auth";
import { supabase } from "./helpers/supabase";
import { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </div>
  );
}

export default App;

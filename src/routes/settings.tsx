import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../helpers/supabase";
import Account from "../features/Settings/Account";

function Settings() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return (
    <div>{session && <Account key={session.user.id} session={session} />}</div>
  );
}

export default Settings;

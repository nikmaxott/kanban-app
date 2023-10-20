import {  useState } from "react";
import { supabase } from "../helpers/supabase";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import StyledInput from "./Styled/Input";

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={ForgotSchema}
      onSubmit={async (values) => {
        setError("");
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(
          values.email,
          {
            redirectTo: "http://localhost:5173/update-password",
          },
        );

        if (error) setError(error.message);

        setLoading(false);
      }}
    >
      <Form className="space-y-4 mt-4">
        <div>
          <label htmlFor="email">Email</label>
          <StyledInput
            id={"email"}
            type={"email"}
            placeholder={"Your email"}
            autocomplete={"email"}
            required={true}
            name={"email"}
          />
        </div>
        <button
          className=" w-full justify-center rounded bg-blue-600 h-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          disabled={loading}
          type="submit"
        >
          {loading ? <span>Loading</span> : <span>Reset Password</span>}
        </button>

        {error && <span>{error}</span>}
      </Form>
    </Formik>
  );
}

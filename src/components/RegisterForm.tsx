import { FormEvent, useState } from "react";
import { supabase } from "../helpers/supabase";
import StyledInput from "./Styled/Input";
import { Form, Formik } from "formik";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
}

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters long")
    .required("Required"),
});

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const initialValues: FormValues = { email: "", password: "" };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={async (values) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) setError(error.message);

        //TODO: Deal with if already has SSO

        setLoading(false);
      }}
    >
      <Form className="space-y-4 mt-4">
        <div>
          <label htmlFor="email">Email</label>
          <StyledInput
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="Your email"
            required={true}
          />
        </div>
        <div>
          <label htmlFor="email">Password</label>
          <StyledInput
            id="password"
            name="password"
            type="password"
            placeholder="password"
            autocomplete="password"
            required={true}
          />
        </div>

        <button
          className=" w-full justify-center rounded bg-blue-600 h-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          disabled={loading}
          type="submit"
        >
          {loading ? <span>Loading</span> : <span>Create Account</span>}
        </button>
        <p className="text-xs">
          By clicking "Create account" you agree to our{" "}
          <a href="tos" className="hover:underline">
            Terms Of Service
          </a>{" "}
          and{" "}
          <a href="pp" className="hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        {error && <span>{error}</span>}
      </Form>
    </Formik>
  );
}

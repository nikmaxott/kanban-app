import { ErrorMessage, Field } from "formik";

export default function StyledInput({
  id,
  type,
  placeholder,
  autocomplete,
  required,
  name,
}: {
  id: string;
  type: string;
  placeholder: string;
  autocomplete: string;
  required: boolean;
  name: string;
}) {
  return (
    <>
      <Field
        id={id}
        name={name}
        type={type}
        autoComplete={autocomplete}
        required={required}
        placeholder={placeholder}
        className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:leading-6
          focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm
        invalid:text-red-500 invalid:[&:not(:placeholder-shown)]:ring-red-600 focus:invalid:[&:not(:placeholder-shown)]:ring-red-500"
      />
      <ErrorMessage name={name} />
    </>
  );
}

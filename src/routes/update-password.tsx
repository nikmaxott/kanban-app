import ResetPasswordForm from "../components/ResetPasswordForm";

export default function UpdatePassword() {
  return (
    <div className="flex min-h-full flex-col justify-center ">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-10 bg-gray-100 rounded">
        <h1 className="text-2xl h-[200px] w-[200px] text-center mx-auto border rounded-full border-gray-600">
          Kanban App
        </h1>

        <ResetPasswordForm />
      </div>
    </div>
  );
}

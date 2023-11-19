import React from "react";

type DialogProps = {
  children: React.ReactNode;
  dialogRef: React.RefObject<HTMLDialogElement>;
  title: string;
};

const Dialog: React.FC<DialogProps> = ({ children, dialogRef, title }) => {
  return (
    <dialog
      className="md:w-1/2 w-full backdrop:bg-gray-600 backdrop:opacity-80"
      ref={dialogRef}
    >
      <div className="container p-8 flex justify-between items-start bg-white text-black dark:bg-gray-900 dark:text-white">
        <div className="w-full">
          <h2 className="text-2xl">{title}</h2>
          {children}
        </div>
        <button onClick={() => dialogRef.current?.close()}>
          <i className="ri-close-line">Close</i>
        </button>
      </div>
    </dialog>
  );
};

export default Dialog;

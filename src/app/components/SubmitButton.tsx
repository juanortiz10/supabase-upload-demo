'use client';

import { useFormStatus } from "react-dom";

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <button
            className="rounded-sm bg-white text-black px-6 py-2 transition hover:bg-slate-200 text-sm w-full"
            disabled={pending}
            type="submit">
          {pending ? "Guardando" : "Guardar" }
      </button>
    );
}

export default SubmitButton;
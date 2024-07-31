'use client';

import Image from "next/image";
import { uploadUserInfo } from "../actions";
import { ChangeEvent, FC, FormEvent, useState } from "react";

type FormProps = {
    user: {
        full_name: string;
        email: string;
        avatar_url: string;
    };
    avatarSignedUrl: string;
    onSubmit?: ({}) => void;
};

const Form: FC<FormProps> = ({ user, avatarSignedUrl }) => {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [file, setFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState<string>(avatarSignedUrl);

   
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await uploadUserInfo({
      avatarUrl: user.avatar_url,
      email,
      fullName,
      file,
    });

    if (result.error) {
      console.error('Error updating user: ', result.error);
      return;
    }

    // TODO show a toast
    alert('User updated successfully');
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files?.[0]) return;

    const { target: { files } } = event;
    setFile(files[0]);
  };
 
  return (
    <div className="flex bg-black justify-center items-center py-10">
      <form className="flex flex-col" onSubmit={handleFormSubmit}>
        <h3 className="text-lg text-black">Perfil</h3>
        <Image
          src={avatarUrl}
          alt="profile-photo"
          className="rounded-full w-48 h-48"
          width={120}
          height={120}
        />
        <label className="block mt-4" htmlFor="file">
          <span className="sr-only">Subir foto</span>
          <input
            type="file"
            className="block w-full h-6 text-sm text-slate-500 file:mr-4 file:px-4 file:rounded-sm file:border-0 file:text-sm file:bg-violet-50 file:text-black hover:file:bg-slate-200"
            name="file"
            onChange={handleImageChange}
            accept="image/*" 
          />
        </label> 
        <label className="flex flex-col mb-4 mt-4">
          Nombre
          <input
            type="text"
            className="text-black px-2 py-1 rounded-sm"
            value={fullName}
            onChange={({ target: { value }}: ChangeEvent<HTMLInputElement>) => setFullName(value)}
          />
        </label>
        <label className="flex flex-col mb-4">
          Email
          <input
            type="text"
            className="text-black px-2 py-1 rounded-sm"
            value={email}
            onChange={({ target: { value }}: ChangeEvent<HTMLInputElement>) => setEmail(value)}
          />
        </label>
        <div className="mt-4">
          <button
            className="rounded-full bg-white text-black px-6 py-1 hover:bg-slate-200 text-sm"
            type="submit">
              Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
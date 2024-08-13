'use client';

import Image from "next/image";
import { ChangeEvent, FC, useState, useActionState, useRef } from "react";

import { uploadUserInfo } from "../actions";
import SubmitButton from "./SubmitButton";
 
type FormProps = {
  user: User;
  avatarSignedUrl: string;
  onSubmit?: () => void;
};

const initialState: ActionState = {
  error: null,
  msg: null,
};

const Form: FC<FormProps> = ({ user, avatarSignedUrl }) => {
  const [{ msg, error }, formAction] = useActionState(uploadUserInfo, initialState);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.full_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(avatarSignedUrl);
  
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files?.[0]) return;

    const { target: { files } } = event;

    const nextUrl = URL.createObjectURL(files[0]);
    setAvatarUrl(nextUrl);
  };

  const handleAvatarClick = () => {
    inputFileRef.current?.click();
  };
  
  return (
    <div className="flex bg-black flex-col justify-center items-center py-10">
      <h2 className="text-3xl font-bold">Perfil</h2>
      <form className="flex flex-col w-[240px]" action={formAction}>
        <h3 className="text-lg text-black">Perfil</h3>
        <Image
          src={avatarUrl}
          alt="profile-photo"
          className="rounded-full w-48 h-48 object-cover mb-0 hover:opacity-[0.5] transition-opacity cursor-pointer self-center"
          width={120}
          height={120}
          onClick={handleAvatarClick}
        />
        <input name="avatar_url" value={avatarUrl} className="hidden" readOnly />
        <input name="id" value={user.id} className="hidden" readOnly />
        <label className="block mt-4 text-sm" htmlFor="file">
          <span className="sr-only">Subir foto</span>
          <input
            ref={inputFileRef}
            type="file"
            name="file"
            hidden
            onChange={handleImageChange}
            accept="image/*" 
          />
        </label> 
        <label className="flex flex-col mb-4 mt-4 text-sm">
          Nombre
          <input
            type="text"
            className="text-black p-2 rounded-sm mt-1"
            value={fullName}
            name="fullName"
            onChange={({ target: { value }}: ChangeEvent<HTMLInputElement>) => setFullName(value)}
          />
        </label>
        <label className="flex flex-col mb-4 text-sm">
          Email
          <input
            type="text"
            name="email"
            className="text-black p-2 rounded-sm mt-1"
            value={email}
            onChange={({ target: { value }}: ChangeEvent<HTMLInputElement>) => setEmail(value)}
          />
        </label>
        <p className="font-semibold text-sm">{msg}</p>
        {!!error && <p className="text-red-500 text-sm">Ha ocurrido un error intente de nuevo mas tarde</p>}
        <div className="mt-[18px]">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
};

export default Form;
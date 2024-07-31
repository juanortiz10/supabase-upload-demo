'use client';

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useSWR from "swr";

import createClient from "../utils/supabase/client";
import Loading from "./components/Loading";
import { uploadUserInfo } from "./actions";

const Home = () => {
  const supabase = createClient();
  const { data, isLoading } = useSWR('users', async () => await supabase.from('users').select('*').eq('id', 1).single());
  const user = data?.data || {};

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  
  useEffect(() => {
    if (user.email !== email) {
      setEmail(user.email);
    }

    if (user.full_name !== fullName) {
      setFullName(user.full_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('profile-upload-test').createSignedUrl(`public/${path}`, 60);

        if (error) {
          throw error;
        }
 
        setAvatarUrl(data.signedUrl);
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (!!user.avatar_url) {
      downloadImage(user.avatar_url);
    }
  }, [user.avatar_url, supabase]);
   
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

  if (isLoading) {
    return <Loading />;
  }

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
}

export default Home;
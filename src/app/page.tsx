'use client';

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useSWR from "swr";

import createClient from "../utils/supabase/client";

const Home = () => {
  const supabase = createClient();
  const { data, isLoading } = useSWR('users', async () => await supabase.from('users').select('*').eq('id', 1).single());
  const user = data?.data || {};

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState<string>();

  
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

    let filePath = user.avatar_url;

    if (file) {
      const fileExt = file.name.split('.').pop()
      
      filePath = `1-${Math.random()}.${fileExt}`

      const { error } = await supabase.storage.from('profile-upload-test').upload(`public/${filePath}`, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        console.log('Error uploading file: ', error);
        return;
      }
    }
 
    const result = await supabase.from('users').update({
      full_name: fullName,
      email: email,
      avatar_url: filePath,
    }).eq('id', 1); // HARD USER

    if (result.error) {
      console.log('Error updating user: ', result.error);
      return;
    }

    // TODO - server action here
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files?.[0]) return;

    const { target: { files } } = event;
    setFile(files[0]);
  };

  // TODO - Better flag for loading
  if (isLoading) {
    return (
      <div className="flex bg-black justify-center items-center py-10">
        <h3 className="text-white">Cargando...</h3>
      </div>
    );
  }

  return (
    <div className="flex bg-black justify-center items-center py-10">
      <form className="flex flex-col" onSubmit={handleFormSubmit}>
        <h3 className="text-lg text-black">Perfil</h3>
        <Image
          src={avatarUrl || ''} // TODO default image here
          alt="profile-photo"
          className="rounded-full w-48 h-48"
          width={120}
          height={120}
        />
        <label htmlFor="file" className="text-black">Subir foto</label>
        <input type="file" id="file" name="file" onChange={handleImageChange} accept="image/*" />
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
            className="rounded-full bg-white text-black px-6 py-1 hover:bg-slate-200 text-md"
            type="submit">
              Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Home;
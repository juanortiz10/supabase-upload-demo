'use server';

import createClient from "@/utils/supabase/server";

const supabase = createClient();

export const uploadUserInfo = async (previousState: ActionState, formData: FormData): Promise<ActionState> => {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const avatarUrl = formData.get('avatar_url') as string;
    const file = formData.get('file') as File;
    const userId = formData.get('id');

    try {
      let filePath = avatarUrl;

      if (file && file?.size > 0) {
          const fileExt = file.name.split('.').pop()
          
          filePath = `${userId}-profile-image.${fileExt}`;
  
          const { error } = await supabase.storage.from('profile-upload-test').upload(`public/${filePath}`, file, {
            cacheControl: '3600',
            upsert: true,
          });
    
          if (error) {
            console.error('Error uploading file: ', error);
            return { ...previousState, error, msg: 'Error al subir el archivo' };
          }
      }
     
        const result = await supabase.from('users').update({
          full_name: fullName,
          email: email,
          avatar_url: filePath,
        }).eq('id', userId);
    
        if (result.error) {
          console.error('Error updating user: ', result.error);
          return {...previousState, error: result.error, msg: 'Error updating user' };
        }
  
      return { msg: 'Usuario actualizado exitosamente!', error: null };
    } catch (error) {
      console.error('Error updating user: ', error);
      return { ...previousState, error, msg: 'Error updating user' };
    }

};
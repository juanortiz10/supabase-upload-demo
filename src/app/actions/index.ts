'use server';

import createClient from "@/utils/supabase/server";

const supabase = createClient();

export const uploadUserInfo = async ({
    fullName,
    email,
    avatarUrl,
    file,
}: {
    fullName: string;
    email: string;
    avatarUrl: string;
    file: File | undefined;
}) => {
    
    let filePath = avatarUrl;

    console.log('uploadUserInfo', fullName, email, avatarUrl, file);

    if (file) {
        const fileExt = file.name.split('.').pop()
        
        filePath = `1-${Math.random()}.${fileExt}`
  
        const { error } = await supabase.storage.from('profile-upload-test').upload(`public/${filePath}`, file, {
          cacheControl: '3600',
          upsert: false
        });
  
        if (error) {
          console.error('Error uploading file: ', error);
          return { error, msg: 'Error uploading file' };
        }
    }
   
      const result = await supabase.from('users').update({
        full_name: fullName,
        email: email,
        avatar_url: filePath,
      }).eq('id', 1); // HARD USER
  
      if (result.error) {
        console.error('Error updating user: ', result.error);
        return { error: result.error, msg: 'Error updating user' };
      }

    return { msg: 'User updated successfully', ...result };
};
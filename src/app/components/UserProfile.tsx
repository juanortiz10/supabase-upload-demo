import createClient from "@/utils/supabase/server";
import Form from "./Form";

const UserProfile = async () => {
  const supabase = createClient();
  const { data: user, error } = await supabase.from('users').select('*').eq('id', 1).single()
  const avatarResponse = await supabase.storage.from('profile-upload-test').createSignedUrl(`public/${user.avatar_url}`, 60);

  if (error) {
    return <div>Error loading user</div>;
  }
     
  return (
    <div className="flex bg-black justify-center items-center py-10">
        <Form user={user} avatarSignedUrl={avatarResponse.data?.signedUrl || ''} />
    </div>
  );
};

export default UserProfile;
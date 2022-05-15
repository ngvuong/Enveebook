import { useSession } from 'next-auth/react';

function Settings() {
  const { data: session } = useSession();

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const file = form.elements.avatar.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'enveebook_avatars');
    // await fetch('/api/user/updateUserAvatar', {
    //   method: 'PUT',
    //   // headers: {
    //   //   'Content-Type': 'multipart/form-data',
    //   // },
    //   body: JSON.stringify(formData),
    // });
    const data = await fetch(
      'https://api.cloudinary.com/v1_1/envee/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    ).then((res) => res.json());

    await fetch('/api/user/updateUserAvatar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: data.secure_url,
        id: session.user.id,
      }),
    });
    console.log(data);
  };

  return (
    <div>
      <h1>Settings</h1>
      <form action='' method='POST' onSubmit={onSubmit}>
        <input type='file' name='avatar' />
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
}

export default Settings;

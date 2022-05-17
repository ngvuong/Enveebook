import { useState } from 'react';
import { useUser } from '../contexts/userContext';

function Settings() {
  const [user, setUser] = useUser();
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const file = form.elements.avatar.files[0];
    const formData = new FormData();

    if (!file) {
      return setError('Please select an image');
    }

    formData.append('image', file);
    formData.append('user_id', user.id);

    const data = await fetch('/api/user/updateUserAvatar', {
      method: 'PUT',
      body: formData,
    }).then((res) => res.json());

    if (data.error) {
      setError(data.error);
    } else {
      setUser(data);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      {error && <p>{error}</p>}
      <form action='' method='POST' onSubmit={onSubmit}>
        <input type='file' name='avatar' />
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
}

export default Settings;

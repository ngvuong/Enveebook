import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Avatar from '../ui/Avatar';
import { useUser } from '../../contexts/userContext';
import useComments from '../../hooks/useComments';

import styles from '../../styles/CommentBox.module.scss';

function CommentBox({
  postId,
  commentId,
  focus,
  size,
  recipient,
  setShowReplyBox,
}) {
  const [replyRecipient, setReplyRecipient] = useState('');
  const [inputText, setInputText] = useState(recipient ? '  ' : '');
  const inputRef = useRef(null);
  const [user] = useUser();
  const { setComments } = useComments(postId);

  useEffect(() => {
    if (focus !== null) {
      inputRef.current.focus();

      if (!inputRef.current.value.trim() && recipient) {
        setReplyRecipient('@' + recipient);
        setInputText('  ');
      }
    }
  }, [focus, recipient]);

  const onInputChange = (e) => {
    const value = e.target.value;
    if (!value.length) {
      setReplyRecipient('');
    }
    setInputText(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const text = inputText.trim();

    if (!text) {
      return;
    }

    const content = replyRecipient ? `${replyRecipient} ${text}` : text;

    const data = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        user_id: user._id,
        comment_id: commentId,
      }),
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'comment-error',
      });
    }

    setComments();
    setInputText('');
    setReplyRecipient('');

    if (setShowReplyBox) {
      setShowReplyBox(false);
    }
  };

  return (
    <div className={styles.container}>
      {user && (
        <div
          className={styles.avatarWrapper}
          onClick={() => inputRef.current.focus()}
        >
          <Avatar height={size} width={size} user={user} link={false} />
        </div>
      )}
      <form action='' method='POST' onSubmit={onSubmit}>
        <div>
          <input
            type='text'
            placeholder={`Write a ${commentId ? 'reply' : 'comment'}...`}
            value={inputText}
            onChange={onInputChange}
            ref={inputRef}
          />
          {replyRecipient && <span>{replyRecipient}</span>}
        </div>
      </form>
    </div>
  );
}

export default CommentBox;

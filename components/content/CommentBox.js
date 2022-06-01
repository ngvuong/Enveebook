import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Avatar from '../ui/Avatar';
import { useUser } from '../../contexts/userContext';
import useComment from '../../hooks/useComment';

import styles from '../../styles/CommentBox.module.scss';

function CommentBox({
  postId,
  commentId,
  focus,
  size,
  recipient,
  setShowReplyBox,
}) {
  const [replyRecipient, setReplyRecipient] = useState(recipient);
  const [inputText, setInputText] = useState(recipient ? '  ' : '');
  const inputRef = useRef(null);
  const [user] = useUser();
  const { setComment } = useComment(postId);

  useEffect(() => {
    if (focus === null) {
      return;
    } else {
      inputRef.current.focus();
      if (!inputText.trim() && recipient) {
        setReplyRecipient(recipient);
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
        user_id: user.id,
        comment_id: commentId,
      }),
    }).then((res) => res.json());

    if (data.error) {
      return toast.error(data.error, {
        toastId: 'comment-error',
      });
    }

    setComment();
    setInputText('');
    setReplyRecipient('');

    if (setShowReplyBox) {
      setShowReplyBox(false);
    }
  };

  return (
    <div className={styles.container}>
      {user && <Avatar height={size} width={size} user={user} />}
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

import { useChat } from '@/context/ChatContext';

/**
 * Chat panel header — shows bot name/avatar and close button.
 */
const ChatHeader = () => {
  const { dispatch, abort } = useChat();

  const handleClose = () => {
    dispatch({ type: 'SET_OPEN', payload: false });
    abort();
  };

  return (
    <div className="chat-header">
      <div className="chat-header__info">
        <div className="chat-header__avatar">
          <i className="bi bi-robot" />
        </div>
        <span className="chat-header__name">Audy</span>
      </div>
      <button
        className="chat-header__close"
        onClick={handleClose}
        aria-label="Close chat"
      >
        <i className="bi bi-x-lg" />
      </button>
    </div>
  );
};

export default ChatHeader;

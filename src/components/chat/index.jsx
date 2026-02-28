import ChatFab from './ChatFab';
import ChatWindow from './ChatWindow';
import './style.scss';

/**
 * Chat widget — FAB + panel.
 * ChatProvider is now at App.jsx level so inline chat shares conversation state.
 */
export const CHAT_WIDGET = () => (
  <>
    <ChatFab />
    <ChatWindow />
  </>
);

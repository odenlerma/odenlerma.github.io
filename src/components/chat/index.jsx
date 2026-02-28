import { ChatProvider } from '@/context/ChatContext';
import ChatFab from './ChatFab';
import ChatWindow from './ChatWindow';
import './style.scss';

/**
 * Chat widget — wraps FAB + panel in ChatProvider.
 * Rendered as a sibling to HomePage in App.jsx.
 */
export const CHAT_WIDGET = () => (
  <ChatProvider>
    <ChatFab />
    <ChatWindow />
  </ChatProvider>
);

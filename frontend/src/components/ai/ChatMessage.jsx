import { motion } from 'framer-motion';

import { AI_NAME } from '../../constants/branding';



export default function ChatMessage({ role, content, timestamp }) {

  const isUser = role === 'user';



  return (

    <motion.div

      className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-ai'}`}

      initial={{ opacity: 0, y: 10 }}

      animate={{ opacity: 1, y: 0 }}

    >

      <div className="chat-message-avatar" aria-hidden="true">

        {isUser ? 'You' : AI_NAME.slice(0, 1)}

      </div>

      <div className="chat-message-body">

        <p>{content}</p>

        {timestamp && (

          <span className="chat-message-time">

            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

          </span>

        )}

      </div>

    </motion.div>

  );

}


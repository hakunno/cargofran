import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "../pages/Messages";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-39">
      <AnimatePresence exitBeforeEnter>
        {isOpen ? (
          <motion.div
            className="w-80 h-[600px] bg-white rounded shadow-lg flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-t hover:bg-blue-600 transition-colors duration-300"
              onClick={toggleChat}
            >
              Chat with us (click to close)
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatWindow onBack={toggleChat} widgetMode={true} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer shadow-lg hover:bg-blue-600 transition-colors duration-300"
            onClick={toggleChat}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            Chat with us
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;

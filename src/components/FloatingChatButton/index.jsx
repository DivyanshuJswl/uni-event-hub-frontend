// components/FloatingChatButton.jsx
import React from "react";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "context/ChatContext";

const FloatingChatButton = () => {
  const { toggleChat, isOpen } = useChat();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "fixed",
            bottom: "6rem",
            right: "2rem",
            zIndex: 9999,
          }}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.5rem"
            height="3.5rem"
            bgColor="info"
            shadow="lg"
            borderRadius="50%"
            color="white"
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgColor: "dark",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={toggleChat}
          >
            <Icon fontSize="medium" color="inherit">
              smart_toy
            </Icon>
          </MDBox>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingChatButton;

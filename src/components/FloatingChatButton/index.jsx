import { useMemo, memo } from "react";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "context/ChatContext";

const FloatingChatButton = () => {
  const { toggleChat, isOpen } = useChat();

  // Memoized motion styles
  const motionStyles = useMemo(
    () => ({
      position: "fixed",
      bottom: "6rem",
      right: "2rem",
      zIndex: 1301,
    }),
    []
  );

  // Memoized button styles
  const buttonStyles = useMemo(
    () => ({
      cursor: "pointer",
      "&:hover": {
        bgColor: "dark",
        transform: "scale(1.05)",
      },
      transition: "all 0.3s ease",
    }),
    []
  );

  // Memoized animation variants
  const animationVariants = useMemo(
    () => ({
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    }),
    []
  );

  // Memoized hover animation
  const hoverAnimation = useMemo(() => ({ scale: 1.1 }), []);

  // Memoized tap animation
  const tapAnimation = useMemo(() => ({ scale: 0.9 }), []);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={animationVariants.initial}
          animate={animationVariants.animate}
          exit={animationVariants.exit}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          style={motionStyles}
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
            sx={buttonStyles}
            onClick={toggleChat}
            role="button"
            aria-label="Open chat assistant"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleChat();
              }
            }}
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

FloatingChatButton.displayName = "FloatingChatButton";

export default memo(FloatingChatButton);

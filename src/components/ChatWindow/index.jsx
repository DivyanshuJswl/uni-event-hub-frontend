import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "context/ChatContext";
import { useAuth } from "context/AuthContext";
import { useMaterialUIController } from "context";

// Memoized FormattedMessage Component
const FormattedMessage = memo(({ content, darkMode }) => {
  const renderInlineFormatting = useCallback(
    (text) => {
      if (!text) return null;

      const boldRegex = /\*\*(.*?)\*\*/g;
      const elements = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          elements.push(text.slice(lastIndex, match.index));
        }

        elements.push(
          <Box
            component="span"
            key={match.index}
            sx={{
              fontWeight: "bold",
              color: darkMode ? "primary.light" : "primary.main",
            }}
          >
            {match[1]}
          </Box>
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        elements.push(text.slice(lastIndex));
      }

      return elements.length > 0 ? elements : text;
    },
    [darkMode]
  );
  const cleanMarkdownText = useCallback((text) => {
    if (!text) return "";

    return (
      text
        // Remove excessive blank lines
        .replace(/\n{3,}/g, "\n\n")
        // Trim trailing spaces
        .replace(/[ \t]+$/gm, "")
        // Ensure consistent list markers
        .replace(/^[\-•]\s+/gm, "• ")
    );
  }, []);

  const renderFormattedContent = useMemo(() => {
    if (!content) return null;

    const cleanedContent = cleanMarkdownText(content);
    const lines = cleanedContent.split("\n");
    const elements = [];

    let inTable = false;
    let tableRows = [];
    let inList = false;
    let listItems = [];

    const processList = () => {
      if (listItems.length > 0) {
        elements.push(
          <Box component="ul" sx={{ pl: 2, mb: 1, mt: 0 }} key={`list-${elements.length}`}>
            {listItems.map((item, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  mb: 0.5,
                  "&::marker": {
                    color: darkMode ? "primary.light" : "primary.main",
                  },
                }}
              >
                <MDTypography variant="body2" sx={{ lineHeight: 1.5, fontSize: "0.8125rem" }}>
                  {renderInlineFormatting(item)}
                </MDTypography>
              </Box>
            ))}
          </Box>
        );
        listItems = [];
      }
    };

    const processTable = () => {
      if (tableRows.length > 0) {
        const filteredRows = tableRows.filter((row) => !row.includes("---") && row.trim() !== "");

        elements.push(
          <Box
            key={`table-${elements.length}`}
            sx={{
              mb: 2,
              mt: 1,
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 1,
              overflow: "hidden",
              fontSize: "0.75rem",
            }}
          >
            {filteredRows.map((row, rowIndex) => {
              const isHeader = rowIndex === 0;
              const cells = row.split("|").filter((cell) => cell.trim() !== "");

              return (
                <Box
                  key={rowIndex}
                  sx={{
                    display: "flex",
                    borderBottom:
                      rowIndex < filteredRows.length - 1
                        ? `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`
                        : "none",
                    backgroundColor: isHeader
                      ? darkMode
                        ? "primary.dark"
                        : "primary.main"
                      : "transparent",
                  }}
                >
                  {cells.map((cell, cellIndex) => (
                    <Box
                      key={cellIndex}
                      sx={{
                        flex: 1,
                        p: 0.75,
                        borderRight:
                          cellIndex < cells.length - 1
                            ? `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`
                            : "none",
                        minHeight: "32px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MDTypography
                        variant="body2"
                        sx={{
                          fontWeight: isHeader ? "bold" : "normal",
                          color: isHeader ? "white" : darkMode ? "white" : "text.primary",
                          lineHeight: 1.3,
                          fontSize: "0.75rem",
                          width: "100%",
                        }}
                      >
                        {renderInlineFormatting(cell.trim())}
                      </MDTypography>
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        );
        tableRows = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Table processing
      if (trimmedLine.includes("|") && !trimmedLine.includes("---")) {
        if (!inTable) {
          processList();
          inTable = true;
        }
        tableRows.push(trimmedLine);
        return;
      } else if (inTable && !trimmedLine.includes("---")) {
        processTable();
        inTable = false;
      }

      // List processing
      if (
        (trimmedLine.startsWith("- ") ||
          trimmedLine.startsWith("• ") ||
          /^\d+\./.test(trimmedLine)) &&
        trimmedLine.length > 2
      ) {
        if (!inList) {
          inList = true;
        }
        listItems.push(trimmedLine.replace(/^(- |• |\d+\.\s*)/, ""));
        return;
      } else if (inList && trimmedLine === "") {
        processList();
        inList = false;
        return;
      } else if (inList) {
        listItems.push(trimmedLine);
        return;
      }

      // Heading processing
      if (trimmedLine.startsWith("### ")) {
        processList();
        elements.push(
          <MDTypography
            key={index}
            variant="h6"
            sx={{
              mt: 1.5,
              mb: 0.75,
              color: darkMode ? "primary.light" : "primary.main",
              fontWeight: "bold",
              fontSize: "0.9375rem",
            }}
          >
            {renderInlineFormatting(trimmedLine.replace("### ", ""))}
          </MDTypography>
        );
      } else if (trimmedLine.startsWith("## ")) {
        processList();
        elements.push(
          <MDTypography
            key={index}
            variant="h5"
            sx={{
              mt: 1.5,
              mb: 0.75,
              color: darkMode ? "primary.light" : "primary.main",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {renderInlineFormatting(trimmedLine.replace("## ", ""))}
          </MDTypography>
        );
      } else if (trimmedLine.startsWith("# ")) {
        processList();
        elements.push(
          <MDTypography
            key={index}
            variant="h4"
            sx={{
              mt: 2,
              mb: 1,
              color: darkMode ? "primary.light" : "primary.main",
              fontWeight: "bold",
              fontSize: "1.125rem",
            }}
          >
            {renderInlineFormatting(trimmedLine.replace("# ", ""))}
          </MDTypography>
        );
      } else if (trimmedLine !== "") {
        processList();
        elements.push(
          <MDTypography
            key={index}
            variant="body2"
            sx={{
              mb: 0.75,
              lineHeight: 1.5,
              color: darkMode ? "white" : "text.primary",
              fontSize: "0.8125rem",
            }}
          >
            {renderInlineFormatting(trimmedLine)}
          </MDTypography>
        );
      } else {
        processList();
        if (elements.length > 0 && index < lines.length - 1) {
          elements.push(<Box key={index} sx={{ mb: 0.75 }} />);
        }
      }
    });

    processList();
    processTable();

    return elements;
  }, [content, darkMode, renderInlineFormatting]);

  return <Box>{renderFormattedContent}</Box>;
});

FormattedMessage.propTypes = {
  content: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

FormattedMessage.displayName = "FormattedMessage";

// Main ChatWindow Component
const ChatWindow = () => {
  const { isOpen, messages, isLoading, suggestions, sendMessage, toggleChat, clearMessages } =
    useChat();
  const { user } = useAuth();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Memoized responsive dimensions
  const dimensions = useMemo(
    () => ({
      chatWidth: isMobile ? "calc(100vw - 2rem)" : "380px",
      chatHeight: isMobile ? "calc(100vh - 8rem)" : "500px",
    }),
    [isMobile]
  );

  // Memoized scroll function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Memoized handlers
  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        await sendMessage(inputMessage.trim());
        setInputMessage("");
      }
    },
    [inputMessage, isLoading, sendMessage]
  );

  const handleSuggestionClick = useCallback(
    async (suggestion) => {
      await sendMessage(suggestion);
    },
    [sendMessage]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    },
    [handleSendMessage]
  );

  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Memoized computed values
  const isFirstInteraction = useMemo(() => messages.length === 0, [messages.length]);

  // Memoized styles
  const styles = useMemo(
    () => ({
      container: {
        position: "fixed",
        bottom: isMobile ? "1rem" : "6rem",
        right: isMobile ? "1rem" : "2rem",
        width: dimensions.chatWidth,
        height: dimensions.chatHeight,
        zIndex: 9998,
        boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.15)",
        borderRadius: "12px",
        overflow: "hidden",
      },
      card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      },
      header: {
        background: darkMode
          ? "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
          : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
      },
      inputField: {
        backgroundColor: darkMode ? "grey.900" : "white",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          fontSize: "0.875rem",
          "& fieldset": {
            borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
          },
          "&:hover fieldset": {
            borderColor: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
      },
      suggestionChip: {
        cursor: "pointer",
        transition: "all 0.2s ease",
        backgroundColor: darkMode ? "grey.700" : "grey.200",
        color: darkMode ? "white" : "text.primary",
        fontSize: "0.75rem",
        "&:hover": {
          backgroundColor: darkMode ? "primary.main" : "primary.light",
          color: "white",
          transform: "translateY(-1px)",
        },
      },
    }),
    [darkMode, isMobile, dimensions]
  );

  // Memoized message bubble style function
  const getMessageBubbleStyle = useCallback(
    (role) => ({
      maxWidth: "90%",
      backgroundColor:
        role === "user"
          ? darkMode
            ? "primary.dark"
            : "primary.main"
          : darkMode
            ? "#1e1e1e"
            : "#f8f9fa",
      color: role === "user" ? "white" : darkMode ? "white" : "text.primary",
      borderRadius: "12px",
      padding: "8px 12px",
      boxShadow: darkMode ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.1)",
      border: darkMode && role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none",
    }),
    [darkMode]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          style={styles.container}
        >
          <Card sx={styles.card}>
            {/* Header */}
            <MDBox
              sx={styles.header}
              color="white"
              p={1.5}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <Icon fontSize="small" sx={{ color: "primary.main" }}>
                    smart_toy
                  </Icon>
                </Avatar>
                <Box>
                  <MDTypography variant="h6" fontWeight="medium" color="white" fontSize="0.9375rem">
                    Event Assistant
                  </MDTypography>
                  <MDTypography
                    variant="caption"
                    color="white"
                    sx={{ opacity: 0.9, fontSize: "0.7rem" }}
                  >
                    {isLoading ? "Typing..." : "Online • Ready to help"}
                  </MDTypography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <IconButton
                  size="small"
                  onClick={clearMessages}
                  sx={{ color: "white", padding: "4px" }}
                  title="Clear conversation"
                >
                  <Icon fontSize="small">delete</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  onClick={toggleChat}
                  sx={{ color: "white", padding: "4px" }}
                  title="Close chat"
                >
                  <Icon fontSize="small">close</Icon>
                </IconButton>
              </Box>
            </MDBox>

            {/* Messages Container */}
            <CardContent
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 1.5,
                backgroundColor: "background.default",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {isFirstInteraction ? (
                // Welcome State
                <Box sx={{ textAlign: "center", py: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 1.5,
                      bgcolor: "primary.main",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Icon fontSize="medium">smart_toy</Icon>
                  </Avatar>
                  <MDTypography
                    variant="h6"
                    gutterBottom
                    color={darkMode ? "white" : "text.primary"}
                    fontSize="1rem"
                  >
                    Hi {user?.name || "there"}! 👋
                  </MDTypography>
                  <MDTypography
                    variant="body2"
                    paragraph
                    sx={{
                      maxWidth: "300px",
                      mx: "auto",
                      lineHeight: 1.5,
                      fontSize: "0.8125rem",
                      color: darkMode ? "grey.300" : "text.secondary",
                    }}
                  >
                    I'm your Event Assistant. I can help you discover events, manage your schedule,
                    and answer questions about Uni-Event HUB!
                  </MDTypography>

                  {/* Quick Suggestions */}
                  {suggestions.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <MDTypography
                        variant="caption"
                        sx={{
                          mb: 1.5,
                          display: "block",
                          fontWeight: "medium",
                          fontSize: "0.7rem",
                          color: darkMode ? "grey.400" : "text.secondary",
                        }}
                      >
                        QUICK SUGGESTIONS:
                      </MDTypography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.75,
                          justifyContent: "center",
                        }}
                      >
                        {suggestions.map((suggestion, index) => (
                          <Chip
                            key={index}
                            label={suggestion}
                            size="small"
                            onClick={() => handleSuggestionClick(suggestion)}
                            sx={styles.suggestionChip}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                // Conversation State
                <Box sx={{ flexGrow: 1 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Box sx={getMessageBubbleStyle(message.role)}>
                        {message.role === "user" ? (
                          <MDTypography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              color: "#fff",
                              fontSize: "0.8125rem",
                              lineHeight: 1.4,
                            }}
                          >
                            {message.content}
                          </MDTypography>
                        ) : (
                          <FormattedMessage content={message.content} darkMode={darkMode} />
                        )}
                        <MDTypography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.25,
                            opacity: 0.6,
                            textAlign: message.role === "user" ? "right" : "left",
                            color:
                              message.role === "user"
                                ? "rgba(255,255,255,0.8)"
                                : darkMode
                                  ? "grey.400"
                                  : "grey.600",
                            fontSize: "0.625rem",
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </MDTypography>
                      </Box>
                    </Box>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
                      <Box sx={getMessageBubbleStyle("assistant")}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Box
                            sx={{ width: 20, height: 20, display: "flex", alignItems: "center" }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Icon
                                sx={{
                                  fontSize: 16,
                                  color: darkMode ? "primary.light" : "primary.main",
                                }}
                              >
                                autorenew
                              </Icon>
                            </motion.div>
                          </Box>
                          <MDTypography variant="body2" fontSize="0.8125rem">
                            Thinking...
                          </MDTypography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </CardContent>

            {/* Input Area */}
            <Box
              p={1.5}
              sx={{
                borderTop: 1,
                borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                backgroundColor: "background.default",
              }}
            >
              <form onSubmit={handleSendMessage}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  size="small"
                  sx={styles.inputField}
                  InputProps={{
                    sx: { fontSize: "0.875rem" },
                    endAdornment: (
                      <IconButton
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        size="small"
                        sx={{
                          color: "#1976d2",
                          opacity: !inputMessage.trim() || isLoading ? 0.5 : 1,
                          transition: "opacity 0.2s ease",
                          padding: "6px",
                        }}
                      >
                        <Icon fontSize="small" color="info">
                          send
                        </Icon>
                      </IconButton>
                    ),
                  }}
                />
              </form>
              <MDTypography
                variant="caption"
                sx={{
                  mt: 0.75,
                  display: "block",
                  textAlign: "center",
                  fontSize: "0.625rem",
                  color: darkMode ? "grey.500" : "grey.600",
                }}
              >
                Press Enter to send • Shift+Enter for new line
              </MDTypography>
            </Box>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ChatWindow.displayName = "ChatWindow";

export default memo(ChatWindow);

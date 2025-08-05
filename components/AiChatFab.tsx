"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "./ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
  Icon,
  MessageCircleIcon,
  CloseIcon,
  LoaderIcon,
} from "@/components/ui/icon";
import { Loader2, SendIcon } from "lucide-react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Keyboard } from "react-native";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const AiChat = () => {
  const [showChatDrawer, setShowChatDrawer] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 30000); // Fallback timeout

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    const userMessage: Message = {
      id: generateId(),
      sender: "user",
      text: message,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, userMessage]);

    setMessage("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch("/api/aichat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiReply =
        data.reply?.parts?.[0]?.text ||
        "I'm sorry, but I couldn't process that request.";

      const aiMessage: Message = {
        id: generateId(),
        sender: "ai",
        text: aiReply,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, aiMessage]);
      setIsLoading(false); // This should always run
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error
          ? error.message.includes("aborted")
            ? "Request timed out. Please try again."
            : error.message
          : "Oops! Something went wrong. Please try again.";

      setConversation((prev) => [
        ...prev,
        {
          id: generateId(),
          sender: "ai",
          text: errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false); // This should always run
      scrollToBottom();
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSendMessage();
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <VStack className="">
      <Fab
        size="lg"
        placement="bottom right"
        className="md:p-4 p-2 bg-white z-[13000] hover:bg-white md:border-4 border-2 border-brand-primary fixed md:h-16 h-12 shadow-lg shadow-brand-secondary hover:shadow-xl hover:border-btn-primary hover:shadow-btn-primary active:bg-white transition-shadow duration-300 group"
        onPress={() => setShowChatDrawer(true)}
      >
        <FabLabel
          size="xs"
          className="text-btn-primary md:text-lg mr-1 font-semibold group-hover:text-brand-primary transition-colors duration-300"
        >
          Ask Sanux
        </FabLabel>
        <FabIcon
          as={MessageCircleIcon}
          className="text-btn-primary md:w-8 md:h-8 w-5 h-5 inline group-hover:text-brand-primary transition-colors duration-300"
        />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        isOpen={showChatDrawer}
        onClose={() => setShowChatDrawer(false)}
        anchor="right"
        className="h-screen fixed"
      >
        <DrawerBackdrop />
        <DrawerContent className="md:w-1/3 w-full bg-white h-screen overflow-scroll [&::-webkit-scrollbar]:hidden">
          {/* Header */}
          <DrawerHeader className="flex-col border-b border-gray-200 p-4 bg-gradient-to-r from-brand-primary to-brand-secondary">
            <HStack className="justify-between items-center w-full">
              <VStack className="gap-0">
                <Heading size="sm" className="md:text-xl text-white">
                  Sanux AI
                </Heading>
                <Text size="xs" className="md:text-md text-white/90">
                  CompaniesCenter Support
                </Text>
              </VStack>
              <Button
                variant="link"
                size="lg"
                onPress={() => setShowChatDrawer(false)}
              >
                <ButtonIcon
                  as={CloseIcon}
                  className="text-white hover:text-white/80 transition-colors"
                />
              </Button>
            </HStack>
          </DrawerHeader>

          {/* Chat Body */}
          <DrawerBody className="p-4 h-96 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
            <VStack className="gap-4 pb-4">
              {/* Welcome Message */}
              {conversation.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 rounded-2xl p-6 text-center flex flex-col"
                >
                  <Heading size="md" className="md:text-md mb-2">
                    👋 Hello!
                  </Heading>
                  <Text size="xs" className="md:text-md text-gray-700">
                    I&apos;m Sanux, your AI assistant. How can I help you today?
                  </Text>
                  <Text size="xs" className="mt-4 md:text-md text-gray-500">
                    Try asking about company registration, compliance, or any
                    business-related questions.
                  </Text>
                </motion.div>
              )}

              {/* Conversation */}
              <AnimatePresence>
                {conversation.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.sender === "ai" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] flex flex-col rounded-2xl p-4 ${
                        msg.sender === "ai"
                          ? "bg-gray-100"
                          : "bg-brand-primary text-white"
                      }`}
                    >
                      {msg.sender === "ai" ? (
                        <ReactMarkdown
                          components={{
                            p: ({ ...props }) => (
                              <p {...props} className="prose prose-sm" />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        <Text>{msg.text}</Text>
                      )}
                      <Text
                        size="xs"
                        className={`mt-1 ${
                          msg.sender === "ai"
                            ? "text-gray-500"
                            : "text-white/70"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </Text>
                    </div>
                  </motion.div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-center py-2">
                    <div className="animate-pulse flex items-center gap-2">
                      <Icon
                        as={LoaderIcon}
                        className="animate-spin text-brand-primary"
                      />
                      <Text size="sm" className="text-gray-500">
                        Sanux is thinking...
                      </Text>
                    </div>
                  </div>
                )}
                {/* Scroll anchor */}
                <div ref={lastMessageRef} />
              </AnimatePresence>
            </VStack>
          </DrawerBody>

          {/* Input Area */}
          <DrawerFooter className="flex-col w-full gap-4 border-gray-200">
            <FormControl
              isInvalid={isInvalid}
              className="flex-row justify-between w-full"
            >
              <Input className="w-full h-14">
                <InputField
                  placeholder="Type your message..."
                  value={message}
                  onChangeText={setMessage}
                  onSubmitEditing={handleKeyPress}
                  className=""
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className={`p-3 ${
                    message.trim()
                      ? "bg-brand-primary hover:bg-brand-secondary"
                      : "bg-gray-300"
                  } text-white transition-colors disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Icon as={Loader2} className="animate-spin" />
                  ) : (
                    <Icon as={SendIcon} />
                  )}
                </button>
              </Input>
            </FormControl>
            <Text size="xs" className="text-gray-500 text-center mt-2">
              Sanux may produce inaccurate information. Verify important
              details.
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

export default AiChat;

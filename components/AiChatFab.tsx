import { useState, useCallback, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  MessageCircleIcon,
  CircleIcon,
  LoaderIcon,
} from "@/components/ui/icon";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Keyboard } from "react-native";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const AiChat = () => {
  const [showChatDrawer, setShowChatDrawer] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = async () => {
    if (!message) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      setConversation((prev) => [...prev, { sender: "user", text: message }]);
      setMessage("");
      setIsLoading(true);
      scrollToBottom();

      try {
        const response = await fetch("/api/aichat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from AI.");
        }

        const data = await response.json();
        const aiReply =
          data.reply?.parts?.[0]?.text ||
          "I'm sorry, but I couldn't process that request.";

        setConversation((prev) => [...prev, { sender: "ai", text: aiReply }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setConversation((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Oops! Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSendMessage();
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]);

  return (
    <VStack className="hidden md:flex">
      <Fab
        size="lg"
        placement="bottom right"
        className="bg-white z-50 hover:bg-white border-4 border-brand-primary fixed  h-16 shadow-lg shadow-brand-secondary hover:shadow-xl hover:border-btn-primary hover:shadow-btn-primary active:bg-white transition-shadow duration-300 group"
        onPress={() => setShowChatDrawer(true)}
      >
        <FabLabel className="text-btn-primary mr-1 font-bold group-hover:text-brand-primary transition-colors duration-300">
          Ask AI
        </FabLabel>
        <FabIcon
          as={MessageCircleIcon}
          size="xl"
          className="text-btn-primary inline group-hover:text-brand-primary transition-colors duration-300"
        />
      </Fab>

      <Drawer
        isOpen={showChatDrawer}
        onClose={() => setShowChatDrawer(false)}
        size="sm"
        anchor="right"
        className="fixed h-screen"
      >
        <DrawerBackdrop />
        <DrawerContent className="bg-white h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          <DrawerHeader className="flex-col gap-2 items-start">
            <Heading size="2xl">Hey there!</Heading>
            <Text size="sm">
              I&apos;m Sanux, CompaniesCenter&apos;s Support AI.
              <Text className="px-4 bg-btn-primary text-white ml-1 rounded-3xl">
                Beta
              </Text>
            </Text>
          </DrawerHeader>
          <DrawerBody className="">
            <ScrollView className="h-96 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
              <VStack className="gap-4">
                <VStack className="h-full gap-4 items-end">
                  {conversation.map((msg, index) => (
                    <Box
                      key={index}
                      // @ts-expect-error: Ignore the error on the next line
                      ref={
                        index === conversation.length - 1
                          ? lastMessageRef
                          : null
                      }
                      className={`p-4 rounded-lg max-w-[80%] ${
                        msg.sender === "ai"
                          ? "bg-brand-secondary text-white mr-auto"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {msg.sender === "ai" ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        <Text className="text-white font-semibold">
                          {msg.text}
                        </Text>
                      )}
                    </Box>
                  ))}
                  {isLoading && (
                    <Box className="p-4 rounded-lg bg-brand-secondary text-white mr-auto">
                      <LoaderIcon className="animate-spin" />
                      <Text>Sanux is typing...</Text>
                    </Box>
                  )}
                </VStack>
              </VStack>
            </ScrollView>
          </DrawerBody>

          <DrawerFooter className="gap-4 flex-col">
            <FormControl
              isInvalid={isInvalid}
              className="gap-4 flex-col w-full"
            >
              <Input variant="rounded">
                <InputField
                  placeholder="Ask Ai anything"
                  value={message}
                  onSubmitEditing={handleKeyPress}
                  onChangeText={(text) => setMessage(text)}
                />
                <InputSlot onPress={handleSendMessage}>
                  <InputIcon
                    as={CircleIcon}
                    className="rounded-full text-btn-primary bg-brand-secondary active:bg-btn-primary active:text-brand-secondary h-full w-10 mr-10 shadow-btn-primary shadow-2xl"
                  />
                </InputSlot>
              </Input>
            </FormControl>

            <Text className="text-xs">
              Sanux is CompaniesCenter&apos;s Support AI. You&apos;re
              responsible for your content and work, so be sure to check all
              responses.
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

export default AiChat;

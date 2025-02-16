import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MessageCircleIcon } from "@/components/ui/icon";

const AiChat = () => {
  const [showChatModal, setShowChatModal] = useState(false);

  return (
           <Fab
        size="lg"
        placement="bottom right"
        className="bg-white border-4 border-brand-primary fixed w-32 h-16 shadow-lg shadow-brand-secondary hover:shadow-xl hover:border-btn-primary hover:shadow-btn-primary transition-shadow duration-300 group"
      >
        <Heading className="text-btn-primary mr-1 group-hover:text-brand-primary transition-colors duration-300">
          Ask AI
        </Heading>
        <FabIcon as={MessageCircleIcon} className="text-btn-primary text-2xl inline group-hover:text-brand-primary transition-colors duration-300" />
      </Fab>
  );
};

export default AiChat;

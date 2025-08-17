import { useState, useEffect } from "react";
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverBody,
} from "@/components/ui/popover";
import { Link, LinkText } from "@/components/ui/link";
import { Icon, ChevronDownIcon } from "@/components/ui/icon";

interface DropdownOption {
  label: string;
  onPress: () => void;
}

interface DropdownProps {
  buttonLabel: string;
  options: DropdownOption[];
  offset?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  buttonLabel,
  options,
  offset,
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger when scrolled past 38px
      if (window.scrollY > 38) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Link {...triggerProps} className="flex-row gap-1">
            <LinkText className="no-underline text-text-primary font-bold data-[hover=true]:text-brand-0 data-[active=true]:text-brand-1">
              {buttonLabel}
            </LinkText>
            <Icon as={ChevronDownIcon} className="w-5 h-5 text-text-primary" />
          </Link>
        );
      }}
      placement="bottom"
      offset={offset}
      className={`transition-all duration-500 ease-in-out fixed ${
        isSticky ? "md:-mt-10" : ""
      }`}
    >
      <PopoverBackdrop />

      <PopoverContent className="">
        <PopoverBody className="gap-2">
          {options.map((option, index) => (
            <Link key={index} className="w-96" onPress={option.onPress}>
              <LinkText>{option.label}</LinkText>
            </Link>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Dropdown;

import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { FieldErrors } from "react-hook-form";

export const FieldWithInfo = ({
  id,
  children,
  infoText,
  focusedField,
  errors,
}: {
  id: string;
  children: React.ReactNode;
  infoText: string;
  focusedField: string | "";
  errors?: FieldErrors<FormData>;
}) => {
  return (
    <HStack className="w-full h-full justify-between items-start">
      {/* Field Section */}
      <FormControl className="bg-white h-full p-4 w-3/5 drop-shadow-sm rounded-none ">
        <FormControlLabel
          className={`text-gray-700 font-medium ${
            focusedField === id ? "text-blue-600" : ""
          }`}
        >
          <FormControlLabelText
            className={`text-gray-700 font-medium ${
              focusedField === id ? "text-blue-600" : ""
            }`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </FormControlLabelText>
        </FormControlLabel>
        {children}
        {errors?.[id] && (
          <Text className="bg-red-50 p-2 rounded-lg mt-2 w-fit text-red-600 text-xs font-medium">
            {errors?.[id].message}
          </Text>
        )}
      </FormControl>

      {/* Info Card Section */}
      <Card
        className={`w-1/3 bg-green-200 drop-shadow-lg transition-opacity duration-200 ${
          focusedField === id ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Text size="sm" className="text-green-800 font-medium">
          {infoText}
        </Text>
      </Card>
    </HStack>
  );
};

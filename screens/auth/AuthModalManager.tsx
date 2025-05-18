import { useState, useEffect } from "react";
import SignInModal from "./signin";
import SignUpModal from "./signup";

interface AuthModalManagerProps {
  isModalOpen: boolean;
  onClose: () => void;
  initialView?: "signIn" | "signUp"; // Add a prop to control the initial view
}

const AuthModalManager: React.FC<AuthModalManagerProps> = (props) => {
  const { isModalOpen, onClose, initialView = "signUp" } = props; // Default to "signUp"
  const [isSignInOpen, setIsSignInOpen] = useState(initialView === "signIn"); // Set initial state based on the prop

  // Reset the modal view when the modal is reopened or the initialView changes
  useEffect(() => {
    if (isModalOpen) {
      setIsSignInOpen(initialView === "signIn");
    }
  }, [isModalOpen, initialView]);

  const handleClose = () => {
    onClose();
  };

  const switchToSignIn = () => {
    setIsSignInOpen(true);
  };

  const switchToSignUp = () => {
    setIsSignInOpen(false);
  };

  return (
    <>
      {isSignInOpen ? (
        <SignInModal
          isOpen={isModalOpen}
          onClose={handleClose}
          switchToSignUp={switchToSignUp}
        />
      ) : (
        <SignUpModal
          isOpen={isModalOpen}
          onClose={handleClose}
          switchToSignIn={switchToSignIn}
        />
      )}
    </>
  );
};

export default AuthModalManager;

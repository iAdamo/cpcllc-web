import { useState } from "react";
import SignInModal from "./signin";
import SignUpModal from "./signup";

interface AuthModalManagerProps {
  isModalOpen: boolean;
  onClose: () => void;
}
const AuthModalManager: React.FC<AuthModalManagerProps> = (props) => {
  const { isModalOpen, onClose } = props;
  const [isSignInOpen, setIsSignInOpen] = useState(true);

  const handleClose = () => {
    onClose();
  };

  const switchToSignIn = () => {
    setIsSignInOpen(false);
  };

  const switchToSignUp = () => {
    setIsSignInOpen(true);
  };

  return (
    <>
      {isSignInOpen ? (
        <SignUpModal
          isOpen={isModalOpen}
          onClose={handleClose}
          switchToSignIn={switchToSignIn}
        />
      ) : (
        <SignInModal
          isOpen={isModalOpen}
          onClose={handleClose}
          switchToSignUp={switchToSignUp}
        />
      )}
    </>
  );
};

export default AuthModalManager;

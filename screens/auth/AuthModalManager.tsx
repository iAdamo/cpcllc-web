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

  const switchToSignUp = () => {
    setIsSignInOpen(false);
  };

  const switchToSignIn = () => {
    setIsSignInOpen(true);
  };

  return (
    <>
      {isSignInOpen ? (
        <SignInModal isOpen={isModalOpen} onClose={handleClose} switchToSignUp={switchToSignUp} />
      ) : (
        <SignUpModal isOpen={isModalOpen} onClose={handleClose} switchToSignIn={switchToSignIn} />
      )}
    </>
  );
};

export default AuthModalManager;

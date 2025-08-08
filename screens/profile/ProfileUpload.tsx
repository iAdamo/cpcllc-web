
export const ProfileUploadButton = ({
  isUploading,
  triggerFileInput,
  fileInputRef,
  handleFileChange,
  isMobile = false,
}: {
  isUploading: boolean;
  triggerFileInput: (e: React.MouseEvent<HTMLButtonElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile?: boolean;
}) => {
  const iconSize = isMobile ? "w-5 h-5" : "w-6 h-6";

  return (
    <>
      <button
        type="button"
        className={`absolute ${
          isMobile ? "bottom-3 right-4 p-1" : "bottom-2 right-2 p-2"
        } rounded-full ${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
        }`}
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        {isUploading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${iconSize} text-gray-700 animate-spin`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${iconSize} text-gray-700`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
        )}
      </button>

      <input
        id="profile-picture-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
        onClick={(e) => e.stopPropagation()}
      />
    </>
  );
};

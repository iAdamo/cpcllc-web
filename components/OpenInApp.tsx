// import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import Image from "next/image";

const OpenInApp = () => {
  return (
    <Center className="md:hidden h-screen">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-2xl flex items-center justify-center">
              <Image
                src="/assets/logo-color.svg"
                alt="Company Logo"
                width={96}
                height={96}
                className="rounded-lg"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Continue in the App
          </h2>
          <p className="text-gray-600 mb-6">
            To access all features and enjoy the best experience, please
            download our mobile app.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="https://play.google.com/store/apps/details?id=com.your.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path
                  d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                  fill="currentColor"
                />
              </svg>
              Google Play
            </a>
            <a
              href="https://apps.apple.com/app/id-your-app-id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                  fill="currentColor"
                />
              </svg>
              App Store
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Already have the app?{" "}
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Open it now
            </button>
          </p>
        </div>
      </div>
    </Center>
  );
};

export default OpenInApp;

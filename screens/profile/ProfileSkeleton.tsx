import { Camera } from "lucide-react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 animate-pulse pb-24 lg:pb-8">
      <div className="h-48 lg:h-56 bg-gradient-to-br from-brand-200 to-brand-300" />
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="lg:flex gap-5">
          <div className="lg:w-72 xl:w-80 -mt-14 relative z-10 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-5 space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
                <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mx-auto" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex-1 mt-4 lg:mt-6 space-y-3">
            <div className="h-12 bg-white dark:bg-gray-900 rounded-2xl" />
            <div className="h-72 bg-white dark:bg-gray-900 rounded-2xl" />
            <div className="h-48 bg-white dark:bg-gray-900 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

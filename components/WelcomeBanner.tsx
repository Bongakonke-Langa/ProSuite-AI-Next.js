'use client';

interface WelcomeBannerProps {
  userName?: string;
}

export default function WelcomeBanner({ userName = 'Sbongakonke' }: WelcomeBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-prosuite-600 to-prosuite-500 rounded-lg p-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
        <div className="absolute right-8 top-8 w-32 h-32 border-4 border-white rounded-lg transform rotate-12"></div>
        <div className="absolute right-20 bottom-8 w-24 h-24 border-4 border-white rounded-lg transform -rotate-12"></div>
        <div className="absolute right-32 top-1/2 w-16 h-16 border-4 border-white rounded-lg transform rotate-45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-black mb-2">
          Good morning {userName}
        </h1>
        <p className="text-prosuite-100 text-lg">
          Welcome to your <span className="font-semibold">ProSuite</span> activity feed
        </p>
      </div>
    </div>
  );
}

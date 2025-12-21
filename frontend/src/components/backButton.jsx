import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallback = "/" }) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="
        inline-flex items-center
        gap-1.5
        px-2.5 py-1.5
        rounded-full
        bg-white/60 backdrop-blur-md
        border border-white/40
        shadow-sm
        text-gray-700 text-sm font-medium
        hover:bg-white hover:shadow-md
        transition-all duration-200
        active:scale-95
      "
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}

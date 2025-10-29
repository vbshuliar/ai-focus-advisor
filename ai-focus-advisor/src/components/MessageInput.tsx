import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  isLoading,
  disabled = false,
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading && !disabled) {
      onSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter your message..."
        disabled={isLoading || disabled}
        className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={onSend}
        disabled={isLoading || !value.trim() || disabled}
        className="h-[52px] w-[52px] rounded-lg bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
}

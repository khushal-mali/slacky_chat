import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 pb-4 w-full">
      <Editor
        variant="create"
        onSubmit={() => {}}
        placeholder={placeholder}
        disabled={false} 
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;

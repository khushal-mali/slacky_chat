import React from "react";
import { Button } from "./ui/button";
import { Smile } from "lucide-react";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  handleDelete: () => void;
  hideThreadButton?: boolean;
}

const Toolbar = ({
  handleDelete,
  handleEdit,
  handleThread,
  isPending,
  hideThreadButton,
  isAuthor,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <Button>
          <Smile className="" />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;

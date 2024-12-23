import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import EmojiPopver from "./emoji-popover";
import Hint from "./hint";
import { Button } from "./ui/button";

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
  handleReaction,
  isPending,
  hideThreadButton,
  isAuthor,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopver
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant={"ghost"} size={"sm"} disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopver>

        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={handleThread}
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant={"ghost"}
                onClick={handleEdit}
                size={"sm"}
                disabled={isPending}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>

            <Hint label="Delete message">
              <Button
                variant={"ghost"}
                onClick={handleDelete}
                size={"sm"}
                disabled={isPending}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;

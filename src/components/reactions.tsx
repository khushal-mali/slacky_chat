import React from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { cn } from "@/lib/utils";
import Hint from "./hint";
import EmojiPopver from "./emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex gap-1 items-center mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
          key={reaction._id}
          side="top"
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              reaction.memberIds.includes(currentMemberId) &&
                "border-blue-500 bg-blue-100/70 text-white"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}

      <EmojiPopver hint="Add reaction" onEmojiSelect={(emoji) => onChange(emoji.native)}>
        <button className="h-6 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
          <MdOutlineAddReaction className="size-4" /> 
        </button>
      </EmojiPopver>
    </div>
  );
};

export default Reactions;

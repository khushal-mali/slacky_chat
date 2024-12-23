"use client";

import useCreateOrGetConversation from "@/features/conversations/api/use-create-or-get-conversation";
import useMemberId from "@/hooks/use-member-id";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Conversation from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { memberId, workspaceId },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
        onError: () => {
          toast.error("Failed to create or get conversation.");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center flex-1 flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center flex-1 flex-col gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversation not found</span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;

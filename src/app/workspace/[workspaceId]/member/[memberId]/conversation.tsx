import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import useMemberId from "@/hooks/use-member-id";
import { Loader } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Header from "./header";
import ChatInput from "./chat-input";
import MessageList from "@/components/message-list";
import usePanel from "@/hooks/use-panel";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { onOpenProfile } = usePanel();
  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center flex-1 flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        onClick={() => onOpenProfile(memberId)}
      />

      <MessageList
        data={results}
        varient="conversation"
        memberImage={member?.user.image}
        memberName={member?.user?.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />

      <ChatInput conversationId={id} placeholder={`Message ${member?.user?.name}`} />
    </div>
  );
};

export default Conversation;

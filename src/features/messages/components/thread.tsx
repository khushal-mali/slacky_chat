import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import useGenerateUploadUrl from "@/features/upload/api/use-generate-upload-url";
import useChannelId from "@/hooks/use-channel-id";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import useCreateMessage from "../api/use-create-message";
import useGetMessage from "../api/use-get-message";
import { useGetMessages } from "../api/use-get-messages";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface TheadsProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const TIME_THRESHOLD = 5;

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEEE, MMMM d");
}

const Threads = ({ messageId, onClose }: TheadsProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
  const { results, loadMore, status } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({ image, body }: { body: string; image: File | null }) => {
    console.log(image);
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        console.log(url);

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        console.log(result);

        if (!result.ok) {
          throw new Error("Failed to upload image.");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error: any) {
      toast.error("Failed to send message.", error.message);
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col-reverse pb-4 overflow-auto message-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>

            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  isAuthor={message.memberId === currentMember?._id}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  createdAt={message._creationTime}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimeStamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        ))}

        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />

        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}

        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={currentMember?._id === message.memberId}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>

      <div className="px-4">
        <Editor
          key={editorKey}
          innerRef={editorRef}
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder="Reply.."
        />
      </div>
    </div>
  );
};

export default Threads;

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import useNewJoinCode from "@/features/workspaces/api/use-new-join-code";
import useConfirm from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate new one."
  );
  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    await mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated.");
        },
        onError: () => {
          toast.success("Failed to regenerated invite code.");
        },
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard."));
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant={"ghost"} size={"sm"}>
              Copy Link <CopyIcon className="ml-2 size-4" />
            </Button>
          </div>

          <div className="flex items-center w-full justify-between">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant={"outline"}
            >
              New Code
              <RefreshCcw className="ml-2 size-4" />
            </Button>
            <DialogClose>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
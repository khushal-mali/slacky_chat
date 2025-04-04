import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import InviteModal from "./invite-model";
import { PreferencesModal } from "./preferences-model";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <InviteModal
        name={workspace.name}
        open={inviteOpen}
        joinCode={workspace.joinCode}
        setOpen={setInviteOpen}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />

      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace?.name}</span>
              <ChevronDown className="shrink-0 size-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative mr-2 overflow-hidden text-white text-xl rounded-md flex items-center justify-center font-semibold bg-[#616061]">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start ">
                <p className="font-bold">{workspace?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button variant="transparent" size="sm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>

          <Hint label="New message" side="bottom">
            <Button variant="transparent" size="sm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;

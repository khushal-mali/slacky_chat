import Hint from "@/components/hint";
import { useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import { FaCaretDown } from "react-icons/fa";

interface WorkspaceSectionProps {
  label: string;
  hint: string;
  onNew?: () => void;
  children: React.ReactNode;
}

const WorkspaceSection = ({
  label,
  hint,
  onNew,
  children,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant={"transparent"}
          onClick={toggle}
          className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", on && "-rotate-90")}
          />
        </Button>
        <Button
          variant={"transparent"}
          size={"sm"}
          className="group px-1.5 text-sm text-[#f9edffcc] justify-start h-[28px] overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              variant={"transparent"}
              size={"iconSm"}
              onClick={onNew}
              className="opacity-0 group-hover:opacity-100 ml-auto transition-opacity p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>

      {on && children}
    </div>
  );
};

export default WorkspaceSection;

"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import React from "react";
import Toolbar from "./toolbar";
import Sidebar from "./Sidebar";
import WorkspaceSidebar from "./workspace-sidebar";
import usePanel from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import Threads from "@/features/messages/components/thread";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onClose } = usePanel();

  const showPanel = !!parentMessageId;

  return (
    <nav className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="ca-workspace-layout">
          <ResizablePanel defaultSize={20} minSize={11} className="bg-[#5E2C5F]">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Threads messageId={parentMessageId as Id<"messages">} onClose={onClose} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 text-muted-foreground animate-spin" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </nav>
  );
};

export default WorkspaceIdLayout;

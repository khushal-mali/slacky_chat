"use client";

import React from "react";
import Toolbar from "./toolbar";
import Sidebar from "./Sidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <nav className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </nav>
  );
};

export default WorkspaceIdLayout;

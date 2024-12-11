import { useCurrentMember } from "@/features/members/api/use-current-member";
import useWorkspaceId from "@/hooks/use-workspace-id";
import React from "react";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const currentMember = useCurrentMember({ workspaceId });
  console.log(currentMember);

  return <div>WorkspaceSidebar</div>;
};

export default WorkspaceSidebar;

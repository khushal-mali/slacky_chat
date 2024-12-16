import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfoByIdProps {
  id: Id<"workspaces">;
}

const useGetWorkspaceInfo = ({ id }: UseGetWorkspaceInfoByIdProps) => {
  const data = useQuery(api.workspaces.getInfoById, {
    id,
  });

  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetWorkspaceInfo;
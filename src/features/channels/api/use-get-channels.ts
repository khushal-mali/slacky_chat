import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetChannelsProps {
  workspaceId: Id<"workspaces">;
}

const useGetChannels = ({ workspaceId }: UseGetChannelsProps) => {
  const data = useQuery(api.channels.get, {
    workspaceId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetChannels;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import { useAuth } from "../context/AuthContext";

/* eslint-disable no-empty-pattern */
interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });

    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};
const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 50000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote");
      return vote(voteValue, postId, user!.id);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) <div>Loading votes...</div>;
  if (error) <div>Error: {error.message}</div>;

  const likes = votes?.filter((vote) => vote.vote === 1).length || 0;
  const dislikes = votes?.filter((vote) => vote.vote === -1).length || 0;
  const userVote = votes?.find((vote) => vote.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍 {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎 {dislikes}
      </button>
    </div>
  );
};
export default LikeButton;

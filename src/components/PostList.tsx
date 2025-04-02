import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";
import PostItem from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  avatar_url?: string;
  like_count: number;
  comment_count: number;
  image_url: string;
  created_at: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);
  return data as Post[];
};

const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) <div>Loading posts...</div>;
  if (error) <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post, i) => (
        <PostItem key={i} post={post} />
      ))}
    </div>
  );
};
export default PostList;

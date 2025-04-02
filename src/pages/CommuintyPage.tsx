import { useParams } from "react-router";
import CommunityDisplay from "../components/CommunityDisplay";

export const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Community Posts
      </h2>
      <CommunityDisplay communityId={Number(id)} />
    </div>
  );
};

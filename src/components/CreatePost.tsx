import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import supabase from "../supabase";
import { Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      throw new Error("Please select an image file.");
    }
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId || null,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">Content</label>
        <textarea
          id="content"
          rows={5}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Community</label>
        <select
          id="community"
          onChange={handleCommunityChange}
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        >
          <option value={""} className="bg-black text-white">
            --Select community--
          </option>
          {communities?.map((community) => (
            <option
              key={community.id}
              value={community.id}
              className="bg-black text-white"
            >
              {community.name}
            </option>
          ))}
        </select>
      </div>
      {selectedFile && (
        <div className="text-white text-sm">
          Selected File: {selectedFile.name}
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />{" "}
        </div>
      )}
      <div>
        <label
          htmlFor="image"
          className="mb-2 font-medium flex gap-4 border border-white/10 w-fit px-4 py-2 hover:bg-gray-50/10"
        >
          Upload <Upload />
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="w-full text-gray-200 hidden"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="cursor-pointer rounded py-2 px-4 text-white bg-purple-500 font-semibold"
        >
          {isPending ? (
            <div className="flex">
              Creating...
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            "Create Post"
          )}
        </button>
      </div>
      {isError && <div className="text-red-500">Error creating post</div>}
    </form>
  );
};
export default CreatePost;

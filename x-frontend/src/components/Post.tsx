import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Posts, User } from "../types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../utils/date/function";

const Post = ({ post }: { post: Posts }) => {
  const [comment, setComment] = useState("");

  const { data: authUser } = useQuery<User>({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/posts/${post._id}`,
          {
            withCredentials: true,
          }
        );
        toast.success("Post deleted successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.message;
          console.error("Error during logout:", error);
          toast.error(errorMessage || "Something went wrong");
        } else {
          console.error("Unexpected error:", error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/posts/like/${post._id}`, {},
          {
            withCredentials: true,
          }
        );
        console.log("response", response);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // const errorMessage = error.response?.data;
          console.error("Error during logout:", error);
          toast.error("Something went wrong");
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    onSuccess: (updatedLikes: string[]) => {
      queryClient.setQueryData(["posts"], (oldPosts: Posts[]) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            //  queryClient.invalidateQueries({ queryKey: ["posts"] });
            return {
              ...p,
              likes: updatedLikes,
            };
          }
          return p;
        });
      });
    },
  });

  const { mutate: commentPost, isPending: isCommentingPost } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/posts/comment/${post._id}`,
          {
            text: comment,
          },
          {
            withCredentials: true,
          }
        );
        console.log("response", response);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // const errorMessage = error.response?.data;
          console.error("Error during logout:", error);
          toast.error("Something went wrong");
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    onSuccess: (updatedComments: string[]) => {
      setComment("");
      queryClient.setQueryData(["posts"], (oldPosts: Posts[]) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: updatedComments,
            };
          }
          return p;
        });
      });
    },
  });

  const postOwner = post.user;
  const isLiked =
    Array.isArray(post.likes) && post.likes.includes(authUser?._id || "");

  const isMyPost = authUser?._id === post.user._id;

  const formattedDate = formatPostDate(post.createdAt || "");

  const isCommenting = false;

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCommentingPost) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profilePicture || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
                {isDeleting && <LoadingSpinner />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.image && (
              <img
                src={post.image}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  (
                    document.getElementById(
                      "comments_modal" + post._id
                    ) as HTMLDialogElement
                  )?.showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments?.length ?? 0}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {(post.comments?.length ?? 0) === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {(post.comments ?? []).map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user?.profilePicture ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user?.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user?.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}

                <span
                  className={`text-sm group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
                  }`}
                >
                  {post.likes?.length ?? 0}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;

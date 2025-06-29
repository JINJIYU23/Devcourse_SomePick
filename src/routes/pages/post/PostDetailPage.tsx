import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchPostByPostId } from "../../../apis/posts/postCrud";
import CommentList from "../../../components/PostDetail/CommentList";
import PostContent from "../../../components/PostDetail/PostContent";
import PostHeader from "../../../components/PostDetail/PostHeader";
import BackButton from "../../../components/common/BackButton";
import { useAuthStore } from "../../../stores/authStore";
import PostDetailSkeleton from "../../../components/PostDetail/PostDetailSkeleton";

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const session = useAuthStore((state) => state.session);
  const authId = session?.user.id;
  const [isLoading, setIsLoading] = useState(true);

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = await fetchPostByPostId(postId);
      if (data) {
        setPost(data);
      }
      setIsLoading(false);
    };
    loadPost();
  }, [postId]);

  const reloadPost = async () => {
    if (!postId) return;
    const data = await fetchPostByPostId(postId);
    if (data) {
      setPost(data);
    }
  };

  return (
    <>
      <div className="mx-auto w-[1080px] pt-[2vh] pb-[5vh]">
        <BackButton className="mb-[18px] text-[18px] dark:text-[var(--dark-gray-100)]" />
        <article className="border w-[1080px] h-full rounded-2xl border-[var(--primary-pink)] bg-[var(--primary-pink)]/24 px-[50px] py-[30px] dark:bg-[var(--dark-bg-secondary)]">
          {isLoading ? (
            <PostDetailSkeleton />
          ) : (
            <>
              <PostHeader post={post!} postId={postId} authId={authId} />
              <PostContent
                post={post!}
                postId={postId}
                onCommentAdd={reloadPost}
              />
              <section className="mt-[12px]">
                <article>
                  <CommentList
                    post={post!}
                    authId={authId}
                    postId={postId}
                    onCommentAdd={reloadPost}
                  />
                </article>
              </section>
            </>
          )}
        </article>
      </div>
    </>
  );
}

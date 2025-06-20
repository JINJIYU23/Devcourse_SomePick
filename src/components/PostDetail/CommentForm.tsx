import { useState } from "react";
import { createComment, updateComment } from "../../apis/comment";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { notifyChildComment, notifyComment } from "../../apis/notification";
import { useAuthStore } from "../../stores/authStore";
import { showSuccessToast, showWarnToast } from "../common/ShowToast";

interface CommentProps {
  className?: string;
  parentId?: number | null;
  isReply?: boolean;
  postId: number | null;
  parentAuthorId?: string;
  post: Post;
  onCommentAdd: () => void;
  toggleReply?: () => void;
  isEdit?: boolean;
  defaultValue?: string;
  commentId?: number;
}

export default function CommentForm({
  className = "",
  parentId,
  isReply = true,
  postId,
  post,
  onCommentAdd,
  toggleReply,
  isEdit = false,
  defaultValue = "",
  commentId,
  parentAuthorId,
}: CommentProps) {
  const [input, setInput] = useState(defaultValue);
  const { session } = useAuthStore();

  // 댓글 등록하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      showWarnToast("댓글을 작성해주세요!");
      return;
    }
    // 댓글 수정
    if (isEdit && commentId) {
      await updateComment(input, commentId);
      setInput("");
      onCommentAdd?.();
      showSuccessToast("댓글수정이 완료되었습니다!");
    }
    // 수정 아니면 새로운 댓글 등록
    else {
      const newComment = await createComment(input, postId, parentId);
      showSuccessToast("댓글이 등록되었습니다!");
      if (newComment) {
        setInput("");
        onCommentAdd?.();

        // 대댓글일때
        if (isReply) {
          if (parentId !== null) {
            await notifyChildComment(parentAuthorId!, postId!);
            toggleReply?.();
          }
          // 댓글일때
        } else {
          if (postId !== null) await notifyComment(post.author.id, postId);
        }
      }
    }
  };

  // Enter로 댓글 작성
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();

      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={`flex ${className}`}>
          {isReply && (
            <Icon
              width="16px"
              height="16px"
              left="-847px"
              top="-765px"
              className="cursor-pointer ml-[37px] mr-[7px] items-start mt-[10px]"
            />
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              session
                ? "댓글을 작성해주세요."
                : "로그인 후 댓글을 작성할 수 있어요."
            }
            className={`bg-white rounded-2xl dark:bg-[var(--dark-bg-secondary)] dark:border-[var(--primary-pink)] dark:border dark:text-[var(--dark-gray-700)] ${
              isReply ? "w-[918px]" : "w-[980px]"
            } resize-none px-[18px] py-[12px] text-[14px] mb-[10px] focus:outline-none focus:ring-2 focus:ring-[#FFC7ED] ${
              !session && "bg-[var(--gray-200)] text-gray-400"
            }`}
            disabled={!session}
            onKeyDown={handleKeyDown}
          ></textarea>
        </div>
        <div className="flex w-full">
          <Button
            type="submit"
            className="ml-auto w-[98px] h-[38px] dark:text-[var(--dark-black)]"
            disabled={!session}
          >
            등록
          </Button>
        </div>
      </form>
    </>
  );
}

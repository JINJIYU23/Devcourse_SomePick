import { useNavigate, useParams } from "react-router";
import { connectMatching, disconnectMatching } from "../../../apis/matching";
import { createChatRoom, fetchChatRoom } from "../../../apis/message";
import { notifyMatching } from "../../../apis/notification";
import ChatRequest from "../../../components/message/ChatRequest";

export default function ChatRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 채팅 연결 수락
  const handleAccept = async (id: string) => {
    if (!id) return;
    await connectMatching(id);
    await createChatRoom(id);
    const chatRoom = await fetchChatRoom(id);
    await notifyMatching(id, true);

    // 수락하면 바로 채팅방으로 이동 -> 연결중 목록으로 사용자이름도 이동
    if (chatRoom?.id) {
      navigate(`/message/${id}`);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      console.error("채팅방을 불러오지 못했습니다.");
    }
  };

  // 채팅 연결 거절
  const handleReject = async (id: string) => {
    if (!id) return;
    await disconnectMatching(id);
    await notifyMatching(id, false);
    navigate(`/message`);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <>
      <ChatRequest
        onAccept={handleAccept}
        onReject={handleReject}
        userId={id}
      />
    </>
  );
}

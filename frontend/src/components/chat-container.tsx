import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessageSkeleton from "./skeletons/message";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const {
        messages,
        isMessagesLoading,
        selectedUser,

        getMessages,
        subscribeToMessages,
        unSubscribeFromMessages,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof selectedUser?._id === "string")
            getMessages(selectedUser._id);
        subscribeToMessages();

        return () => unSubscribeFromMessages();
    }, [
        selectedUser?._id,
        getMessages,
        subscribeToMessages,
        unSubscribeFromMessages,
    ]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, idx) => {
                    const isCurrentUser = message.senderId === authUser?._id;

                    // Check if the next message is from a different sender or if it's the last message
                    const isLastInGroup =
                        idx === messages.length - 1 ||
                        messages[idx + 1].senderId !== message.senderId;

                    return (
                        <div
                            key={message._id}
                            className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
                            ref={isLastInGroup ? messageEndRef : null} // scroll to last message only
                        >
                            {/* Render avatar only for the last message in a group */}
                            {isLastInGroup && (
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img
                                            className="select-none"
                                            src={
                                                isCurrentUser
                                                    ? authUser?.profilePic ||
                                                      "/avatar.png"
                                                    : selectedUser?.profilePic ||
                                                      "/avatar.png"
                                            }
                                            alt="profile pic"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>

                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2 select-none"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <MessageInput />
        </div>
    );
};
export default ChatContainer;

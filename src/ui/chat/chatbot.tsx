import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import chatIcon from '@/public/chatbot/chat-icon.png';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

export default function Chatbot(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages((prev) => [
                ...prev,
                { text: newMessage.trim(), sender: 'user' },
            ]);
            setNewMessage('');

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { text: 'This is a bot reply.', sender: 'bot' },
                ]);
            }, 1000);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat icon */}
            <IconButton
                className={`${isOpen ? 'scale-110' : ''}`}
                onClick={toggleChat}
                sx={{
                    width: 56,
                    height: 56,
                    background: 'transparent',
                    padding: 0,
                    transition: 'transform 0.2s ease-in-out',
                }}
            >
                <Image
                    className="rounded-full"
                    layout="fill"
                    objectFit="cover"
                    src={chatIcon}
                    alt="Chat icon"
                />
            </IconButton>

            {/* Chat box */}
            {isOpen && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        bottom: '4rem',
                        right: '1.5rem',
                        height: '24rem',
                        width: '24rem',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '1rem',
                        zIndex: 1000,
                    }}
                >
                    {/* Header */}
                    <Box className="mb-2 text-lg font-semibold">
                        Chat with us
                    </Box>

                    {/* Chat content */}
                    <Box
                        className="flex h-64 grow flex-col gap-2 overflow-y-auto rounded-md border border-gray-200 p-2"
                        ref={chatContainerRef}
                    >
                        {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: `${
                                            message.sender === 'user'
                                                ? 'flex-end'
                                                : 'flex-start'
                                        }`,
                                    }}
                                >
                                    <p
                                        className={`max-w-[65%] break-words rounded-lg p-2 text-sm ${
                                            message.sender === 'user'
                                                ? 'bg-zinc-200 text-gray-800'
                                                : 'bg-[#DAEBCE] text-gray-800'
                                        }`}
                                    >
                                        {message.text}
                                    </p>
                                </Box>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">
                                No messages yet.
                            </p>
                        )}
                    </Box>

                    {/* Input and send button */}
                    <Box className="mt-2 flex items-center gap-2">
                        <TextField
                            placeholder="Type your message..."
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleSendMessage}
                        >
                            <SendIcon fontSize="small" />
                        </Button>
                    </Box>
                </Paper>
            )}
        </div>
    );
}

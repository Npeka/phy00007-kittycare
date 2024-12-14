'use client'; 
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import chatIcon from '@/public/chatbot/chat-icon.png';
import { useChat } from "ai/react";
import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

export default function Chatbot(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const user = useContext(AuthContext);
    const [userId, setUserId] = useState<string | null>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const {  messages, input, handleInputChange, handleSubmit } = useChat({
        api: `api/send-msg/${userId}`,
        onError: (e) => {
            console.log(e)
        }
        
    });

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    });

    useEffect(() => {
        if (user) {
            setUserId(user.uid);
        }
    }, [user]);

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
                        height: '26rem',
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
                        Trợ lý ảo KittyCare
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
                                            index % 2 == 0
                                                ? 'flex-end'
                                                : 'flex-start'
                                        }`,
                                    }}
                                >
                                    <p
                                        className={`max-w-[65%] text-justify rounded-lg p-2 text-sm ${
                                            index % 2 == 0
                                                ? 'bg-zinc-200 text-gray-800'
                                                : 'bg-[#DAEBCE] text-gray-800'
                                        }`}
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {message.content}
                                    </p>
                                </Box>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">
                                Hãy bắt đầu cuộc trò chuyện!
                            </p>
                        )}
                    </Box>

                    {/* Input and send button */}
                    <Box className="mt-2 flex items-center gap-2">
                        <TextField
                            placeholder="Nhập tin nhắn..."
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleSubmit}
                        >
                            <SendIcon fontSize="small" />
                        </Button>
                    </Box>
                </Paper>
            )}
        </div>
    );
}

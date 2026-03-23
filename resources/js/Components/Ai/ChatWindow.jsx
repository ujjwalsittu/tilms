import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Text, Button, Textarea, VStack } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    return (
        <Flex justify={isUser ? 'flex-end' : 'flex-start'} mb={3}>
            <Box
                maxW="75%"
                bg={isUser ? 'blue.500' : 'white'}
                color={isUser ? 'white' : 'gray.800'}
                px={4}
                py={3}
                borderRadius="lg"
                borderBottomRightRadius={isUser ? 'sm' : 'lg'}
                borderBottomLeftRadius={isUser ? 'lg' : 'sm'}
                boxShadow="sm"
            >
                <Text fontSize="sm" whiteSpace="pre-wrap">{message.content}</Text>
                {message.timestamp && (
                    <Text fontSize="xs" opacity={0.6} mt={1}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                )}
            </Box>
        </Flex>
    );
}

export default function ChatWindow({
    messages = [],
    onSend,
    processing = false,
    placeholder = 'Type your message...',
    title,
}) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || processing) return;
        onSend(input.trim());
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Flex
            direction="column"
            h="calc(100vh - 140px)"
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            overflow="hidden"
        >
            {title && (
                <Box px={4} py={3} bg="white" borderBottomWidth="1px">
                    <Text fontWeight="semibold">{title}</Text>
                </Box>
            )}

            {/* Messages area */}
            <Box flex={1} overflowY="auto" p={4}>
                {messages.length === 0 ? (
                    <Flex h="full" align="center" justify="center">
                        <Text color="gray.400" fontSize="sm">Start a conversation...</Text>
                    </Flex>
                ) : (
                    <VStack gap={0} align="stretch">
                        {messages.map((msg, i) => (
                            <MessageBubble key={i} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                    </VStack>
                )}
            </Box>

            {/* Input area */}
            <Box p={3} bg="white" borderTopWidth="1px">
                <Flex gap={2}>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={2}
                        resize="none"
                        fontSize="sm"
                        flex={1}
                    />
                    <Button
                        colorPalette="blue"
                        onClick={handleSend}
                        loading={processing}
                        alignSelf="flex-end"
                        px={4}
                    >
                        <FiSend />
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}

import { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Flex,
    Text,
    Button,
    Textarea,
    VStack,
    Badge,
} from '@chakra-ui/react';
import { FiArrowLeft, FiSend, FiUser, FiCpu } from 'react-icons/fi';

const DOMAIN_LABELS = {
    web_development: 'Web Development',
    mern_stack: 'MERN Stack',
    data_science: 'Data Science',
    ai_engineering: 'AI Engineering',
    data_analytics: 'Data Analytics',
    php: 'PHP',
    cloud_architecture: 'Cloud Architecture',
};

const DIFFICULTY_COLORS = {
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'red',
};

function InterviewMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <Flex
            justify={isUser ? 'flex-end' : 'flex-start'}
            mb={4}
            align="flex-end"
            gap={2}
        >
            {/* Interviewer avatar */}
            {!isUser && (
                <Flex
                    w={8}
                    h={8}
                    bg="purple.500"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    shrink={0}
                    mb={1}
                >
                    <Box color="white" fontSize="sm">
                        <FiCpu size={14} />
                    </Box>
                </Flex>
            )}

            <Box maxW="70%">
                {/* Role label */}
                <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={1}
                    textAlign={isUser ? 'right' : 'left'}
                    fontWeight="medium"
                >
                    {isUser ? 'You' : 'Interviewer'}
                </Text>

                {/* Bubble */}
                <Box
                    bg={isUser ? 'blue.500' : 'white'}
                    color={isUser ? 'white' : 'gray.800'}
                    px={4}
                    py={3}
                    borderRadius="lg"
                    borderBottomRightRadius={isUser ? 'sm' : 'lg'}
                    borderBottomLeftRadius={isUser ? 'lg' : 'sm'}
                    boxShadow="sm"
                    borderWidth={isUser ? '0' : '1px'}
                    borderColor="gray.200"
                >
                    <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.6">
                        {message.content}
                    </Text>
                    {message.timestamp && (
                        <Text
                            fontSize="xs"
                            opacity={0.6}
                            mt={1.5}
                            textAlign="right"
                        >
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    )}
                </Box>
            </Box>

            {/* User avatar */}
            {isUser && (
                <Flex
                    w={8}
                    h={8}
                    bg="blue.500"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    shrink={0}
                    mb={1}
                >
                    <Box color="white" fontSize="sm">
                        <FiUser size={14} />
                    </Box>
                </Flex>
            )}
        </Flex>
    );
}

export default function InterviewChat({ conversation }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const { post, processing } = useForm();

    const messages = (conversation.messages || []).map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at,
    }));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || processing) return;
        const text = input.trim();
        setInput('');
        post(route('student.ai.interview.respond', conversation.id), {
            data: { message: text },
            preserveScroll: true,
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const domain = conversation.context_data?.domain;
    const difficulty = conversation.context_data?.difficulty;

    return (
        <StudentLayout title="AI Interview Simulator">
            <Head title={conversation.title || 'Interview Session'} />

            <Box maxW="4xl" mx="auto" px={4} py={4}>
                {/* Header */}
                <Flex align="center" gap={3} mb={4}>
                    <Link href={route('student.ai.interview.index')}>
                        <Button variant="ghost" size="sm" px={2}>
                            <FiArrowLeft style={{ marginRight: '4px' }} />
                            Back
                        </Button>
                    </Link>
                    <Box flex={1}>
                        <Flex align="center" gap={2} wrap="wrap">
                            <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                                {conversation.title || 'Interview Session'}
                            </Text>
                            {domain && (
                                <Badge colorPalette="purple" fontSize="xs">
                                    {DOMAIN_LABELS[domain] || domain}
                                </Badge>
                            )}
                            {difficulty && (
                                <Badge
                                    colorPalette={DIFFICULTY_COLORS[difficulty] || 'gray'}
                                    fontSize="xs"
                                >
                                    {difficulty}
                                </Badge>
                            )}
                        </Flex>
                        <Text fontSize="xs" color="gray.400">
                            {conversation.created_at
                                ? new Date(conversation.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : ''}
                        </Text>
                    </Box>
                    {conversation.total_tokens_used != null && (
                        <Text fontSize="xs" color="gray.400">
                            {conversation.total_tokens_used.toLocaleString()} tokens
                        </Text>
                    )}
                </Flex>

                {/* Chat interface */}
                <Flex
                    direction="column"
                    h="calc(100vh - 160px)"
                    bg="gray.50"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                    overflow="hidden"
                >
                    {/* Interview info banner */}
                    <Box px={4} py={2} bg="purple.50" borderBottomWidth="1px" borderColor="purple.100">
                        <Text fontSize="xs" color="purple.700">
                            You are in a mock interview session. Answer questions as you would in a real interview.
                            Press <Box as="strong">Enter</Box> to send, <Box as="strong">Shift+Enter</Box> for new line.
                        </Text>
                    </Box>

                    {/* Messages */}
                    <Box flex={1} overflowY="auto" p={4} bg="gray.50">
                        {messages.length === 0 ? (
                            <Flex h="full" align="center" justify="center">
                                <Box textAlign="center">
                                    <Box color="gray.300" mb={3} mx="auto">
                                        <FiCpu size={32} style={{ margin: '0 auto' }} />
                                    </Box>
                                    <Text color="gray.400" fontSize="sm">
                                        The interviewer will start shortly...
                                    </Text>
                                </Box>
                            </Flex>
                        ) : (
                            <VStack gap={0} align="stretch">
                                {messages.map((msg, i) => (
                                    <InterviewMessage key={i} message={msg} />
                                ))}
                                <div ref={messagesEndRef} />
                            </VStack>
                        )}
                    </Box>

                    {/* Input */}
                    <Box p={3} bg="white" borderTopWidth="1px">
                        <Flex gap={2}>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your answer... (Shift+Enter for new line)"
                                rows={2}
                                resize="none"
                                fontSize="sm"
                                flex={1}
                                disabled={processing}
                            />
                            <Button
                                colorPalette="purple"
                                onClick={handleSend}
                                loading={processing}
                                alignSelf="flex-end"
                                px={4}
                                disabled={!input.trim()}
                            >
                                <FiSend />
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </StudentLayout>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import ChatWindow from '@/Components/Ai/ChatWindow';
import { Box, Flex, Text, Button, Badge } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

export default function DoubtChat({ conversation }) {
    const { post, processing } = useForm();

    const handleSend = (message) => {
        post(route('student.ai.doubt.ask'), {
            data: {
                message,
                conversation_id: conversation.id,
            },
            preserveScroll: true,
        });
    };

    const messages = (conversation.messages || []).map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at,
    }));

    return (
        <StudentLayout title="AI Doubt Assistant">
            <Head title={conversation.title || 'Doubt Assistant'} />

            <Box maxW="4xl" mx="auto" px={4} py={4}>
                {/* Back navigation + header */}
                <Flex align="center" gap={3} mb={4}>
                    <Link href={route('student.ai.doubt.index')}>
                        <Button variant="ghost" size="sm" px={2}>
                            <FiArrowLeft style={{ marginRight: '4px' }} />
                            Back
                        </Button>
                    </Link>
                    <Box flex={1}>
                        <Flex align="center" gap={2}>
                            <Text fontWeight="semibold" fontSize="lg" color="gray.800" noOfLines={1}>
                                {conversation.title || 'Doubt Conversation'}
                            </Text>
                            {conversation.context_type && (
                                <Badge colorScheme="blue" fontSize="xs">
                                    {conversation.context_type}
                                </Badge>
                            )}
                        </Flex>
                        <Text fontSize="xs" color="gray.400">
                            Started {conversation.created_at
                                ? new Date(conversation.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : ''}
                        </Text>
                    </Box>
                </Flex>

                {/* Chat window */}
                <ChatWindow
                    messages={messages}
                    onSend={handleSend}
                    processing={processing}
                    placeholder="Type your follow-up question... (Shift+Enter for new line)"
                />
            </Box>
        </StudentLayout>
    );
}

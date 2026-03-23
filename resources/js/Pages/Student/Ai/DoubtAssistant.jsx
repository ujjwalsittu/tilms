import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Flex,
    Text,
    Button,
    Textarea,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { FiMessageCircle, FiPlus, FiChevronRight } from 'react-icons/fi';

export default function DoubtAssistant({ conversations }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        cohort_id: '',
        task_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.ai.doubt.ask'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <StudentLayout title="AI Doubt Assistant">
            <Head title="AI Doubt Assistant" />

            <Box maxW="4xl" mx="auto" px={4} py={6}>
                {/* Header */}
                <Flex justify="space-between" align="flex-start" mb={6}>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            AI Doubt Assistant
                        </Text>
                        <Text color="gray.500" mt={1} fontSize="sm">
                            Ask any question about your course, tasks, or concepts. Get instant AI-powered help.
                        </Text>
                    </Box>
                    <Button
                        colorPalette="blue"
                        onClick={() => setShowForm(!showForm)}
                        size="sm"
                    >
                        <FiPlus style={{ marginRight: '6px' }} />
                        New Question
                    </Button>
                </Flex>

                {/* New question form */}
                {showForm && (
                    <Box
                        bg="white"
                        borderWidth="1px"
                        borderColor="blue.200"
                        borderRadius="lg"
                        p={5}
                        mb={6}
                        boxShadow="sm"
                    >
                        <Text fontWeight="semibold" mb={3} color="gray.700">
                            Ask a New Question
                        </Text>
                        <form onSubmit={handleSubmit}>
                            <VStack gap={4} align="stretch">
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                                        Your Question <Box as="span" color="red.500">*</Box>
                                    </Text>
                                    <Textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Describe your doubt or question in detail..."
                                        rows={4}
                                        resize="vertical"
                                        fontSize="sm"
                                    />
                                    {errors.message && (
                                        <Text fontSize="xs" color="red.500" mt={1}>
                                            {errors.message}
                                        </Text>
                                    )}
                                </Box>

                                <Flex gap={4} wrap="wrap">
                                    <Box flex={1} minW="200px">
                                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                                            Cohort (optional)
                                        </Text>
                                        <select
                                            value={data.cohort_id}
                                            onChange={(e) => setData('cohort_id', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                background: 'white',
                                                color: '#4a5568',
                                            }}
                                        >
                                            <option value="">Select cohort...</option>
                                        </select>
                                    </Box>
                                    <Box flex={1} minW="200px">
                                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                                            Related Task (optional)
                                        </Text>
                                        <select
                                            value={data.task_id}
                                            onChange={(e) => setData('task_id', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                background: 'white',
                                                color: '#4a5568',
                                            }}
                                        >
                                            <option value="">Select task...</option>
                                        </select>
                                    </Box>
                                </Flex>

                                <Flex justify="flex-end" gap={3}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowForm(false);
                                            reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        colorPalette="blue"
                                        type="submit"
                                        size="sm"
                                        loading={processing}
                                        disabled={!data.message.trim()}
                                    >
                                        Ask AI
                                    </Button>
                                </Flex>
                            </VStack>
                        </form>
                    </Box>
                )}

                {/* Conversations list */}
                <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={3}>
                        Past Conversations
                    </Text>

                    {conversations.data.length === 0 ? (
                        <Box
                            textAlign="center"
                            py={12}
                            bg="white"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="gray.200"
                        >
                            <Box color="gray.300" mb={3} fontSize="3xl">
                                <FiMessageCircle style={{ margin: '0 auto' }} />
                            </Box>
                            <Text color="gray.500" fontSize="sm">
                                No conversations yet. Ask your first question!
                            </Text>
                        </Box>
                    ) : (
                        <VStack gap={3} align="stretch">
                            {conversations.data.map((conversation) => (
                                <Link
                                    key={conversation.id}
                                    href={route('student.ai.doubt.show', conversation.id)}
                                >
                                    <Box
                                        bg="white"
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        borderRadius="lg"
                                        p={4}
                                        _hover={{ borderColor: 'blue.300', boxShadow: 'sm' }}
                                        transition="all 0.15s"
                                        cursor="pointer"
                                    >
                                        <Flex justify="space-between" align="flex-start">
                                            <Box flex={1} mr={3}>
                                                <HStack gap={2} mb={1}>
                                                    <Text fontWeight="semibold" fontSize="sm" color="gray.800" noOfLines={1}>
                                                        {conversation.title || 'Untitled Conversation'}
                                                    </Text>
                                                    {conversation.context_type && (
                                                        <Badge colorPalette="blue" fontSize="xs">
                                                            {conversation.context_type}
                                                        </Badge>
                                                    )}
                                                </HStack>
                                                {conversation.last_message && (
                                                    <Text fontSize="xs" color="gray.500" noOfLines={2}>
                                                        {conversation.last_message}
                                                    </Text>
                                                )}
                                            </Box>
                                            <Flex direction="column" align="flex-end" shrink={0} gap={1}>
                                                <Text fontSize="xs" color="gray.400">
                                                    {conversation.created_at
                                                        ? new Date(conversation.created_at).toLocaleDateString()
                                                        : ''}
                                                </Text>
                                                <Box color="gray.400">
                                                    <FiChevronRight size={14} />
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Link>
                            ))}
                        </VStack>
                    )}

                    {/* Pagination */}
                    {conversations.last_page > 1 && (
                        <Flex justify="center" gap={2} mt={5}>
                            {conversations.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'}>
                                    <Button
                                        size="xs"
                                        variant={link.active ? 'solid' : 'outline'}
                                        colorPalette={link.active ? 'blue' : 'gray'}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </Link>
                            ))}
                        </Flex>
                    )}
                </Box>
            </Box>
        </StudentLayout>
    );
}

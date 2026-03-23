import { Head, Link, useForm, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    Box, Button, Textarea, Text, Flex, HStack, VStack, Badge, Field,
} from '@chakra-ui/react';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

function MessageBubble({ message }) {
    const isAdmin = message.sender_role === 'admin' || message.sender_role === 'instructor';

    return (
        <Box
            bg={isAdmin ? 'blue.50' : 'gray.50'}
            borderRadius="lg"
            p={4}
            borderWidth="1px"
            borderColor={isAdmin ? 'blue.100' : 'gray.200'}
        >
            <Flex justify="space-between" align="center" mb={2}>
                <HStack gap={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                        {message.sender?.name ?? 'Unknown'}
                    </Text>
                    {isAdmin && (
                        <Badge colorPalette="blue" size="sm" variant="subtle">
                            {message.sender_role}
                        </Badge>
                    )}
                </HStack>
                <Text fontSize="xs" color="gray.400">
                    {message.created_at
                        ? new Date(message.created_at).toLocaleString()
                        : '—'}
                </Text>
            </Flex>
            <Text fontSize="sm" whiteSpace="pre-wrap">{message.body}</Text>
        </Box>
    );
}

export default function SupportShow({ ticket, messages }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
    });

    const handleReply = (e) => {
        e.preventDefault();
        post(route('student.support.reply', ticket.id), {
            onSuccess: () => reset('body'),
        });
    };

    return (
        <StudentLayout title="Support">
            <Head title={`Ticket: ${ticket.subject}`} />
            <FlashMessage />

            <VStack gap={6} align="stretch">
                {/* Ticket Header */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Flex justify="space-between" align="flex-start" mb={4}>
                        <Box flex={1} mr={4}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>{ticket.subject}</Text>
                            <HStack gap={3} flexWrap="wrap">
                                <HStack gap={1}>
                                    <Text fontSize="xs" color="gray.500">Status:</Text>
                                    <StatusBadge status={ticket.status} />
                                </HStack>
                                <HStack gap={1}>
                                    <Text fontSize="xs" color="gray.500">Priority:</Text>
                                    <StatusBadge status={ticket.priority} />
                                </HStack>
                                <Text fontSize="xs" color="gray.400">
                                    Opened{' '}
                                    {ticket.created_at
                                        ? new Date(ticket.created_at).toLocaleDateString()
                                        : '—'}
                                </Text>
                            </HStack>
                        </Box>
                        <Link href={route('student.support.index')}>
                            <Button variant="outline" size="sm">
                                <FiArrowLeft />
                                Back
                            </Button>
                        </Link>
                    </Flex>
                </Box>

                {/* Message Thread */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>
                        Conversation
                    </Text>

                    {messages && messages.length > 0 ? (
                        <VStack gap={4} align="stretch" mb={6}>
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}
                        </VStack>
                    ) : (
                        <Box bg="gray.50" borderRadius="md" p={6} textAlign="center" mb={6}>
                            <Text color="gray.500" fontSize="sm">No messages yet.</Text>
                        </Box>
                    )}

                    {/* Reply Form */}
                    {ticket.status !== 'resolved' ? (
                        <Box borderTopWidth="1px" borderColor="gray.100" pt={5}>
                            <Text fontWeight="medium" fontSize="sm" mb={3}>Reply</Text>
                            <form onSubmit={handleReply}>
                                <VStack gap={3} align="stretch">
                                    <Field.Root invalid={!!errors.body}>
                                        <Textarea
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Type your reply..."
                                            rows={4}
                                        />
                                        {errors.body && <Field.ErrorText>{errors.body}</Field.ErrorText>}
                                    </Field.Root>
                                    <Flex justify="flex-end">
                                        <Button
                                            type="submit"
                                            colorPalette="blue"
                                            loading={processing}
                                            size="sm"
                                        >
                                            <FiSend />
                                            Send Reply
                                        </Button>
                                    </Flex>
                                </VStack>
                            </form>
                        </Box>
                    ) : (
                        <Box bg="green.50" borderRadius="md" p={4} borderWidth="1px" borderColor="green.100">
                            <Text fontSize="sm" color="green.700" textAlign="center">
                                This ticket has been resolved. Open a new ticket if you need further assistance.
                            </Text>
                        </Box>
                    )}
                </Box>
            </VStack>
        </StudentLayout>
    );
}

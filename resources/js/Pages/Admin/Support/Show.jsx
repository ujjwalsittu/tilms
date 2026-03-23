import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Text, Flex, Badge, VStack, HStack, Textarea, Field,
    NativeSelect,
} from '@chakra-ui/react';

const statusBadgeColor = (status) => {
    switch (status) {
        case 'open': return 'blue';
        case 'in_progress': return 'yellow';
        case 'resolved': return 'green';
        case 'closed': return 'gray';
        default: return 'gray';
    }
};

const priorityBadgeColor = (priority) => {
    switch (priority) {
        case 'urgent': return 'red';
        case 'high': return 'orange';
        case 'medium': return 'yellow';
        case 'low': return 'gray';
        default: return 'gray';
    }
};

function MessageBubble({ message }) {
    const isAdmin = message.sender_role === 'admin' || message.user?.role === 'admin';
    return (
        <Box
            alignSelf={isAdmin ? 'flex-end' : 'flex-start'}
            maxW="80%"
            bg={isAdmin ? 'blue.50' : 'gray.50'}
            borderRadius="lg"
            p={4}
            borderWidth="1px"
            borderColor={isAdmin ? 'blue.200' : 'gray.200'}
        >
            <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="semibold" color={isAdmin ? 'blue.700' : 'gray.700'}>
                    {message.user?.name ?? 'Unknown'}
                    {isAdmin && <Text as="span" fontSize="xs" color="blue.500" ml={1}>(Admin)</Text>}
                </Text>
                <Text fontSize="xs" color="gray.400">
                    {message.created_at ? new Date(message.created_at).toLocaleString() : ''}
                </Text>
            </Flex>
            <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">{message.message}</Text>
        </Box>
    );
}

export default function SupportShow({ ticket, messages }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const handleReply = (e) => {
        e.preventDefault();
        post(route('admin.support.reply', ticket.id), {
            onSuccess: () => reset('message'),
        });
    };

    const handleStatusChange = (e) => {
        router.put(route('admin.support.update', ticket.id), { status: e.target.value }, { preserveState: true });
    };

    return (
        <AdminLayout title="Support Ticket">
            <Head title={`Ticket #${ticket.id} - Admin`} />

            <VStack gap={6} align="stretch">
                {/* Ticket Header */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                        <Box flex={1}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>{ticket.subject}</Text>
                            <HStack gap={3} flexWrap="wrap">
                                <Badge colorPalette={statusBadgeColor(ticket.status)} size="sm">
                                    {ticket.status}
                                </Badge>
                                <Badge colorPalette={priorityBadgeColor(ticket.priority)} size="sm">
                                    {ticket.priority ?? 'medium'}
                                </Badge>
                                <Text fontSize="sm" color="gray.500">
                                    From: {ticket.user?.name ?? '—'} ({ticket.user?.email ?? '—'})
                                </Text>
                                <Text fontSize="sm" color="gray.400">
                                    Opened: {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}
                                </Text>
                            </HStack>
                        </Box>
                        <HStack gap={2}>
                            <NativeSelect.Root size="sm" maxW="44">
                                <NativeSelect.Field
                                    value={ticket.status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            <Link href={route('admin.support.index')}>
                                <Button size="sm" variant="outline">Back</Button>
                            </Link>
                        </HStack>
                    </Flex>
                </Box>

                {/* Message Thread */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Messages</Text>
                    <VStack gap={3} align="stretch">
                        {messages && messages.length > 0 ? (
                            messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))
                        ) : (
                            <Text color="gray.500" fontSize="sm">No messages yet.</Text>
                        )}
                    </VStack>
                </Box>

                {/* Reply Form */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Reply</Text>
                    <form onSubmit={handleReply}>
                        <VStack gap={4} align="stretch">
                            <Field.Root invalid={!!errors.message}>
                                <Textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Type your reply..."
                                    rows={4}
                                />
                                {errors.message && <Field.ErrorText>{errors.message}</Field.ErrorText>}
                            </Field.Root>
                            <Flex>
                                <Button type="submit" colorPalette="blue" loading={processing}>
                                    Send Reply
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </AdminLayout>
    );
}

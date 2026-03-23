import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Button,
    Text,
    Flex,
    HStack,
    VStack,
    Textarea,
    Badge,
} from '@chakra-ui/react';

// ─── Avatar circle ────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
    const initials = name
        ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const colors = ['blue.500', 'purple.500', 'green.500', 'orange.500', 'teal.500', 'pink.500'];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    return (
        <Box
            w={`${size}px`}
            h={`${size}px`}
            borderRadius="full"
            bg={colors[colorIndex]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
        >
            <Text fontSize="xs" color="white" fontWeight="bold" lineHeight="1">
                {initials}
            </Text>
        </Box>
    );
}

// ─── Role badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
    if (!role || role === 'student') return null;
    const palette = role === 'instructor' ? 'blue' : role === 'admin' ? 'red' : 'gray';
    return (
        <Badge colorPalette={palette} variant="subtle" fontSize="2xs" textTransform="capitalize">
            {role}
        </Badge>
    );
}

// ─── Single message card ──────────────────────────────────────────────────────
function MessageCard({ discussion, discussions, cohortTask, depth = 0 }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const replies = discussions.filter((d) => d.parent_id === discussion.id);

    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
        parent_id: discussion.id,
    });

    const handleReplySubmit = (e) => {
        e.preventDefault();
        post(route('student.discussions.store', cohortTask.id), {
            onSuccess: () => {
                reset();
                setShowReplyForm(false);
            },
        });
    };

    const isOwn = discussion.is_own ?? false;

    return (
        <Box>
            <Box
                borderWidth="1px"
                borderRadius="md"
                p={3}
                bg={depth === 0 ? 'white' : 'gray.50'}
                borderColor={depth === 0 ? 'gray.200' : 'gray.100'}
                _hover={{ borderColor: 'blue.200' }}
                transition="border-color 0.15s"
            >
                {/* Message header */}
                <Flex justify="space-between" align="flex-start" mb={2}>
                    <HStack gap={2} align="center">
                        <Avatar name={discussion.user?.name} size={depth === 0 ? 32 : 26} />
                        <Box>
                            <HStack gap={1.5} align="center">
                                <Text fontSize="sm" fontWeight="semibold" lineHeight="1.2">
                                    {discussion.user?.name ?? 'Unknown User'}
                                </Text>
                                <RoleBadge role={discussion.user?.role} />
                                {isOwn && (
                                    <Badge colorPalette="gray" variant="subtle" fontSize="2xs">You</Badge>
                                )}
                            </HStack>
                        </Box>
                    </HStack>
                    <Text fontSize="xs" color="gray.400" flexShrink={0} ml={2}>
                        {new Date(discussion.created_at).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </Flex>

                {/* Message body */}
                <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap" lineHeight="1.6" mb={2}>
                    {discussion.body}
                </Text>

                {/* Actions */}
                <HStack gap={1}>
                    <Button
                        size="xs"
                        variant="ghost"
                        color="blue.500"
                        _hover={{ bg: 'blue.50' }}
                        onClick={() => setShowReplyForm((v) => !v)}
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </Button>
                    {replies.length > 0 && (
                        <Text fontSize="xs" color="gray.400">
                            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                        </Text>
                    )}
                </HStack>
            </Box>

            {/* Inline reply form */}
            {showReplyForm && (
                <Box
                    ml={6}
                    mt={2}
                    as="form"
                    onSubmit={handleReplySubmit}
                    borderLeftWidth="2px"
                    borderLeftColor="blue.200"
                    pl={3}
                >
                    <Textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder={`Reply to ${discussion.user?.name ?? 'this message'}...`}
                        size="sm"
                        rows={3}
                        mb={2}
                        bg="white"
                        borderColor={errors.body ? 'red.400' : 'gray.200'}
                        _focus={{ borderColor: 'blue.400' }}
                        autoFocus
                    />
                    {errors.body && (
                        <Text color="red.500" fontSize="xs" mb={1}>{errors.body}</Text>
                    )}
                    <HStack gap={2}>
                        <Button size="xs" colorPalette="blue" type="submit" loading={processing}>
                            Post Reply
                        </Button>
                        <Button
                            size="xs"
                            variant="ghost"
                            type="button"
                            onClick={() => { setShowReplyForm(false); reset(); }}
                        >
                            Cancel
                        </Button>
                    </HStack>
                </Box>
            )}

            {/* Nested replies */}
            {replies.length > 0 && (
                <Box ml={6} mt={2} borderLeftWidth="2px" borderLeftColor="gray.200" pl={3}>
                    <VStack gap={2} align="stretch">
                        {replies.map((reply) => (
                            <MessageCard
                                key={reply.id}
                                discussion={reply}
                                discussions={discussions}
                                cohortTask={cohortTask}
                                depth={depth + 1}
                            />
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

// ─── New top-level message form ───────────────────────────────────────────────
function NewMessageForm({ cohortTask }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
        parent_id: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.discussions.store', cohortTask.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg="white"
            mt={4}
        >
            <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
                Start a Discussion
            </Text>
            <Textarea
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                placeholder="Ask a question, share an insight, or help a classmate..."
                rows={4}
                mb={2}
                bg="gray.50"
                borderColor={errors.body ? 'red.400' : 'gray.200'}
                _focus={{ borderColor: 'blue.400', bg: 'white' }}
            />
            {errors.body && (
                <Text color="red.500" fontSize="sm" mb={2}>{errors.body}</Text>
            )}
            <Button colorPalette="blue" size="sm" type="submit" loading={processing}>
                Post Message
            </Button>
        </Box>
    );
}

// ─── Main page (also works embedded) ─────────────────────────────────────────
export default function Discussion({ cohortTask, discussions, embedded = false }) {
    const topLevel = (discussions ?? []).filter((d) => !d.parent_id);

    const content = (
        <Box>
            {!embedded && <FlashMessage />}

            {/* Header */}
            <Flex mb={4} align="center" justify="space-between">
                <Box>
                    <Text as="h2" fontSize={embedded ? 'lg' : 'xl'} fontWeight="bold">
                        Discussion
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        {topLevel.length} {topLevel.length === 1 ? 'topic' : 'topics'}
                        {discussions && discussions.length !== topLevel.length
                            ? ` · ${discussions.length - topLevel.length} replies`
                            : ''}
                    </Text>
                </Box>
                <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                    {discussions?.length ?? 0} messages
                </Badge>
            </Flex>

            {/* Message list */}
            {topLevel.length === 0 ? (
                <Box
                    textAlign="center"
                    py={10}
                    borderWidth="1px"
                    borderRadius="md"
                    borderStyle="dashed"
                    bg="gray.50"
                >
                    <Text color="gray.500" fontSize="sm">
                        No messages yet. Be the first to start a discussion!
                    </Text>
                </Box>
            ) : (
                <VStack gap={3} align="stretch">
                    {topLevel.map((discussion) => (
                        <MessageCard
                            key={discussion.id}
                            discussion={discussion}
                            discussions={discussions}
                            cohortTask={cohortTask}
                            depth={0}
                        />
                    ))}
                </VStack>
            )}

            {/* New message form */}
            <NewMessageForm cohortTask={cohortTask} />
        </Box>
    );

    // When embedded in Show.jsx, just return the content without a layout wrapper
    if (embedded) {
        return content;
    }

    return (
        <StudentLayout title="Discussion">
            <Head title={`Discussion – Task ${cohortTask?.id}`} />
            <Box maxW="800px" mx="auto" px={4} py={6}>
                <HStack mb={4}>
                    <Link href={route('student.tasks.show', cohortTask?.id)}>
                        <Text fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                            ← Back to Task
                        </Text>
                    </Link>
                </HStack>
                {content}
            </Box>
        </StudentLayout>
    );
}

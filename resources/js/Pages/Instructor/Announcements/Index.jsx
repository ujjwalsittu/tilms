import { Head, useForm, router } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    Textarea,
    Text,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';

function AnnouncementItem({ announcement, cohortId, onDelete }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title,
        body: announcement.body,
        is_pinned: announcement.is_pinned,
    });

    const handleSave = (e) => {
        e.preventDefault();
        put(route('instructor.announcements.update', [cohortId, announcement.id]), {
            onSuccess: () => setEditing(false),
        });
    };

    if (editing) {
        return (
            <Box as="form" onSubmit={handleSave} p={4} borderRadius="md" borderWidth="1px" borderColor="blue.200" bg="blue.50">
                <VStack gap={3} align="stretch">
                    <Box>
                        <Input
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Title"
                            bg="white"
                            size="sm"
                        />
                        {errors.title && <Text fontSize="sm" color="red.500" mt={1}>{errors.title}</Text>}
                    </Box>
                    <Box>
                        <Textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={3}
                            bg="white"
                            size="sm"
                        />
                        {errors.body && <Text fontSize="sm" color="red.500" mt={1}>{errors.body}</Text>}
                    </Box>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="checkbox"
                            checked={data.is_pinned}
                            onChange={(e) => setData('is_pinned', e.target.checked)}
                        />
                        Pin announcement
                    </label>
                    <HStack gap={2}>
                        <Button type="submit" size="sm" colorPalette="blue" loading={processing}>
                            <FiCheck size={13} /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                            <FiX size={13} /> Cancel
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        );
    }

    return (
        <Box p={4} borderRadius="md" borderWidth="1px" bg="white">
            <Flex justify="space-between" align="flex-start">
                <Box flex={1}>
                    <HStack gap={2} mb={1}>
                        {announcement.is_pinned && (
                            <Badge colorPalette="orange">Pinned</Badge>
                        )}
                        <Text fontWeight="semibold">{announcement.title}</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">{announcement.body}</Text>
                    <Text fontSize="xs" color="gray.400" mt={2}>
                        {new Date(announcement.created_at).toLocaleString()}
                    </Text>
                </Box>
                <HStack gap={1} ml={2}>
                    <Button size="sm" variant="ghost" colorPalette="blue" aria-label="Edit" onClick={() => setEditing(true)}>
                        <FiEdit2 />
                    </Button>
                    <Button size="sm" variant="ghost" colorPalette="red" aria-label="Delete" onClick={() => onDelete(announcement.id)}>
                        <FiTrash2 />
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
}

export default function Index({ cohort, announcements = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        is_pinned: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.announcements.store', cohort.id), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this announcement?')) {
            router.delete(route('instructor.announcements.destroy', [cohort.id, id]));
        }
    };

    const pinned = announcements.filter((a) => a.is_pinned);
    const regular = announcements.filter((a) => !a.is_pinned);

    return (
        <InstructorLayout title="Announcements">
            <Head title={`Announcements: ${cohort.title}`} />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Announcements</Text>
                    <Text color="gray.500" fontSize="sm">{cohort.title}</Text>
                </Box>
            </Flex>

            {/* Create Form */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <Text fontWeight="semibold" mb={4}>Post New Announcement</Text>
                <Box as="form" onSubmit={handleSubmit}>
                    <VStack gap={4} align="stretch">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Title</Text>
                            <Input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Announcement title"
                            />
                            {errors.title && <Text fontSize="sm" color="red.500" mt={1}>{errors.title}</Text>}
                        </Box>

                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Body</Text>
                            <Textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows={4}
                                placeholder="Write your announcement here..."
                            />
                            {errors.body && <Text fontSize="sm" color="red.500" mt={1}>{errors.body}</Text>}
                        </Box>

                        <Flex justify="space-between" align="center">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={data.is_pinned}
                                    onChange={(e) => setData('is_pinned', e.target.checked)}
                                />
                                Pin this announcement
                            </label>
                            <Button
                                type="submit"
                                colorPalette="blue"
                                loading={processing}
                                loadingText="Posting..."
                            ><FiPlus size={13} />
                                Post Announcement
                            </Button>
                        </Flex>
                    </VStack>
                </Box>
            </Box>

            {/* Announcements List */}
            <VStack gap={3} align="stretch">
                {announcements.length === 0 && (
                    <Box bg="gray.50" p={8} borderRadius="lg" textAlign="center" borderWidth="1px" borderStyle="dashed">
                        <Text color="gray.500">No announcements yet. Post your first announcement above.</Text>
                    </Box>
                )}

                {pinned.length > 0 && (
                    <>
                        <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color="orange.600" fontWeight="semibold">
                            Pinned
                        </Text>
                        {pinned.map((a) => (
                            <AnnouncementItem
                                key={a.id}
                                announcement={a}
                                cohortId={cohort.id}
                                onDelete={handleDelete}
                            />
                        ))}
                        {regular.length > 0 && <Box borderBottomWidth="1px" borderColor="gray.200" my={4} />}
                    </>
                )}

                {regular.length > 0 && (
                    <>
                        {pinned.length > 0 && (
                            <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color="gray.500" fontWeight="semibold">
                                Recent
                            </Text>
                        )}
                        {regular.map((a) => (
                            <AnnouncementItem
                                key={a.id}
                                announcement={a}
                                cohortId={cohort.id}
                                onDelete={handleDelete}
                            />
                        ))}
                    </>
                )}
            </VStack>
        </InstructorLayout>
    );
}

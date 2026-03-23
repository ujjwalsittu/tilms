import { Head, useForm, router } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUsers, FiLink } from 'react-icons/fi';

const sel = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px', background: 'white' };

export default function Schedule({ slots = [], cohorts = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        starts_at: '',
        ends_at: '',
        max_attendees: 10,
        meeting_url: '',
        cohort_id: '',
        is_recurring: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.office-hours.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this office hours slot?')) {
            router.delete(route('instructor.office-hours.destroy', id));
        }
    };

    return (
        <InstructorLayout title="Office Hours">
            <Head title="Office Hours Schedule" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">Office Hours Schedule</Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                {/* Create Form */}
                <Box>
                    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                        <Text fontWeight="semibold" fontSize="lg" mb={5}>Schedule New Slot</Text>

                        <Box as="form" onSubmit={handleSubmit}>
                            <VStack gap={4} align="stretch">
                                <SimpleGrid columns={2} gap={4}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Starts At</Text>
                                        <Input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} />
                                        {errors.starts_at && <Text fontSize="sm" color="red.500" mt={1}>{errors.starts_at}</Text>}
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Ends At</Text>
                                        <Input type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} />
                                        {errors.ends_at && <Text fontSize="sm" color="red.500" mt={1}>{errors.ends_at}</Text>}
                                    </Box>
                                </SimpleGrid>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Max Attendees</Text>
                                    <Input type="number" value={data.max_attendees} onChange={(e) => setData('max_attendees', Number(e.target.value))} min="1" />
                                    {errors.max_attendees && <Text fontSize="sm" color="red.500" mt={1}>{errors.max_attendees}</Text>}
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Meeting URL</Text>
                                    <Input type="url" value={data.meeting_url} onChange={(e) => setData('meeting_url', e.target.value)} placeholder="https://meet.google.com/..." />
                                    {errors.meeting_url && <Text fontSize="sm" color="red.500" mt={1}>{errors.meeting_url}</Text>}
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Cohort (Optional)</Text>
                                    <select value={data.cohort_id} onChange={(e) => setData('cohort_id', e.target.value)} style={sel}>
                                        <option value="">All cohorts / General</option>
                                        {cohorts.map((c) => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                    <Text fontSize="sm" color="gray.500" mt={1}>Limit to a specific cohort or leave open for all</Text>
                                    {errors.cohort_id && <Text fontSize="sm" color="red.500" mt={1}>{errors.cohort_id}</Text>}
                                </Box>

                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                                    <input type="checkbox" checked={data.is_recurring} onChange={(e) => setData('is_recurring', e.target.checked)} />
                                    Recurring (weekly)
                                </label>

                                <Button type="submit" colorPalette="blue" loading={processing} loadingText="Scheduling...">
                                    <FiPlus size={14} /> Schedule Slot
                                </Button>
                            </VStack>
                        </Box>
                    </Box>
                </Box>

                {/* Upcoming Slots */}
                <Box>
                    <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                        <Box p={4} borderBottomWidth="1px">
                            <Text fontWeight="semibold">Upcoming Slots ({slots.length})</Text>
                        </Box>

                        {slots.length === 0 ? (
                            <Box p={8} textAlign="center">
                                <FiCalendar size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                <Text color="gray.500">No upcoming office hours scheduled.</Text>
                            </Box>
                        ) : (
                            <VStack gap={0} align="stretch">
                                {slots.map((slot) => (
                                    <Box key={slot.id} p={4} borderBottomWidth="1px" _last={{ borderBottomWidth: 0 }}>
                                        <Flex justify="space-between" align="flex-start">
                                            <Box>
                                                <HStack gap={2} mb={1}>
                                                    <Text fontWeight="medium" fontSize="sm">
                                                        {new Date(slot.starts_at).toLocaleDateString(undefined, {
                                                            weekday: 'short', month: 'short', day: 'numeric'
                                                        })}
                                                    </Text>
                                                    {slot.is_recurring && (
                                                        <Badge colorPalette="purple" size="sm">Recurring</Badge>
                                                    )}
                                                </HStack>
                                                <Text fontSize="sm" color="gray.600">
                                                    {new Date(slot.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {' – '}
                                                    {new Date(slot.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                                <HStack gap={3} mt={1}>
                                                    <HStack gap={1} color="gray.500" fontSize="xs">
                                                        <FiUsers size={12} />
                                                        <Text>{slot.bookings_count ?? 0}/{slot.max_attendees} booked</Text>
                                                    </HStack>
                                                    {slot.cohort && (
                                                        <Text fontSize="xs" color="blue.500">{slot.cohort.title}</Text>
                                                    )}
                                                    {slot.meeting_url && (
                                                        <a href={slot.meeting_url} target="_blank" rel="noopener noreferrer">
                                                            <HStack gap={1} color="blue.500" fontSize="xs">
                                                                <FiLink size={12} />
                                                                <Text>Join</Text>
                                                            </HStack>
                                                        </a>
                                                    )}
                                                </HStack>
                                            </Box>
                                            <HStack gap={1}>
                                                <Button size="sm" variant="ghost" colorPalette="gray" aria-label="Edit" onClick={() => router.get(route('instructor.office-hours.edit', slot.id))}>
                                                    <FiEdit2 />
                                                </Button>
                                                <Button size="sm" variant="ghost" colorPalette="red" aria-label="Delete" onClick={() => handleDelete(slot.id)}>
                                                    <FiTrash2 />
                                                </Button>
                                            </HStack>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </Box>
                </Box>
            </SimpleGrid>
        </InstructorLayout>
    );
}

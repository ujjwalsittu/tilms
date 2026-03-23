import { Head, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Text, Flex, HStack, VStack, Badge, SimpleGrid,
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiUsers, FiVideo, FiUser } from 'react-icons/fi';

function SlotCard({ slot }) {
    const available = (slot.capacity ?? 1) - (slot.bookings_count ?? 0);
    const isFull = available <= 0;
    const startDate = slot.starts_at ? new Date(slot.starts_at) : null;
    const endDate = slot.ends_at ? new Date(slot.ends_at) : null;

    const handleBook = () => {
        router.post(route('student.office-hours.book', slot.id));
    };

    return (
        <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
            p={5}
            transition="all 0.2s"
            _hover={{ boxShadow: 'md' }}
            opacity={isFull ? 0.7 : 1}
        >
            {/* Instructor */}
            <HStack gap={2} mb={4}>
                <Flex
                    w={9}
                    h={9}
                    bg="blue.50"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    flexShrink={0}
                >
                    <FiUser size={16} color="#3182CE" />
                </Flex>
                <Box>
                    <Text fontWeight="semibold" fontSize="sm">
                        {slot.instructor?.name ?? 'Instructor'}
                    </Text>
                    {slot.instructor?.title && (
                        <Text fontSize="xs" color="gray.500">{slot.instructor.title}</Text>
                    )}
                </Box>
            </HStack>

            {/* Date/Time */}
            <VStack gap={2} align="start" mb={4}>
                {startDate && (
                    <HStack gap={2} color="gray.600" fontSize="sm">
                        <FiCalendar size={14} />
                        <Text>
                            {startDate.toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                    </HStack>
                )}
                {startDate && endDate && (
                    <HStack gap={2} color="gray.600" fontSize="sm">
                        <FiClock size={14} />
                        <Text>
                            {startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            {' – '}
                            {endDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </HStack>
                )}
                <HStack gap={2} fontSize="sm">
                    <FiUsers size={14} color={isFull ? '#E53E3E' : '#38A169'} />
                    <Text color={isFull ? 'red.500' : 'green.600'} fontWeight="medium">
                        {isFull ? 'Fully booked' : `${available} spot${available !== 1 ? 's' : ''} available`}
                    </Text>
                </HStack>
            </VStack>

            {/* Meeting URL indicator */}
            {slot.meeting_url && (
                <HStack gap={2} mb={4} color="blue.500" fontSize="xs">
                    <FiVideo size={13} />
                    <Text>Online session (link shared after booking)</Text>
                </HStack>
            )}

            <Button
                w="full"
                colorPalette="blue"
                size="sm"
                disabled={isFull || slot.is_booked}
                onClick={handleBook}
                variant={isFull || slot.is_booked ? 'outline' : 'solid'}
            >
                {slot.is_booked ? 'Already Booked' : isFull ? 'Fully Booked' : 'Book Slot'}
            </Button>
        </Box>
    );
}

export default function OfficeHoursAvailable({ slots = [] }) {
    return (
        <StudentLayout title="Office Hours">
            <Head title="Office Hours" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Office Hours</Text>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        Book a one-on-one session with your instructor
                    </Text>
                </Box>
                {slots.length > 0 && (
                    <Badge colorPalette="blue" variant="subtle" px={3} py={1} borderRadius="full">
                        {slots.length} upcoming slot{slots.length !== 1 ? 's' : ''}
                    </Badge>
                )}
            </Flex>

            {slots.length === 0 ? (
                <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center" borderWidth="1px" borderStyle="dashed">
                    <Flex w={14} h={14} bg="blue.50" borderRadius="full" align="center" justify="center" mx="auto" mb={3}>
                        <FiCalendar size={24} color="#3182CE" />
                    </Flex>
                    <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={1}>
                        No upcoming office hours
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                        Check back later — your instructor will post available slots here.
                    </Text>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
                    {slots.map((slot) => (
                        <SlotCard key={slot.id} slot={slot} />
                    ))}
                </SimpleGrid>
            )}
        </StudentLayout>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    Badge,
    SimpleGrid,
    Table,
    HStack,
    VStack,
    Tabs,
} from '@chakra-ui/react';
import {
    FiEdit2,
    FiCopy,
    FiXCircle,
    FiLayout,
    FiPlus,
    FiUsers,
    FiCheckSquare,
    FiBook,
    FiAlertCircle,
} from 'react-icons/fi';

function StatCard({ label, value, icon: IconComp, color }) {
    return (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                </Box>
                <Flex w={10} h={10} bg={`${color}.50`} borderRadius="lg" align="center" justify="center">
                    <IconComp size={20} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default function Show({ cohort, tasks = [], enrollmentStats = {}, announcements = [] }) {
    const handleClone = () => {
        if (confirm('Clone this cohort?')) {
            router.post(route('instructor.cohorts.clone', cohort.id));
        }
    };

    const handleClose = () => {
        if (confirm('Close this cohort? All enrolled students will be notified.')) {
            router.patch(route('instructor.cohorts.close', cohort.id));
        }
    };

    const typeColor = { internship: 'purple', learning: 'blue' };

    return (
        <InstructorLayout title={cohort.title}>
            <Head title={cohort.title} />
            <FlashMessage />

            {/* Header */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                    <Box>
                        <HStack gap={2} mb={2}>
                            <Badge colorScheme={typeColor[cohort.type] ?? 'gray'} fontSize="sm">
                                {cohort.type}
                            </Badge>
                            <StatusBadge status={cohort.status} />
                        </HStack>
                        <Text fontSize="2xl" fontWeight="bold">{cohort.title}</Text>
                        {cohort.description && (
                            <Text color="gray.600" mt={1} maxW="2xl">{cohort.description}</Text>
                        )}
                        <HStack gap={4} mt={3} color="gray.500" fontSize="sm">
                            {cohort.starts_at && (
                                <Text>Starts: {new Date(cohort.starts_at).toLocaleDateString()}</Text>
                            )}
                            {cohort.price_amount && (
                                <Text>
                                    Price: {cohort.price_currency} {Number(cohort.price_amount).toLocaleString()}
                                </Text>
                            )}
                        </HStack>
                    </Box>
                    <HStack gap={2} flexWrap="wrap">
                        <Link href={route('instructor.cohorts.edit', cohort.id)}>
                            <Button size="sm" leftIcon={<FiEdit2 />} variant="outline">Edit</Button>
                        </Link>
                        <Button size="sm" leftIcon={<FiCopy />} variant="outline" onClick={handleClone}>
                            Clone
                        </Button>
                        <Link href={route('instructor.cohorts.landing-page', cohort.id)}>
                            <Button size="sm" leftIcon={<FiLayout />} variant="outline" colorScheme="teal">
                                Landing Page
                            </Button>
                        </Link>
                        {cohort.status !== 'closed' && (
                            <Button size="sm" leftIcon={<FiXCircle />} colorScheme="red" variant="outline" onClick={handleClose}>
                                Close Cohort
                            </Button>
                        )}
                    </HStack>
                </Flex>
            </Box>

            {/* Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
                <StatCard
                    label="Enrolled Students"
                    value={enrollmentStats.total ?? 0}
                    icon={FiUsers}
                    color="blue"
                />
                <StatCard
                    label="Tasks"
                    value={tasks.length}
                    icon={FiBook}
                    color="purple"
                />
                <StatCard
                    label="Avg Completion"
                    value={`${enrollmentStats.avg_completion ?? 0}%`}
                    icon={FiCheckSquare}
                    color="green"
                />
                <StatCard
                    label="Pending Reviews"
                    value={enrollmentStats.pending_reviews ?? 0}
                    icon={FiAlertCircle}
                    color="orange"
                />
            </SimpleGrid>

            {/* Tabs */}
            <Tabs.Root defaultValue="tasks">
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="tasks">Tasks ({tasks.length})</Tabs.Trigger>
                    <Tabs.Trigger value="students">Students ({enrollmentStats.total ?? 0})</Tabs.Trigger>
                    <Tabs.Trigger value="announcements">Announcements ({announcements.length})</Tabs.Trigger>
                </Tabs.List>

                {/* Tasks Tab */}
                <Tabs.Content value="tasks">
                    <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                        <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
                            <Text fontWeight="semibold">Tasks</Text>
                            <Link href={route('instructor.tasks.bank')}>
                                <Button size="sm" colorScheme="blue" leftIcon={<FiPlus />}>Add Task</Button>
                            </Link>
                        </Flex>
                        {tasks.length === 0 ? (
                            <Box p={8} textAlign="center">
                                <Text color="gray.500">No tasks assigned yet.</Text>
                                <Link href={route('instructor.tasks.bank')}>
                                    <Button mt={3} size="sm" colorScheme="blue">Browse Task Bank</Button>
                                </Link>
                            </Box>
                        ) : (
                            <Table.Root variant="line">
                                <Table.Header>
                                    <Table.Row bg="gray.50">
                                        <Table.ColumnHeader>#</Table.ColumnHeader>
                                        <Table.ColumnHeader>Task</Table.ColumnHeader>
                                        <Table.ColumnHeader>Type</Table.ColumnHeader>
                                        <Table.ColumnHeader>Opens At</Table.ColumnHeader>
                                        <Table.ColumnHeader>Due At</Table.ColumnHeader>
                                        <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {tasks.map((ct) => (
                                        <Table.Row key={ct.id} _hover={{ bg: 'gray.50' }}>
                                            <Table.Cell color="gray.500">{ct.order_index}</Table.Cell>
                                            <Table.Cell>
                                                <Text fontWeight="medium">{ct.task?.title ?? 'Task'}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge>{ct.task?.type}</Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {ct.opens_at ? new Date(ct.opens_at).toLocaleDateString() : '—'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {ct.due_at ? new Date(ct.due_at).toLocaleDateString() : '—'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link href={route('instructor.submissions.index', { cohort_task: ct.id })}>
                                                    <Button size="xs" variant="outline">Submissions</Button>
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        )}
                    </Box>
                </Tabs.Content>

                {/* Students Tab */}
                <Tabs.Content value="students">
                    <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                        <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
                            <Text fontWeight="semibold">Enrolled Students</Text>
                            <Link href={route('instructor.students.roster', cohort.id)}>
                                <Button size="sm" variant="outline">View Full Roster</Button>
                            </Link>
                        </Flex>
                        <Box p={6}>
                            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                                <Box p={4} bg="green.50" borderRadius="lg" textAlign="center">
                                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                        {enrollmentStats.active ?? 0}
                                    </Text>
                                    <Text fontSize="sm" color="green.700">Active</Text>
                                </Box>
                                <Box p={4} bg="yellow.50" borderRadius="lg" textAlign="center">
                                    <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                                        {enrollmentStats.pending ?? 0}
                                    </Text>
                                    <Text fontSize="sm" color="yellow.700">Pending</Text>
                                </Box>
                                <Box p={4} bg="blue.50" borderRadius="lg" textAlign="center">
                                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                        {enrollmentStats.completed ?? 0}
                                    </Text>
                                    <Text fontSize="sm" color="blue.700">Completed</Text>
                                </Box>
                                <Box p={4} bg="red.50" borderRadius="lg" textAlign="center">
                                    <Text fontSize="2xl" fontWeight="bold" color="red.600">
                                        {enrollmentStats.dropped ?? 0}
                                    </Text>
                                    <Text fontSize="sm" color="red.700">Dropped</Text>
                                </Box>
                            </SimpleGrid>
                        </Box>
                    </Box>
                </Tabs.Content>

                {/* Announcements Tab */}
                <Tabs.Content value="announcements">
                    <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                        <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
                            <Text fontWeight="semibold">Announcements</Text>
                            <Link href={route('instructor.announcements.index', cohort.id)}>
                                <Button size="sm" colorScheme="blue" leftIcon={<FiPlus />}>Manage</Button>
                            </Link>
                        </Flex>
                        {announcements.length === 0 ? (
                            <Box p={8} textAlign="center">
                                <Text color="gray.500">No announcements yet.</Text>
                            </Box>
                        ) : (
                            <VStack gap={0} align="stretch">
                                {announcements.map((a) => (
                                    <Box key={a.id} p={4} borderBottomWidth="1px" _last={{ borderBottomWidth: 0 }}>
                                        <HStack gap={2} mb={1}>
                                            {a.is_pinned && <Badge colorScheme="orange">Pinned</Badge>}
                                            <Text fontWeight="medium">{a.title}</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600" noOfLines={2}>{a.body}</Text>
                                        <Text fontSize="xs" color="gray.400" mt={1}>
                                            {new Date(a.created_at).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </Box>
                </Tabs.Content>
            </Tabs.Root>
        </InstructorLayout>
    );
}

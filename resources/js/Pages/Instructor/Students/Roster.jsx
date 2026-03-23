import { Head, Link, router } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Table,
    Text,
    Badge,
    HStack,
    Progress,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

export default function Roster({ cohort, students }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const handleFilter = () => {
        router.get(
            route('instructor.students.roster', cohort.id),
            { search, status },
            { preserveState: true }
        );
    };

    return (
        <InstructorLayout title="Student Roster">
            <Head title={`Roster: ${cohort.title}`} />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Student Roster</Text>
                    <Text color="gray.500" fontSize="sm">{cohort.title}</Text>
                </Box>
                <HStack gap={2}>
                    <Link href={route('instructor.newsletter.compose', cohort.id)}>
                        <Button size="sm" variant="outline">Send Newsletter</Button>
                    </Link>
                    <Link href={route('instructor.cohorts.show', cohort.id)}>
                        <Button size="sm" variant="outline">Back to Cohort</Button>
                    </Link>
                </HStack>
            </Flex>

            {/* Filters */}
            <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <HStack gap={3} flexWrap="wrap">
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        maxW="280px"
                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                    />
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        maxW="180px"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </Select>
                    <Button onClick={handleFilter} leftIcon={<FiSearch />} colorScheme="blue" variant="outline">
                        Search
                    </Button>
                </HStack>
            </Box>

            {/* Table */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                <Box overflowX="auto">
                    <Table.Root variant="line">
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Email</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Progress</Table.ColumnHeader>
                                <Table.ColumnHeader>Tasks Completed</Table.ColumnHeader>
                                <Table.ColumnHeader>Last Active</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {students.data?.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={7} textAlign="center" py={8} color="gray.500">
                                        No students found.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {students.data?.map((enrollment) => {
                                const student = enrollment.student ?? enrollment.user ?? {};
                                const progress = enrollment.progress_percentage ?? 0;

                                return (
                                    <Table.Row key={enrollment.id} _hover={{ bg: 'gray.50' }}>
                                        <Table.Cell>
                                            <Text fontWeight="medium">{student.name ?? '—'}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color="gray.600">{student.email ?? '—'}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadge status={enrollment.status} />
                                        </Table.Cell>
                                        <Table.Cell minW="120px">
                                            <HStack gap={2}>
                                                <Box flex={1}>
                                                    <Progress
                                                        value={progress}
                                                        size="sm"
                                                        colorScheme={progress >= 70 ? 'green' : progress >= 40 ? 'blue' : 'orange'}
                                                        borderRadius="full"
                                                    />
                                                </Box>
                                                <Text fontSize="xs" color="gray.600" w="32px">
                                                    {progress}%
                                                </Text>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm">
                                                {enrollment.tasks_completed ?? 0} / {enrollment.tasks_total ?? 0}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color="gray.600">
                                                {enrollment.last_active_at
                                                    ? new Date(enrollment.last_active_at).toLocaleDateString()
                                                    : '—'}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link href={route('instructor.students.show', [cohort.id, student.id])}>
                                                <Button size="xs" variant="outline">View</Button>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Root>
                </Box>
                <Box p={4} borderTopWidth="1px">
                    <Pagination links={students.links} meta={students.meta} />
                </Box>
            </Box>
        </InstructorLayout>
    );
}

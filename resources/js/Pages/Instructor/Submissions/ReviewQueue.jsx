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
    Select,
    Table,
    Text,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

export default function ReviewQueue({ submissions, cohorts = [] }) {
    const [status, setStatus] = useState('');
    const [cohortId, setCohortId] = useState('');

    const handleFilter = () => {
        router.get(route('instructor.submissions.index'), { status, cohort_id: cohortId }, { preserveState: true });
    };

    return (
        <InstructorLayout title="Review Queue">
            <Head title="Submission Review Queue" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">Submission Review Queue</Text>
                {submissions.meta && (
                    <Text color="gray.500" fontSize="sm">{submissions.meta.total ?? 0} total submissions</Text>
                )}
            </Flex>

            {/* Filters */}
            <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <HStack gap={3} flexWrap="wrap">
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        maxW="200px"
                    >
                        <option value="">All Statuses</option>
                        <option value="submitted">Submitted</option>
                        <option value="ai_reviewed">AI Reviewed</option>
                        <option value="graded">Graded</option>
                        <option value="returned">Returned</option>
                    </Select>
                    <Select
                        value={cohortId}
                        onChange={(e) => setCohortId(e.target.value)}
                        maxW="220px"
                    >
                        <option value="">All Cohorts</option>
                        {cohorts.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </Select>
                    <Button onClick={handleFilter} leftIcon={<FiSearch />} colorScheme="blue" variant="outline">
                        Filter
                    </Button>
                </HStack>
            </Box>

            {/* Table */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                <Box overflowX="auto">
                    <Table.Root variant="line">
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader>Student</Table.ColumnHeader>
                                <Table.ColumnHeader>Task</Table.ColumnHeader>
                                <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>AI Score</Table.ColumnHeader>
                                <Table.ColumnHeader>Submitted At</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {submissions.data?.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={7} textAlign="center" py={8} color="gray.500">
                                        No submissions found.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {submissions.data?.map((submission) => (
                                <Table.Row key={submission.id} _hover={{ bg: 'gray.50' }}>
                                    <Table.Cell>
                                        <Text fontWeight="medium">{submission.student?.name ?? '—'}</Text>
                                        <Text fontSize="xs" color="gray.500">{submission.student?.email}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontSize="sm">{submission.cohort_task?.task?.title ?? '—'}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontSize="sm" color="gray.600">
                                            {submission.cohort_task?.cohort?.title ?? '—'}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <StatusBadge status={submission.status} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {submission.ai_score != null ? (
                                            <Badge
                                                colorScheme={submission.ai_score >= 70 ? 'green' : submission.ai_score >= 40 ? 'orange' : 'red'}
                                            >
                                                {submission.ai_score}/100
                                            </Badge>
                                        ) : (
                                            <Text fontSize="sm" color="gray.400">—</Text>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontSize="sm">
                                            {new Date(submission.submitted_at ?? submission.created_at).toLocaleDateString()}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link href={route('instructor.submissions.show', submission.id)}>
                                            <Button size="sm" colorScheme="blue" variant="outline">Review</Button>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
                <Box p={4} borderTopWidth="1px">
                    <Pagination links={submissions.links} meta={submissions.meta} />
                </Box>
            </Box>
        </InstructorLayout>
    );
}

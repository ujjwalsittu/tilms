import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
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
    Progress,
} from '@chakra-ui/react';
import { FiMail, FiCalendar, FiAward } from 'react-icons/fi';

function InfoItem({ label, value, icon }) {
    return (
        <HStack gap={2} color="gray.600" fontSize="sm">
            {icon}
            <Text color="gray.500">{label}:</Text>
            <Text fontWeight="medium">{value}</Text>
        </HStack>
    );
}

export default function StudentDetail({ cohort, student, submissions = [], enrollment }) {
    const progress = enrollment?.progress_percentage ?? 0;

    return (
        <InstructorLayout title="Student Detail">
            <Head title={`${student.name} - ${cohort.title}`} />
            <FlashMessage />

            {/* Breadcrumb */}
            <HStack gap={2} mb={6} fontSize="sm" color="gray.500">
                <Link href={route('instructor.roster.index', cohort.id)}>
                    <Text color="blue.500" _hover={{ textDecoration: 'underline' }}>Roster</Text>
                </Link>
                <Text>/</Text>
                <Text>{student.name}</Text>
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} mb={6}>
                {/* Student Info Card */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <VStack align="start" gap={4}>
                        <Flex w={16} h={16} bg="blue.100" borderRadius="full" align="center" justify="center" flexShrink={0}>
                            <Text fontWeight="bold" fontSize="2xl" color="blue.600">{student?.name?.[0]?.toUpperCase()}</Text>
                        </Flex>

                        <Box>
                            <Text fontSize="xl" fontWeight="bold">{student.name}</Text>
                            <StatusBadge status={enrollment?.status} />
                        </Box>

                        <VStack gap={2} align="start" w="full">
                            <InfoItem label="Email" value={student.email} icon={<FiMail size={14} />} />
                            {enrollment?.enrolled_at && (
                                <InfoItem
                                    label="Enrolled"
                                    value={new Date(enrollment.enrolled_at).toLocaleDateString()}
                                    icon={<FiCalendar size={14} />}
                                />
                            )}
                            {enrollment?.completed_at && (
                                <InfoItem
                                    label="Completed"
                                    value={new Date(enrollment.completed_at).toLocaleDateString()}
                                    icon={<FiAward size={14} />}
                                />
                            )}
                        </VStack>
                    </VStack>
                </Box>

                {/* Progress Card */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Text fontWeight="semibold" mb={4}>Progress</Text>
                    <VStack gap={4} align="stretch">
                        <Box>
                            <Flex justify="space-between" mb={2}>
                                <Text fontSize="sm" color="gray.600">Overall Progress</Text>
                                <Text fontSize="sm" fontWeight="bold">{progress}%</Text>
                            </Flex>
                            <Progress
                                value={progress}
                                colorPalette={progress >= 70 ? 'green' : progress >= 40 ? 'blue' : 'orange'}
                                size="lg"
                                borderRadius="full"
                            />
                        </Box>

                        <SimpleGrid columns={2} gap={3}>
                            <Box bg="blue.50" p={3} borderRadius="md" textAlign="center">
                                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                                    {enrollment?.tasks_completed ?? 0}
                                </Text>
                                <Text fontSize="xs" color="blue.600">Completed</Text>
                            </Box>
                            <Box bg="gray.50" p={3} borderRadius="md" textAlign="center">
                                <Text fontSize="xl" fontWeight="bold" color="gray.600">
                                    {enrollment?.tasks_total ?? 0}
                                </Text>
                                <Text fontSize="xs" color="gray.600">Total Tasks</Text>
                            </Box>
                        </SimpleGrid>

                        {enrollment?.last_active_at && (
                            <Text fontSize="xs" color="gray.400">
                                Last active: {new Date(enrollment.last_active_at).toLocaleString()}
                            </Text>
                        )}
                    </VStack>
                </Box>

                {/* Quick Stats */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Text fontWeight="semibold" mb={4}>Submission Stats</Text>
                    <VStack gap={3} align="stretch">
                        {[
                            {
                                label: 'Submitted',
                                value: submissions.filter(s => s.status !== 'not_started').length,
                                color: 'blue',
                            },
                            {
                                label: 'Graded',
                                value: submissions.filter(s => s.status === 'graded').length,
                                color: 'green',
                            },
                            {
                                label: 'Pending Review',
                                value: submissions.filter(s => ['submitted', 'ai_reviewed'].includes(s.status)).length,
                                color: 'orange',
                            },
                            {
                                label: 'Returned',
                                value: submissions.filter(s => s.status === 'returned').length,
                                color: 'red',
                            },
                        ].map(({ label, value, color }) => (
                            <Flex key={label} justify="space-between" align="center">
                                <Text fontSize="sm" color="gray.600">{label}</Text>
                                <Badge colorPalette={color}>{value}</Badge>
                            </Flex>
                        ))}

                        {submissions.length > 0 && (
                            <>
                                <Box borderTopWidth="1px" pt={2} mt={1}>
                                    <Flex justify="space-between">
                                        <Text fontSize="sm" color="gray.500">Avg Score</Text>
                                        <Text fontSize="sm" fontWeight="semibold">
                                            {(() => {
                                                const graded = submissions.filter(s => s.instructor_score != null);
                                                if (graded.length === 0) return '—';
                                                const avg = graded.reduce((sum, s) => sum + s.instructor_score, 0) / graded.length;
                                                return `${Math.round(avg)}/100`;
                                            })()}
                                        </Text>
                                    </Flex>
                                </Box>
                            </>
                        )}
                    </VStack>
                </Box>
            </SimpleGrid>

            {/* Submissions Table */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                <Box p={5} borderBottomWidth="1px">
                    <Text fontWeight="semibold">Submissions ({submissions.length})</Text>
                </Box>

                {submissions.length === 0 ? (
                    <Box p={8} textAlign="center">
                        <Text color="gray.500">No submissions yet.</Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table.Root variant="line">
                            <Table.Header>
                                <Table.Row bg="gray.50">
                                    <Table.ColumnHeader>Task</Table.ColumnHeader>
                                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                                    <Table.ColumnHeader>AI Score</Table.ColumnHeader>
                                    <Table.ColumnHeader>Instructor Score</Table.ColumnHeader>
                                    <Table.ColumnHeader>Submitted At</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {submissions.map((submission) => (
                                    <Table.Row key={submission.id} _hover={{ bg: 'gray.50' }}>
                                        <Table.Cell>
                                            <Text fontWeight="medium" fontSize="sm">
                                                {submission.cohort_task?.task?.title ?? '—'}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadge status={submission.status} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {submission.ai_score != null ? (
                                                <Badge colorPalette={submission.ai_score >= 70 ? 'green' : 'orange'}>
                                                    {submission.ai_score}/100
                                                </Badge>
                                            ) : (
                                                <Text fontSize="sm" color="gray.400">—</Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {submission.instructor_score != null ? (
                                                <Badge colorPalette={submission.instructor_score >= 70 ? 'green' : 'orange'}>
                                                    {submission.instructor_score}/100
                                                </Badge>
                                            ) : (
                                                <Text fontSize="sm" color="gray.400">—</Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm">
                                                {submission.submitted_at
                                                    ? new Date(submission.submitted_at).toLocaleDateString()
                                                    : '—'}
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                )}
            </Box>
        </InstructorLayout>
    );
}

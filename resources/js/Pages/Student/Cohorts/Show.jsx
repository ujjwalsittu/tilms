import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    Box,
    Button,
    Flex,
    Text,
    Badge,
    Progress,
    HStack,
    VStack,
    Icon,
} from '@chakra-ui/react';
import {
    FiLock,
    FiUnlock,
    FiCheckCircle,
    FiClock,
    FiCalendar,
    FiMapPin,
    FiArrowRight,
} from 'react-icons/fi';

function TaskRow({ cohortTask, enrollment }) {
    const task = cohortTask.task ?? {};
    const submission = cohortTask.submission ?? null;
    const isLocked = cohortTask.is_locked ?? false;
    const submissionStatus = submission?.status ?? 'not_started';

    const difficultyColor = {
        beginner: 'green',
        intermediate: 'blue',
        advanced: 'red',
    };

    const statusIcon = {
        graded: <FiCheckCircle color="green" />,
        submitted: <FiClock color="orange" />,
        ai_reviewed: <FiClock color="blue" />,
        returned: <FiArrowRight color="red" />,
        not_started: isLocked ? <FiLock color="gray" /> : <FiUnlock color="gray" />,
    };

    return (
        <Box
            p={4}
            borderRadius="md"
            borderWidth="1px"
            bg={isLocked ? 'gray.50' : 'white'}
            borderColor={isLocked ? 'gray.200' : 'gray.200'}
            opacity={isLocked ? 0.7 : 1}
        >
            <Flex justify="space-between" align="center">
                <HStack gap={3} flex={1}>
                    <Box color="gray.400" w={5}>
                        {statusIcon[submissionStatus] ?? statusIcon['not_started']}
                    </Box>
                    <Box flex={1}>
                        <HStack gap={2} mb={0.5}>
                            <Text fontWeight="medium" fontSize="sm">
                                {cohortTask.order_index}. {task.title}
                            </Text>
                            {task.difficulty && (
                                <Badge size="sm" colorScheme={difficultyColor[task.difficulty]} variant="subtle">
                                    {task.difficulty}
                                </Badge>
                            )}
                        </HStack>
                        <HStack gap={3} color="gray.400" fontSize="xs">
                            {task.estimated_minutes && (
                                <HStack gap={1}>
                                    <FiClock size={10} />
                                    <Text>{task.estimated_minutes} min</Text>
                                </HStack>
                            )}
                            {cohortTask.due_at && (
                                <HStack gap={1}>
                                    <FiCalendar size={10} />
                                    <Text>Due {new Date(cohortTask.due_at).toLocaleDateString()}</Text>
                                </HStack>
                            )}
                        </HStack>
                    </Box>
                </HStack>

                <HStack gap={2}>
                    <StatusBadge status={submissionStatus} />
                    {!isLocked && (
                        <Link href={route('student.tasks.show', cohortTask.id)}>
                            <Button size="xs" colorScheme="blue" variant={submissionStatus === 'not_started' ? 'solid' : 'outline'}>
                                {submissionStatus === 'not_started' ? 'Start' :
                                 submissionStatus === 'graded' ? 'Review' : 'View'}
                            </Button>
                        </Link>
                    )}
                </HStack>
            </Flex>

            {submission?.instructor_score != null && (
                <Box mt={2} ml={8}>
                    <Badge colorScheme={submission.instructor_score >= 70 ? 'green' : 'orange'}>
                        Score: {submission.instructor_score}/100
                    </Badge>
                    {submission.instructor_feedback && (
                        <Text fontSize="xs" color="gray.500" mt={1} noOfLines={1}>
                            {submission.instructor_feedback}
                        </Text>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default function Show({ cohort, enrollment, tasks = [], announcements = [] }) {
    const progress = enrollment?.progress_percentage ?? 0;
    const typeColor = { internship: 'purple', learning: 'blue' };
    const pinned = announcements.filter((a) => a.is_pinned);
    const recent = announcements.filter((a) => !a.is_pinned).slice(0, 3);

    return (
        <StudentLayout title={cohort.title}>
            <Head title={cohort.title} />
            <FlashMessage />

            {/* Cohort Header */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                    <Box flex={1}>
                        <HStack gap={2} mb={2}>
                            <Badge colorScheme={typeColor[cohort.type] ?? 'gray'}>{cohort.type}</Badge>
                            <StatusBadge status={enrollment?.status} />
                        </HStack>
                        <Text fontSize="2xl" fontWeight="bold">{cohort.title}</Text>
                        {cohort.description && (
                            <Text color="gray.600" mt={1} noOfLines={2}>{cohort.description}</Text>
                        )}

                        <Box mt={4} maxW="md">
                            <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm" color="gray.600">Overall Progress</Text>
                                <Text fontSize="sm" fontWeight="bold">{progress}%</Text>
                            </Flex>
                            <Progress
                                value={progress}
                                colorScheme={progress >= 70 ? 'green' : 'blue'}
                                size="md"
                                borderRadius="full"
                            />
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                {enrollment?.tasks_completed ?? 0} of {enrollment?.tasks_total ?? tasks.length} tasks completed
                            </Text>
                        </Box>
                    </Box>

                    <Box textAlign="right">
                        {enrollment?.completed_at && (
                            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                                Completed
                            </Badge>
                        )}
                    </Box>
                </Flex>
            </Box>

            <Flex gap={6} flexDirection={{ base: 'column', lg: 'row' }}>
                {/* Tasks List - Main */}
                <Box flex={2}>
                    <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                        <Box p={4} borderBottomWidth="1px">
                            <Text fontWeight="semibold">Tasks ({tasks.length})</Text>
                        </Box>

                        {tasks.length === 0 ? (
                            <Box p={8} textAlign="center">
                                <Text color="gray.500">No tasks available yet.</Text>
                            </Box>
                        ) : (
                            <VStack gap={2} p={4} align="stretch">
                                {tasks.map((cohortTask) => (
                                    <TaskRow
                                        key={cohortTask.id}
                                        cohortTask={cohortTask}
                                        enrollment={enrollment}
                                    />
                                ))}
                            </VStack>
                        )}
                    </Box>
                </Box>

                {/* Sidebar: Announcements */}
                <Box flex={1}>
                    <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                        <Box p={4} borderBottomWidth="1px">
                            <Text fontWeight="semibold">Announcements</Text>
                        </Box>

                        {announcements.length === 0 ? (
                            <Box p={6} textAlign="center">
                                <Text color="gray.500" fontSize="sm">No announcements.</Text>
                            </Box>
                        ) : (
                            <VStack gap={0} align="stretch">
                                {[...pinned, ...recent].map((a) => (
                                    <Box
                                        key={a.id}
                                        p={4}
                                        borderBottomWidth="1px"
                                        _last={{ borderBottomWidth: 0 }}
                                        bg={a.is_pinned ? 'orange.50' : 'white'}
                                    >
                                        <HStack gap={2} mb={1}>
                                            {a.is_pinned && (
                                                <Icon as={FiMapPin} boxSize={3} color="orange.500" />
                                            )}
                                            <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                                                {a.title}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.600" noOfLines={2}>{a.body}</Text>
                                        <Text fontSize="xs" color="gray.400" mt={1}>
                                            {new Date(a.created_at).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </Box>
                </Box>
            </Flex>
        </StudentLayout>
    );
}

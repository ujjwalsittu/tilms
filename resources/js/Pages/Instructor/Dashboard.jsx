import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    SimpleGrid,
    Box,
    Text,
    Flex,
    Icon,
    Table,
    Badge,
    Button,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { FiBook, FiUsers, FiCheckSquare, FiDollarSign, FiArrowRight } from 'react-icons/fi';

function StatCard({ label, value, icon, color }) {
    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                </Box>
                <Flex
                    w={12}
                    h={12}
                    bg={`${color}.50`}
                    borderRadius="lg"
                    align="center"
                    justify="center"
                >
                    <Icon as={icon} boxSize={6} color={`${color}.500`} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default function Dashboard({ stats = {}, recentSubmissions = [], cohorts = [] }) {
    return (
        <InstructorLayout title="Dashboard">
            <Head title="Instructor Dashboard" />
            <FlashMessage />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
                <StatCard
                    label="Active Cohorts"
                    value={stats.active_cohorts ?? 0}
                    icon={FiBook}
                    color="blue"
                />
                <StatCard
                    label="Total Students"
                    value={stats.total_students ?? 0}
                    icon={FiUsers}
                    color="green"
                />
                <StatCard
                    label="Pending Reviews"
                    value={stats.pending_reviews ?? 0}
                    icon={FiCheckSquare}
                    color="orange"
                />
                <StatCard
                    label="Total Earnings"
                    value={`₹${(stats.total_earnings ?? 0).toLocaleString()}`}
                    icon={FiDollarSign}
                    color="purple"
                />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                {/* My Cohorts */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="semibold" fontSize="lg">My Cohorts</Text>
                        <Link href={route('instructor.cohorts.index')}>
                            <Button size="sm" variant="ghost" colorScheme="blue">
                                View all <Icon as={FiArrowRight} ml={1} />
                            </Button>
                        </Link>
                    </Flex>
                    {cohorts.length === 0 ? (
                        <VStack gap={3} py={4}>
                            <Text color="gray.500" fontSize="sm">No cohorts yet.</Text>
                            <Link href={route('instructor.cohorts.create')}>
                                <Button size="sm" colorScheme="blue">Create your first cohort</Button>
                            </Link>
                        </VStack>
                    ) : (
                        <VStack gap={3} align="stretch">
                            {cohorts.slice(0, 5).map((cohort) => (
                                <Box
                                    key={cohort.id}
                                    p={3}
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor="gray.100"
                                    _hover={{ borderColor: 'blue.200', bg: 'blue.50' }}
                                >
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Text fontWeight="medium" fontSize="sm">{cohort.title}</Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {cohort.enrollments_count ?? 0} students
                                            </Text>
                                        </Box>
                                        <HStack gap={2}>
                                            <StatusBadge status={cohort.status} />
                                            <Link href={route('instructor.cohorts.show', cohort.id)}>
                                                <Button size="xs" variant="outline">View</Button>
                                            </Link>
                                        </HStack>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>

                {/* Recent Submissions */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="semibold" fontSize="lg">Recent Submissions</Text>
                        <Link href={route('instructor.submissions.index')}>
                            <Button size="sm" variant="ghost" colorScheme="blue">
                                Review queue <Icon as={FiArrowRight} ml={1} />
                            </Button>
                        </Link>
                    </Flex>
                    {recentSubmissions.length === 0 ? (
                        <Text color="gray.500" fontSize="sm" py={4}>No submissions to review.</Text>
                    ) : (
                        <VStack gap={3} align="stretch">
                            {recentSubmissions.slice(0, 5).map((submission) => (
                                <Box
                                    key={submission.id}
                                    p={3}
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor="gray.100"
                                    _hover={{ borderColor: 'orange.200', bg: 'orange.50' }}
                                >
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Text fontWeight="medium" fontSize="sm">
                                                {submission.student?.name ?? 'Student'}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {submission.cohort_task?.task?.title ?? 'Task'}
                                            </Text>
                                        </Box>
                                        <HStack gap={2}>
                                            <StatusBadge status={submission.status} />
                                            <Link href={route('instructor.submissions.show', submission.id)}>
                                                <Button size="xs" colorScheme="orange" variant="outline">
                                                    Review
                                                </Button>
                                            </Link>
                                        </HStack>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            </SimpleGrid>
        </InstructorLayout>
    );
}

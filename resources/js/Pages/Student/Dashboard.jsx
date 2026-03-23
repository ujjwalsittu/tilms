import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    SimpleGrid,
    Box,
    Text,
    Flex,
    Badge,
    Button,
    VStack,
    HStack,
    Progress,
} from '@chakra-ui/react';
import { FiBook, FiCheckCircle, FiAward, FiZap, FiArrowRight, FiClock } from 'react-icons/fi';

function StatCard({ label, value, icon: IconComp, color }) {
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
                    <IconComp size={24} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default function Dashboard({ stats = {}, activeCohorts = [], recentTasks = [] }) {
    return (
        <StudentLayout title="Dashboard">
            <Head title="Student Dashboard" />
            <FlashMessage />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
                <StatCard
                    label="Active Cohorts"
                    value={stats.active_cohorts ?? 0}
                    icon={FiBook}
                    color="blue"
                />
                <StatCard
                    label="Tasks Completed"
                    value={stats.tasks_completed ?? 0}
                    icon={FiCheckCircle}
                    color="green"
                />
                <StatCard
                    label="Certificates"
                    value={stats.certificates ?? 0}
                    icon={FiAward}
                    color="purple"
                />
                <StatCard
                    label="Current Streak"
                    value={`${stats.current_streak ?? 0} days`}
                    icon={FiZap}
                    color="orange"
                />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                {/* Active Cohorts */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="semibold" fontSize="lg">My Cohorts</Text>
                        <Link href={route('student.cohorts.index')}>
                            <Button size="sm" variant="ghost" colorScheme="blue">
                                View all <FiArrowRight size={16} style={{marginLeft: '4px'}} />
                            </Button>
                        </Link>
                    </Flex>
                    {activeCohorts.length === 0 ? (
                        <VStack gap={3} py={4}>
                            <Text color="gray.500" fontSize="sm">No active cohorts.</Text>
                            <Link href={route('student.cohorts.index')}>
                                <Button size="sm" colorScheme="blue">Browse Cohorts</Button>
                            </Link>
                        </VStack>
                    ) : (
                        <VStack gap={3} align="stretch">
                            {activeCohorts.slice(0, 4).map((enrollment) => {
                                const cohort = enrollment.cohort ?? enrollment;
                                const progress = enrollment.progress_percentage ?? 0;
                                return (
                                    <Box
                                        key={enrollment.id ?? cohort.id}
                                        p={3}
                                        borderRadius="md"
                                        borderWidth="1px"
                                        borderColor="gray.100"
                                        _hover={{ borderColor: 'blue.200', bg: 'blue.50' }}
                                    >
                                        <Flex justify="space-between" align="center" mb={2}>
                                            <Text fontWeight="medium" fontSize="sm">{cohort.title}</Text>
                                            <Link href={route('student.cohorts.show', cohort.id)}>
                                                <Button size="xs" variant="outline">Continue</Button>
                                            </Link>
                                        </Flex>
                                        <Progress
                                            value={progress}
                                            size="sm"
                                            colorScheme={progress >= 70 ? 'green' : 'blue'}
                                            borderRadius="full"
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>{progress}% complete</Text>
                                    </Box>
                                );
                            })}
                        </VStack>
                    )}
                </Box>

                {/* Recent Tasks */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="semibold" fontSize="lg">Recent Tasks</Text>
                        <Badge colorScheme="green" variant="subtle">Up to date</Badge>
                    </Flex>
                    {recentTasks.length === 0 ? (
                        <Text color="gray.500" fontSize="sm" py={4}>No recent tasks.</Text>
                    ) : (
                        <VStack gap={3} align="stretch">
                            {recentTasks.slice(0, 5).map((task) => (
                                <Box
                                    key={task.id}
                                    p={3}
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor="gray.100"
                                    _hover={{ borderColor: 'green.200', bg: 'green.50' }}
                                >
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Text fontWeight="medium" fontSize="sm">{task.title}</Text>
                                            <HStack gap={2} mt={0.5}>
                                                {task.estimated_minutes && (
                                                    <HStack gap={1} color="gray.400" fontSize="xs">
                                                        <FiClock size={10} />
                                                        <Text>{task.estimated_minutes} min</Text>
                                                    </HStack>
                                                )}
                                                {task.difficulty && (
                                                    <Badge size="sm" colorScheme={
                                                        task.difficulty === 'beginner' ? 'green' :
                                                        task.difficulty === 'intermediate' ? 'blue' : 'red'
                                                    } variant="subtle">
                                                        {task.difficulty}
                                                    </Badge>
                                                )}
                                            </HStack>
                                        </Box>
                                        <StatusBadge status={task.submission_status ?? 'not_started'} />
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            </SimpleGrid>
        </StudentLayout>
    );
}

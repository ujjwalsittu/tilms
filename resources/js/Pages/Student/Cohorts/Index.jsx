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
    SimpleGrid,
    Progress,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { FiBook, FiUsers, FiArrowRight, FiCalendar } from 'react-icons/fi';

export default function Index({ enrollments = [] }) {
    const typeColor = { internship: 'purple', learning: 'blue' };

    return (
        <StudentLayout title="My Cohorts">
            <Head title="My Cohorts" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">My Cohorts</Text>
                <Link href={route('student.cohorts.index')}>
                    <Button size="sm" colorPalette="blue" variant="outline">Browse More Cohorts</Button>
                </Link>
            </Flex>

            {enrollments.length === 0 ? (
                <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center" borderWidth="1px" borderStyle="dashed">
                    <FiBook size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={2}>
                        You're not enrolled in any cohorts yet
                    </Text>
                    <Text color="gray.500" mb={4}>
                        Browse available cohorts and start your learning journey.
                    </Text>
                    <Link href={route('student.cohorts.index')}>
                        <Button colorPalette="blue">Browse Cohorts</Button>
                    </Link>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {enrollments.map((enrollment) => {
                        const cohort = enrollment.cohort ?? {};
                        const progress = enrollment.progress_percentage ?? 0;

                        return (
                            <Box
                                key={enrollment.id}
                                bg="white"
                                borderRadius="lg"
                                boxShadow="sm"
                                borderWidth="1px"
                                overflow="hidden"
                                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
                                transition="all 0.2s"
                            >
                                {/* Card Header */}
                                <Box
                                    bg={typeColor[cohort.type] === 'purple' ? 'purple.500' : 'blue.500'}
                                    h={2}
                                />

                                <Box p={5}>
                                    {/* Badges */}
                                    <HStack gap={2} mb={3}>
                                        <Badge colorPalette={typeColor[cohort.type] ?? 'gray'}>
                                            {cohort.type}
                                        </Badge>
                                        <StatusBadge status={enrollment.status} />
                                    </HStack>

                                    {/* Title */}
                                    <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={2}>
                                        {cohort.title}
                                    </Text>

                                    {cohort.description && (
                                        <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                                            {cohort.description}
                                        </Text>
                                    )}

                                    {/* Progress */}
                                    <Box mb={4}>
                                        <Flex justify="space-between" mb={1}>
                                            <Text fontSize="xs" color="gray.500">Progress</Text>
                                            <Text fontSize="xs" fontWeight="semibold" color={
                                                progress >= 70 ? 'green.600' : 'gray.600'
                                            }>
                                                {progress}%
                                            </Text>
                                        </Flex>
                                        <Progress
                                            value={progress}
                                            size="sm"
                                            colorPalette={progress >= 70 ? 'green' : progress >= 40 ? 'blue' : 'orange'}
                                            borderRadius="full"
                                        />
                                        <Text fontSize="xs" color="gray.400" mt={1}>
                                            {enrollment.tasks_completed ?? 0} / {enrollment.tasks_total ?? 0} tasks
                                        </Text>
                                    </Box>

                                    {/* Meta */}
                                    <VStack gap={1} align="start" mb={4}>
                                        {cohort.starts_at && (
                                            <HStack gap={1} color="gray.500" fontSize="xs">
                                                <FiCalendar size={12} />
                                                <Text>Started {new Date(cohort.starts_at).toLocaleDateString()}</Text>
                                            </HStack>
                                        )}
                                        {enrollment.last_active_at && (
                                            <Text fontSize="xs" color="gray.400">
                                                Last active {new Date(enrollment.last_active_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                    </VStack>

                                    {/* Action */}
                                    <Link href={route('student.cohorts.show', cohort.id)}>
                                        <Button
                                            w="full"
                                            colorPalette="blue"
                                            size="sm"
                                            variant={enrollment.status === 'completed' ? 'outline' : 'solid'}
                                        >
                                            {enrollment.status === 'completed' ? 'Review Cohort' : 'Continue Learning'}
                                        </Button>
                                    </Link>
                                </Box>
                            </Box>
                        );
                    })}
                </SimpleGrid>
            )}
        </StudentLayout>
    );
}

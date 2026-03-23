import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Flex,
    Text,
    VStack,
    Badge,
    SimpleGrid,
} from '@chakra-ui/react';
import { FiFileText, FiChevronRight, FiCalendar, FiTrendingUp } from 'react-icons/fi';

function MetricPill({ label, value, color = 'gray' }) {
    const colorMap = {
        gray: { bg: 'gray.100', text: 'gray.700' },
        blue: { bg: 'blue.50', text: 'blue.700' },
        green: { bg: 'green.50', text: 'green.700' },
        purple: { bg: 'purple.50', text: 'purple.700' },
    };
    const scheme = colorMap[color] || colorMap.gray;
    return (
        <Box bg={scheme.bg} px={2} py={1} borderRadius="md" display="inline-flex" alignItems="center" gap={1}>
            <Text fontSize="xs" fontWeight="semibold" color={scheme.text}>
                {label}:
            </Text>
            <Text fontSize="xs" color={scheme.text}>
                {value}
            </Text>
        </Box>
    );
}

function ReportCard({ report }) {
    const weekStart = report.report_week
        ? new Date(report.report_week).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : null;

    const summaryPreview = report.summary
        ? report.summary.slice(0, 150) + (report.summary.length > 150 ? '...' : '')
        : 'No summary available.';

    const metrics = report.metrics_snapshot || {};
    const completion = metrics.completion_percentage != null
        ? `${Math.round(metrics.completion_percentage)}%`
        : null;
    const tasksThisWeek = metrics.tasks_this_week != null
        ? metrics.tasks_this_week
        : null;

    return (
        <Link href={route('student.progress-reports.show', report.id)}>
            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                p={5}
                _hover={{ borderColor: 'blue.300', boxShadow: 'sm', transform: 'translateY(-1px)' }}
                transition="all 0.15s"
                cursor="pointer"
                h="full"
            >
                <Flex justify="space-between" align="flex-start" mb={3}>
                    <Box flex={1} mr={2}>
                        {/* Cohort name */}
                        <Text fontWeight="semibold" fontSize="sm" color="gray.800" mb={0.5}>
                            {report.cohort?.name || 'Unknown Cohort'}
                        </Text>
                        {/* Week date */}
                        {weekStart && (
                            <Flex align="center" gap={1}>
                                <Box color="gray.400" fontSize="xs">
                                    <FiCalendar size={11} />
                                </Box>
                                <Text fontSize="xs" color="gray.500">
                                    Week of {weekStart}
                                </Text>
                            </Flex>
                        )}
                    </Box>
                    <Flex align="center" gap={1} color="gray.400" shrink={0}>
                        <FiChevronRight size={14} />
                    </Flex>
                </Flex>

                {/* Summary preview */}
                <Text fontSize="xs" color="gray.600" lineHeight="1.6" mb={3}>
                    {summaryPreview}
                </Text>

                {/* Metrics */}
                {(completion || tasksThisWeek != null) && (
                    <Flex gap={2} wrap="wrap">
                        {completion && (
                            <MetricPill label="Completion" value={completion} color="green" />
                        )}
                        {tasksThisWeek != null && (
                            <MetricPill label="Tasks this week" value={tasksThisWeek} color="blue" />
                        )}
                    </Flex>
                )}
            </Box>
        </Link>
    );
}

export default function ProgressReports({ reports }) {
    return (
        <StudentLayout title="Weekly Progress Reports">
            <Head title="Weekly Progress Reports" />

            <Box maxW="5xl" mx="auto" px={4} py={6}>
                {/* Header */}
                <Flex align="flex-start" gap={3} mb={6}>
                    <Box
                        p={2.5}
                        bg="blue.50"
                        borderRadius="lg"
                        color="blue.500"
                        mt={0.5}
                    >
                        <FiTrendingUp size={20} />
                    </Box>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            Weekly Progress Reports
                        </Text>
                        <Text color="gray.500" mt={1} fontSize="sm">
                            AI-generated summaries of your weekly progress, strengths, and recommendations.
                        </Text>
                    </Box>
                </Flex>

                {/* Reports grid */}
                {reports.data.length === 0 ? (
                    <Box
                        textAlign="center"
                        py={14}
                        bg="white"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="gray.200"
                    >
                        <Box color="gray.300" mb={3}>
                            <FiFileText size={36} style={{ margin: '0 auto' }} />
                        </Box>
                        <Text color="gray.500" fontSize="sm" fontWeight="medium">
                            No progress reports yet
                        </Text>
                        <Text color="gray.400" fontSize="xs" mt={1}>
                            Reports are generated weekly based on your activity.
                        </Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        {reports.data.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </SimpleGrid>
                )}

                {/* Pagination */}
                {reports.last_page > 1 && (
                    <Flex justify="center" gap={2} mt={6}>
                        {reports.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'}>
                                <Box
                                    as="button"
                                    px={3}
                                    py={1}
                                    fontSize="sm"
                                    borderRadius="md"
                                    borderWidth="1px"
                                    bg={link.active ? 'blue.500' : 'white'}
                                    color={link.active ? 'white' : 'gray.600'}
                                    borderColor={link.active ? 'blue.500' : 'gray.200'}
                                    opacity={link.url ? 1 : 0.4}
                                    cursor={link.url ? 'pointer' : 'not-allowed'}
                                    _hover={link.url && !link.active ? { bg: 'gray.50' } : {}}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Link>
                        ))}
                    </Flex>
                )}
            </Box>
        </StudentLayout>
    );
}

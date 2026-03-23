import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Flex,
    Text,
    SimpleGrid,
    VStack,
    Button,
} from '@chakra-ui/react';
import {
    FiArrowLeft,
    FiCalendar,
    FiCheckCircle,
    FiAlertCircle,
    FiBook,
    FiTrendingUp,
    FiAward,
    FiTarget,
    FiZap,
} from 'react-icons/fi';

function SectionHeader({ icon, label, color }) {
    const colorMap = {
        green: { text: 'green.700', bg: 'green.50', icon: 'green.500' },
        orange: { text: 'orange.700', bg: 'orange.50', icon: 'orange.500' },
        blue: { text: 'blue.700', bg: 'blue.50', icon: 'blue.500' },
        gray: { text: 'gray.700', bg: 'gray.50', icon: 'gray.500' },
    };
    const scheme = colorMap[color] || colorMap.gray;
    return (
        <Flex align="center" gap={2} mb={3}>
            <Box color={scheme.icon}>{icon}</Box>
            <Text fontWeight="semibold" fontSize="md" color={scheme.text}>
                {label}
            </Text>
        </Flex>
    );
}

function BulletList({ items, color }) {
    const colorMap = {
        green: { dot: 'green.400', text: 'green.800', bg: 'green.50', border: 'green.100' },
        orange: { dot: 'orange.400', text: 'orange.800', bg: 'orange.50', border: 'orange.100' },
        blue: { dot: 'blue.400', text: 'blue.800', bg: 'blue.50', border: 'blue.100' },
    };
    const scheme = colorMap[color] || colorMap.blue;

    if (!items || items.length === 0) {
        return (
            <Text fontSize="sm" color="gray.400" fontStyle="italic">
                None listed.
            </Text>
        );
    }

    return (
        <VStack gap={2} align="stretch">
            {items.map((item, i) => (
                <Flex
                    key={i}
                    gap={2}
                    p={3}
                    bg={scheme.bg}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={scheme.border}
                    align="flex-start"
                >
                    <Box
                        w={2}
                        h={2}
                        bg={scheme.dot}
                        borderRadius="full"
                        mt={1.5}
                        shrink={0}
                    />
                    <Text fontSize="sm" color={scheme.text} lineHeight="1.6">
                        {item}
                    </Text>
                </Flex>
            ))}
        </VStack>
    );
}

function MetricCard({ icon, label, value, sublabel, color = 'blue' }) {
    const colorMap = {
        blue: { bg: 'blue.50', border: 'blue.100', icon: 'blue.500', value: 'blue.700', label: 'blue.600' },
        green: { bg: 'green.50', border: 'green.100', icon: 'green.500', value: 'green.700', label: 'green.600' },
        purple: { bg: 'purple.50', border: 'purple.100', icon: 'purple.500', value: 'purple.700', label: 'purple.600' },
        orange: { bg: 'orange.50', border: 'orange.100', icon: 'orange.500', value: 'orange.700', label: 'orange.600' },
    };
    const scheme = colorMap[color] || colorMap.blue;

    return (
        <Box
            bg={scheme.bg}
            borderWidth="1px"
            borderColor={scheme.border}
            borderRadius="lg"
            p={4}
            textAlign="center"
        >
            <Box color={scheme.icon} mb={2} mx="auto" w="fit-content">
                {icon}
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color={scheme.value} lineHeight="1">
                {value ?? '—'}
            </Text>
            <Text fontSize="xs" fontWeight="medium" color={scheme.label} mt={1}>
                {label}
            </Text>
            {sublabel && (
                <Text fontSize="xs" color="gray.400" mt={0.5}>
                    {sublabel}
                </Text>
            )}
        </Box>
    );
}

export default function ProgressReportDetail({ report }) {
    const metrics = report.metrics_snapshot || {};
    const strengths = report.strengths || [];
    const improvements = report.areas_for_improvement || [];
    const recommendations = report.recommendations || [];

    // Date range: week of report_week (Monday–Sunday)
    let weekRange = null;
    if (report.report_week) {
        const weekStart = new Date(report.report_week);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const fmt = (d) =>
            d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        weekRange = `${fmt(weekStart)} – ${fmt(weekEnd)}`;
    }

    const completionPct = metrics.completion_percentage != null
        ? `${Math.round(metrics.completion_percentage)}%`
        : null;
    const tasksThisWeek = metrics.tasks_this_week != null ? metrics.tasks_this_week : null;
    const avgScore = metrics.average_score != null
        ? `${Math.round(metrics.average_score)}%`
        : null;
    const streak = metrics.streak_days != null ? `${metrics.streak_days} days` : null;

    return (
        <StudentLayout title="Progress Report">
            <Head title="Weekly Progress Report" />

            <Box maxW="4xl" mx="auto" px={4} py={6}>
                {/* Back nav */}
                <Link href={route('student.progress-reports.index')}>
                    <Button variant="ghost" size="sm" px={2} mb={4}>
                        <FiArrowLeft style={{ marginRight: '4px' }} />
                        All Reports
                    </Button>
                </Link>

                {/* Header card */}
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={5}
                    mb={5}
                >
                    <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
                        {report.cohort?.name || 'Progress Report'}
                    </Text>
                    {weekRange && (
                        <Flex align="center" gap={1.5} color="gray.500">
                            <FiCalendar size={13} />
                            <Text fontSize="sm">{weekRange}</Text>
                        </Flex>
                    )}
                </Box>

                {/* Metrics */}
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mb={5}>
                    <MetricCard
                        icon={<FiTrendingUp size={20} />}
                        label="Completion"
                        value={completionPct}
                        color="green"
                    />
                    <MetricCard
                        icon={<FiCheckCircle size={20} />}
                        label="Tasks This Week"
                        value={tasksThisWeek}
                        color="blue"
                    />
                    <MetricCard
                        icon={<FiAward size={20} />}
                        label="Average Score"
                        value={avgScore}
                        color="purple"
                    />
                    <MetricCard
                        icon={<FiZap size={20} />}
                        label="Streak"
                        value={streak}
                        color="orange"
                    />
                </SimpleGrid>

                {/* Summary */}
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={5}
                    mb={4}
                >
                    <SectionHeader
                        icon={<FiBook size={16} />}
                        label="Weekly Summary"
                        color="gray"
                    />
                    <Text fontSize="sm" color="gray.700" lineHeight="1.8" whiteSpace="pre-wrap">
                        {report.summary || 'No summary available for this week.'}
                    </Text>
                </Box>

                {/* Strengths */}
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={5}
                    mb={4}
                >
                    <SectionHeader
                        icon={<FiCheckCircle size={16} />}
                        label="Strengths"
                        color="green"
                    />
                    <BulletList items={strengths} color="green" />
                </Box>

                {/* Areas for Improvement */}
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={5}
                    mb={4}
                >
                    <SectionHeader
                        icon={<FiAlertCircle size={16} />}
                        label="Areas for Improvement"
                        color="orange"
                    />
                    <BulletList items={improvements} color="orange" />
                </Box>

                {/* Recommendations */}
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={5}
                >
                    <SectionHeader
                        icon={<FiTarget size={16} />}
                        label="Recommendations"
                        color="blue"
                    />
                    <BulletList items={recommendations} color="blue" />
                </Box>
            </Box>
        </StudentLayout>
    );
}

import { Head } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    Box,
    SimpleGrid,
    Text,
    Flex,
    Progress,
    Badge,
    VStack,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const thresholds = {
    enrollment_rate:           { good: 70, warn: 40 },
    active_students:           { good: 60, warn: 30 },
    submission_rate:           { good: 65, warn: 35 },
    avg_time_per_task:         { good: null, warn: null }, // informational
    projected_certification_rate: { good: 60, warn: 35 },
};

function getHealthColor(key, value) {
    const t = thresholds[key];
    if (!t || t.good === null) return 'blue';
    if (value >= t.good) return 'green';
    if (value >= t.warn) return 'yellow';
    return 'red';
}

function getHealthLabel(key, value) {
    const t = thresholds[key];
    if (!t || t.good === null) return 'info';
    if (value >= t.good) return 'Good';
    if (value >= t.warn) return 'Warning';
    return 'Critical';
}

function MetricCard({ label, value, displayValue, suffix = '%', metricKey, description }) {
    const color = getHealthColor(metricKey, value);
    const healthLabel = getHealthLabel(metricKey, value);
    const colorMap = { green: 'green.500', yellow: 'yellow.500', red: 'red.500', blue: 'blue.500' };

    return (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderTopWidth="4px" borderTopColor={colorMap[color]}>
            <Flex justify="space-between" align="flex-start" mb={3}>
                <Text fontSize="sm" color="gray.500" fontWeight="medium">{label}</Text>
                <Badge
                    colorScheme={color === 'yellow' ? 'orange' : color}
                    variant="subtle"
                    fontSize="xs"
                >
                    {healthLabel}
                </Badge>
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color={colorMap[color]}>
                {displayValue ?? value}{suffix}
            </Text>
            {description && (
                <Text fontSize="xs" color="gray.400" mt={1}>{description}</Text>
            )}
            {suffix === '%' && (
                <Progress
                    value={Math.min(value, 100)}
                    colorScheme={color === 'yellow' ? 'orange' : color}
                    size="sm"
                    mt={3}
                    borderRadius="full"
                />
            )}
        </Box>
    );
}

export default function Health({ cohort, metrics = {} }) {
    const overallScore = (() => {
        const keys = ['enrollment_rate', 'active_students', 'submission_rate', 'projected_certification_rate'];
        const values = keys.map((k) => metrics[k] ?? 0);
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    })();

    const overallColor = overallScore >= 60 ? 'green' : overallScore >= 35 ? 'yellow' : 'red';

    return (
        <InstructorLayout title={`Health: ${cohort.title}`}>
            <Head title={`Cohort Health: ${cohort.title}`} />
            <FlashMessage />

            {/* Header */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold">{cohort.title}</Text>
                        <HStack gap={2} mt={1}>
                            <Text fontSize="sm" color="gray.500">Cohort Health Report</Text>
                            <StatusBadge status={cohort.status} />
                        </HStack>
                    </Box>
                    <Box textAlign="center">
                        <Text fontSize="4xl" fontWeight="bold" color={`${overallColor}.500`}>
                            {overallScore}%
                        </Text>
                        <Badge colorScheme={overallColor === 'yellow' ? 'orange' : overallColor} fontSize="sm">
                            Overall Health
                        </Badge>
                    </Box>
                </Flex>
                <Progress
                    value={overallScore}
                    colorScheme={overallColor === 'yellow' ? 'orange' : overallColor}
                    size="md"
                    mt={4}
                    borderRadius="full"
                />
            </Box>

            {/* Metrics Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4} mb={6}>
                <MetricCard
                    label="Enrollment Rate"
                    value={metrics.enrollment_rate ?? 0}
                    metricKey="enrollment_rate"
                    description="% of available spots filled"
                />
                <MetricCard
                    label="Active Students"
                    value={metrics.active_students ?? 0}
                    metricKey="active_students"
                    description="% of enrolled students active in last 7 days"
                />
                <MetricCard
                    label="Inactive Students"
                    value={metrics.inactive_students ?? 0}
                    metricKey="inactive_students"
                    description="% of enrolled students with no activity"
                />
                <MetricCard
                    label="Submission Rate"
                    value={metrics.submission_rate ?? 0}
                    metricKey="submission_rate"
                    description="% of tasks with at least one submission"
                />
                <MetricCard
                    label="Avg Time Per Task"
                    value={metrics.avg_time_per_task ?? 0}
                    displayValue={metrics.avg_time_per_task ?? 0}
                    suffix=" min"
                    metricKey="avg_time_per_task"
                    description="Average minutes spent per task"
                />
                <MetricCard
                    label="Projected Certification Rate"
                    value={metrics.projected_certification_rate ?? 0}
                    metricKey="projected_certification_rate"
                    description="% of students on track to earn certificate"
                />
            </SimpleGrid>

            {/* Legend */}
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                <Text fontWeight="semibold" mb={3}>Health Indicators</Text>
                <HStack gap={6} flexWrap="wrap">
                    <HStack gap={2}>
                        <Box w={3} h={3} borderRadius="full" bg="green.500" />
                        <Text fontSize="sm" color="gray.600">Good (&ge; 60%)</Text>
                    </HStack>
                    <HStack gap={2}>
                        <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
                        <Text fontSize="sm" color="gray.600">Warning (40–59%)</Text>
                    </HStack>
                    <HStack gap={2}>
                        <Box w={3} h={3} borderRadius="full" bg="red.500" />
                        <Text fontSize="sm" color="gray.600">Critical (&lt; 40%)</Text>
                    </HStack>
                    <HStack gap={2}>
                        <Box w={3} h={3} borderRadius="full" bg="blue.500" />
                        <Text fontSize="sm" color="gray.600">Informational</Text>
                    </HStack>
                </HStack>
            </Box>
        </InstructorLayout>
    );
}

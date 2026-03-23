import { Head } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Flex,
    Text,
    SimpleGrid,
    Table,
    Badge,
    Icon,
    HStack,
} from '@chakra-ui/react';
import { FiDollarSign, FiTrendingUp, FiUsers } from 'react-icons/fi';

function StatCard({ label, value, icon, color, subtext }) {
    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                    {subtext && <Text fontSize="xs" color="gray.400" mt={1}>{subtext}</Text>}
                </Box>
                <Flex w={12} h={12} bg={`${color}.50`} borderRadius="lg" align="center" justify="center">
                    <Icon as={icon} boxSize={6} color={`${color}.500`} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default function Overview({ stats = {}, monthlyCohortBreakdown = [] }) {
    return (
        <InstructorLayout title="Finance Overview">
            <Head title="Finance Overview" />
            <FlashMessage />

            <Text fontSize="2xl" fontWeight="bold" mb={6}>Finance Overview</Text>

            {/* Stat Cards */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
                <StatCard
                    label="Total Earnings"
                    value={`₹${(stats.total_earnings ?? 0).toLocaleString()}`}
                    icon={FiDollarSign}
                    color="green"
                    subtext="All time"
                />
                <StatCard
                    label="This Month"
                    value={`₹${(stats.this_month ?? 0).toLocaleString()}`}
                    icon={FiTrendingUp}
                    color="blue"
                    subtext={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                />
                <StatCard
                    label="Students Paid"
                    value={(stats.total_students_paid ?? 0).toLocaleString()}
                    icon={FiUsers}
                    color="purple"
                    subtext="Total paid enrollments"
                />
            </SimpleGrid>

            {/* Monthly/Cohort Breakdown */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                <Box p={5} borderBottomWidth="1px">
                    <Text fontWeight="semibold">Earnings Breakdown by Cohort &amp; Month</Text>
                </Box>

                {monthlyCohortBreakdown.length === 0 ? (
                    <Box p={8} textAlign="center">
                        <Text color="gray.500">No earnings data yet.</Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table.Root variant="line">
                            <Table.Header>
                                <Table.Row bg="gray.50">
                                    <Table.ColumnHeader>Month</Table.ColumnHeader>
                                    <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                                    <Table.ColumnHeader>Enrollments</Table.ColumnHeader>
                                    <Table.ColumnHeader>Revenue</Table.ColumnHeader>
                                    <Table.ColumnHeader>Avg Per Student</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {monthlyCohortBreakdown.map((row, index) => (
                                    <Table.Row key={index} _hover={{ bg: 'gray.50' }}>
                                        <Table.Cell>
                                            <Text fontWeight="medium">{row.month}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm">{row.cohort_title}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge colorScheme={row.cohort_type === 'internship' ? 'purple' : 'blue'}>
                                                {row.cohort_type}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={1} align="center">
                                                <Text>{row.enrollments}</Text>
                                                <Text fontSize="xs" color="gray.400">paid</Text>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontWeight="semibold" color="green.600">
                                                ₹{Number(row.revenue ?? 0).toLocaleString()}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color="gray.600">
                                                {row.enrollments > 0
                                                    ? `₹${Math.round((row.revenue ?? 0) / row.enrollments).toLocaleString()}`
                                                    : '—'}
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                )}

                {/* Totals Row */}
                {monthlyCohortBreakdown.length > 0 && (
                    <Box p={4} bg="gray.50" borderTopWidth="1px">
                        <Flex justify="flex-end" align="center" gap={8}>
                            <Text fontSize="sm" color="gray.500">Total</Text>
                            <Text fontWeight="bold" color="green.600" fontSize="lg">
                                ₹{monthlyCohortBreakdown
                                    .reduce((sum, r) => sum + Number(r.revenue ?? 0), 0)
                                    .toLocaleString()}
                            </Text>
                        </Flex>
                    </Box>
                )}
            </Box>
        </InstructorLayout>
    );
}

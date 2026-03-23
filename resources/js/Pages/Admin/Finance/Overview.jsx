import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Text, Flex, SimpleGrid, Icon,
    Table,
} from '@chakra-ui/react';
import { FiDollarSign, FiCreditCard, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

function StatCard({ label, value, icon, color }) {
    return (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                </Box>
                <Flex w={10} h={10} bg={`${color}.50`} borderRadius="lg" align="center" justify="center">
                    <Icon as={icon} boxSize={5} color={`${color}.500`} />
                </Flex>
            </Flex>
        </Box>
    );
}

const formatCurrency = (value) => `₹${Number(value ?? 0).toLocaleString()}`;

export default function FinanceOverview({ stats, monthlyRevenue }) {
    return (
        <AdminLayout title="Finance Overview">
            <Head title="Finance Overview - Admin" />

            <Box mb={6}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>Finance Overview</Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                    <StatCard
                        label="Total Revenue"
                        value={formatCurrency(stats?.total_revenue)}
                        icon={FiDollarSign}
                        color="green"
                    />
                    <StatCard
                        label="Monthly Revenue"
                        value={formatCurrency(stats?.monthly_revenue)}
                        icon={FiTrendingUp}
                        color="blue"
                    />
                    <StatCard
                        label="Total Payments"
                        value={stats?.total_payments ?? 0}
                        icon={FiCreditCard}
                        color="purple"
                    />
                    <StatCard
                        label="Avg. Payment"
                        value={formatCurrency(stats?.avg_payment)}
                        icon={FiBarChart2}
                        color="orange"
                    />
                </SimpleGrid>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Text fontWeight="semibold" fontSize="lg" mb={4}>Monthly Revenue Breakdown</Text>
                {monthlyRevenue && monthlyRevenue.length > 0 ? (
                    <Box overflowX="auto">
                        <Table.Root size="sm" variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Month</Table.ColumnHeader>
                                    <Table.ColumnHeader>Payments</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Revenue</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {monthlyRevenue.map((row, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell>{row.month}</Table.Cell>
                                        <Table.Cell>{row.count ?? row.payments ?? 0}</Table.Cell>
                                        <Table.Cell isNumeric fontWeight="medium">{formatCurrency(row.total ?? row.revenue)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                ) : (
                    <Text color="gray.500" fontSize="sm">No revenue data available.</Text>
                )}
            </Box>
        </AdminLayout>
    );
}

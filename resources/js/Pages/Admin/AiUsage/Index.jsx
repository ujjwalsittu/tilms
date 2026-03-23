import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Text, Flex, SimpleGrid,
    Table,
} from '@chakra-ui/react';
import { FiCpu, FiDollarSign, FiActivity, FiZap } from 'react-icons/fi';

function StatCard({ label, value, icon: IconComp, color }) {
    return (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                </Box>
                <Flex w={10} h={10} bg={`${color}.50`} borderRadius="lg" align="center" justify="center">
                    <IconComp size={20} />
                </Flex>
            </Flex>
        </Box>
    );
}

const formatTokens = (n) => Number(n ?? 0).toLocaleString();
const formatCost = (n) => `$${Number(n ?? 0).toFixed(4)}`;

export default function AiUsageIndex({ stats, usageByFeature, usageByModel }) {
    return (
        <AdminLayout title="AI Usage">
            <Head title="AI Usage - Admin" />

            <Box mb={6}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>AI Usage Dashboard</Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                    <StatCard
                        label="Total Tokens Used"
                        value={formatTokens(stats?.total_tokens)}
                        icon={FiCpu}
                        color="blue"
                    />
                    <StatCard
                        label="Total Cost"
                        value={formatCost(stats?.total_cost)}
                        icon={FiDollarSign}
                        color="green"
                    />
                    <StatCard
                        label="Total Requests"
                        value={formatTokens(stats?.total_requests)}
                        icon={FiActivity}
                        color="purple"
                    />
                    <StatCard
                        label="Avg Tokens/Request"
                        value={formatTokens(stats?.avg_tokens)}
                        icon={FiZap}
                        color="orange"
                    />
                </SimpleGrid>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                {/* Usage by Feature */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Usage by Feature</Text>
                    {usageByFeature && usageByFeature.length > 0 ? (
                        <Table.Root size="sm" variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Feature</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Requests</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Tokens</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Cost</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {usageByFeature.map((row, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell fontWeight="medium">{row.feature}</Table.Cell>
                                        <Table.Cell isNumeric>{formatTokens(row.requests ?? row.count)}</Table.Cell>
                                        <Table.Cell isNumeric>{formatTokens(row.tokens ?? row.total_tokens)}</Table.Cell>
                                        <Table.Cell isNumeric>{formatCost(row.cost ?? row.total_cost)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No feature usage data available.</Text>
                    )}
                </Box>

                {/* Usage by Model */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Usage by Model</Text>
                    {usageByModel && usageByModel.length > 0 ? (
                        <Table.Root size="sm" variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Model</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Requests</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Tokens</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Cost</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {usageByModel.map((row, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell fontFamily="mono" fontSize="xs">{row.model}</Table.Cell>
                                        <Table.Cell isNumeric>{formatTokens(row.requests ?? row.count)}</Table.Cell>
                                        <Table.Cell isNumeric>{formatTokens(row.tokens ?? row.total_tokens)}</Table.Cell>
                                        <Table.Cell isNumeric>{formatCost(row.cost ?? row.total_cost)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No model usage data available.</Text>
                    )}
                </Box>
            </SimpleGrid>
        </AdminLayout>
    );
}

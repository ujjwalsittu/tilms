import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Text, Flex, Badge, HStack,
    Table,
} from '@chakra-ui/react';

function Pagination({ links }) {
    return (
        <HStack justify="center" mt={4} gap={2}>
            {links.map((link, i) => (
                <Button
                    key={i}
                    size="sm"
                    variant={link.active ? 'solid' : 'outline'}
                    colorPalette="blue"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </HStack>
    );
}

const statusBadgeColor = (status) => {
    switch (status) {
        case 'paid':
        case 'success': return 'green';
        case 'pending': return 'yellow';
        case 'failed': return 'red';
        case 'refunded': return 'purple';
        default: return 'gray';
    }
};

const formatCurrency = (value) => `₹${Number(value ?? 0).toLocaleString()}`;

export default function Transactions({ payments }) {
    return (
        <AdminLayout title="Transactions">
            <Head title="Transactions - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Text fontSize="xl" fontWeight="bold" mb={6}>Payment Transactions</Text>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Student</Table.ColumnHeader>
                                <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                <Table.ColumnHeader isNumeric>Amount</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Date</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {payments.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <Text color="gray.500" textAlign="center" py={4}>No transactions found.</Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                payments.data.map((payment) => (
                                    <Table.Row key={payment.id}>
                                        <Table.Cell>
                                            <Text fontWeight="medium">{payment.user?.name ?? '—'}</Text>
                                            <Text fontSize="xs" color="gray.500">{payment.user?.email ?? ''}</Text>
                                        </Table.Cell>
                                        <Table.Cell>{payment.enrollment?.cohort?.name ?? '—'}</Table.Cell>
                                        <Table.Cell isNumeric fontWeight="medium">{formatCurrency(payment.amount)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge colorPalette={statusBadgeColor(payment.status)} size="sm">
                                                {payment.status}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : '—'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {payment.razorpay_order_id && (
                                                <Text fontFamily="mono" fontSize="xs" color="gray.500" title="Razorpay Order ID">
                                                    {payment.razorpay_order_id}
                                                </Text>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                <Flex justify="space-between" align="center" mt={4}>
                    <Text fontSize="sm" color="gray.500">
                        Showing {payments.data.length} of {payments.total} transactions
                    </Text>
                    <Pagination links={payments.links} />
                </Flex>
            </Box>
        </AdminLayout>
    );
}

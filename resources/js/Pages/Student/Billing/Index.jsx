import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import {
    Box,
    Badge,
    Button,
    Flex,
    HStack,
    Table,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FiDownload, FiEye, FiCreditCard } from 'react-icons/fi';

const statusColor = {
    paid: 'green',
    pending: 'yellow',
    failed: 'red',
    refunded: 'orange',
    cancelled: 'gray',
};

function PaymentStatusBadge({ status }) {
    return (
        <Badge colorPalette={statusColor[status] ?? 'gray'} textTransform="capitalize">
            {status}
        </Badge>
    );
}

function EmptyState() {
    return (
        <Box py={16} textAlign="center">
            <Flex w={16} h={16} bg="purple.50" borderRadius="full" align="center" justify="center" mx="auto" mb={4}>
                <FiCreditCard size={28} color="#6B46C1" />
            </Flex>
            <Text fontWeight="semibold" fontSize="lg" mb={1}>No payments yet</Text>
            <Text color="gray.500" fontSize="sm" mb={4}>
                Your payment history will appear here once you enroll in a cohort.
            </Text>
            <Link href={route('student.cohorts.index')}>
                <Button colorPalette="purple" size="sm">Browse Cohorts</Button>
            </Link>
        </Box>
    );
}

export default function Index({ payments }) {
    const rows = payments?.data ?? [];
    const hasRows = rows.length > 0;

    return (
        <StudentLayout title="Billing & Payments">
            <Head title="Billing & Payments" />
            <FlashMessage />

            {/* Page header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Billing &amp; Payments</Text>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        View your payment history and download invoices
                    </Text>
                </Box>
            </Flex>

            {/* Summary strip */}
            {hasRows && (
                <HStack gap={4} mb={6} flexWrap="wrap">
                    <Box
                        bg="white"
                        px={5}
                        py={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor="gray.200"
                        flex="1"
                        minW="150px"
                    >
                        <Text fontSize="xs" color="gray.500" mb={1}>Total Paid</Text>
                        <Text fontWeight="bold" fontSize="xl" color="green.600">
                            ₹{rows
                                .filter(p => p.status === 'paid')
                                .reduce((s, p) => s + Number(p.amount ?? 0), 0)
                                .toLocaleString()}
                        </Text>
                    </Box>
                    <Box
                        bg="white"
                        px={5}
                        py={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor="gray.200"
                        flex="1"
                        minW="150px"
                    >
                        <Text fontSize="xs" color="gray.500" mb={1}>Enrollments</Text>
                        <Text fontWeight="bold" fontSize="xl">
                            {rows.filter(p => p.status === 'paid').length}
                        </Text>
                    </Box>
                    <Box
                        bg="white"
                        px={5}
                        py={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor="gray.200"
                        flex="1"
                        minW="150px"
                    >
                        <Text fontSize="xs" color="gray.500" mb={1}>Pending</Text>
                        <Text fontWeight="bold" fontSize="xl" color="yellow.600">
                            {rows.filter(p => p.status === 'pending').length}
                        </Text>
                    </Box>
                </HStack>
            )}

            {/* Table */}
            <Box
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.200"
                overflow="hidden"
            >
                {!hasRows ? (
                    <EmptyState />
                ) : (
                    <>
                        <Box overflowX="auto">
                            <Table.Root variant="line">
                                <Table.Header>
                                    <Table.Row bg="gray.50">
                                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                                        <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                        <Table.ColumnHeader>Amount</Table.ColumnHeader>
                                        <Table.ColumnHeader>Discount</Table.ColumnHeader>
                                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                                        <Table.ColumnHeader>Invoice</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {rows.map((payment) => (
                                        <Table.Row key={payment.id} _hover={{ bg: 'gray.50' }}>
                                            {/* Date */}
                                            <Table.Cell>
                                                <VStack align="start" gap={0}>
                                                    <Text fontSize="sm" fontWeight="medium">
                                                        {new Date(payment.created_at).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.400">
                                                        {new Date(payment.created_at).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </Text>
                                                </VStack>
                                            </Table.Cell>

                                            {/* Cohort */}
                                            <Table.Cell>
                                                <VStack align="start" gap={0.5}>
                                                    <Text fontSize="sm" fontWeight="medium">
                                                        {payment.cohort?.title ?? '—'}
                                                    </Text>
                                                    {payment.cohort?.type && (
                                                        <Badge
                                                            size="sm"
                                                            colorPalette={payment.cohort.type === 'internship' ? 'purple' : 'blue'}
                                                            variant="subtle"
                                                        >
                                                            {payment.cohort.type}
                                                        </Badge>
                                                    )}
                                                </VStack>
                                            </Table.Cell>

                                            {/* Amount */}
                                            <Table.Cell>
                                                <Text fontWeight="semibold" color="gray.800">
                                                    {payment.currency ?? 'INR'} {Number(payment.amount ?? 0).toLocaleString()}
                                                </Text>
                                            </Table.Cell>

                                            {/* Discount */}
                                            <Table.Cell>
                                                {Number(payment.discount_amount ?? 0) > 0 ? (
                                                    <Text fontSize="sm" color="green.600">
                                                        − {payment.currency ?? 'INR'} {Number(payment.discount_amount).toLocaleString()}
                                                    </Text>
                                                ) : (
                                                    <Text fontSize="sm" color="gray.400">—</Text>
                                                )}
                                            </Table.Cell>

                                            {/* Status */}
                                            <Table.Cell>
                                                <PaymentStatusBadge status={payment.status} />
                                            </Table.Cell>

                                            {/* Invoice */}
                                            <Table.Cell>
                                                {payment.invoice ? (
                                                    <HStack gap={1}>
                                                        <Link href={route('student.billing.invoice', payment.invoice.id)}>
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                colorPalette="gray"
                                                                aria-label="View invoice"
                                                            >
                                                                <FiEye />
                                                            </Button>
                                                        </Link>
                                                        <a
                                                            href={route('student.billing.invoice', payment.invoice.id)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                colorPalette="purple"
                                                                aria-label="Download invoice"
                                                            >
                                                                <FiDownload />
                                                            </Button>
                                                        </a>
                                                    </HStack>
                                                ) : (
                                                    <Text fontSize="xs" color="gray.400">—</Text>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>

                        {/* Pagination */}
                        {payments?.last_page > 1 && (
                            <Box p={4} borderTopWidth="1px" borderColor="gray.100">
                                <Pagination
                                    links={payments.links}
                                    currentPage={payments.current_page}
                                    lastPage={payments.last_page}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </StudentLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    Box, Button, Flex, Text, Table, HStack,
} from '@chakra-ui/react';
import { FiEye, FiPlus } from 'react-icons/fi';

export default function SupportIndex({ tickets }) {
    return (
        <StudentLayout title="Support">
            <Head title="Support" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">Support Tickets</Text>
                <Link href={route('student.support.create')}>
                    <Button colorPalette="blue" size="sm">
                        <FiPlus />
                        Create Ticket
                    </Button>
                </Link>
            </Flex>

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" overflow="hidden">
                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader>Subject</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Priority</Table.ColumnHeader>
                                <Table.ColumnHeader>Created At</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tickets.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <Text color="gray.500" textAlign="center" py={6}>
                                            No support tickets found. Create one to get help.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                tickets.data.map((ticket) => (
                                    <Table.Row key={ticket.id} _hover={{ bg: 'gray.50' }}>
                                        <Table.Cell fontWeight="medium" maxW="xs">
                                            <Text truncate>{ticket.subject}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadge status={ticket.status} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadge status={ticket.priority} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color="gray.500">
                                                {ticket.created_at
                                                    ? new Date(ticket.created_at).toLocaleDateString()
                                                    : '—'}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link href={route('student.support.show', ticket.id)}>
                                                <Button size="xs" variant="ghost" colorPalette="blue" aria-label="View ticket">
                                                    <FiEye />
                                                </Button>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                {tickets.last_page > 1 && (
                    <Box px={4} py={3} borderTopWidth="1px" borderColor="gray.100">
                        <Flex justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.500">
                                Showing {tickets.data.length} of {tickets.total} tickets
                            </Text>
                            <Pagination
                                links={tickets.links}
                                currentPage={tickets.current_page}
                                lastPage={tickets.last_page}
                            />
                        </Flex>
                    </Box>
                )}
            </Box>
        </StudentLayout>
    );
}

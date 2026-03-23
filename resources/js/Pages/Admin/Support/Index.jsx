import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, HStack, Badge, Flex, Text,
    Table, NativeSelect,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { useState } from 'react';

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

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

const statusBadgeColor = (status) => {
    switch (status) {
        case 'open': return 'blue';
        case 'in_progress': return 'yellow';
        case 'resolved': return 'green';
        case 'closed': return 'gray';
        default: return 'gray';
    }
};

const priorityBadgeColor = (priority) => {
    switch (priority) {
        case 'urgent': return 'red';
        case 'high': return 'orange';
        case 'medium': return 'yellow';
        case 'low': return 'gray';
        default: return 'gray';
    }
};

export default function SupportIndex({ tickets, filters }) {
    const [status, setStatus] = useState(filters?.status ?? '');

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        router.get(route('admin.support.index'), { status: val }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Support Tickets">
            <Head title="Support Tickets - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Support Tickets</Text>
                </Flex>

                <HStack mb={4} gap={3}>
                    <NativeSelect.Root size="sm" maxW="xs">
                        <NativeSelect.Field value={status} onChange={handleStatusChange}>
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </HStack>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Subject</Table.ColumnHeader>
                                <Table.ColumnHeader>User</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Priority</Table.ColumnHeader>
                                <Table.ColumnHeader>Created At</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tickets.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <Text color="gray.500" textAlign="center" py={4}>No tickets found.</Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                tickets.data.map((ticket) => (
                                    <Table.Row key={ticket.id}>
                                        <Table.Cell fontWeight="medium" maxW="xs">
                                            <Text truncate>{ticket.subject}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm">{ticket.user?.name ?? '—'}</Text>
                                            <Text fontSize="xs" color="gray.500">{ticket.user?.email ?? ''}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge colorPalette={statusBadgeColor(ticket.status)} size="sm">
                                                {ticket.status}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge colorPalette={priorityBadgeColor(ticket.priority)} size="sm">
                                                {ticket.priority ?? 'medium'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell fontSize="sm">
                                            {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link href={route('admin.support.show', ticket.id)}>
                                                <Button size="xs" variant="ghost" colorPalette="blue" aria-label="View">
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

                <Flex justify="space-between" align="center" mt={4}>
                    <Text fontSize="sm" color="gray.500">
                        Showing {tickets.data.length} of {tickets.total} tickets
                    </Text>
                    <Pagination links={tickets.links} />
                </Flex>
            </Box>
        </AdminLayout>
    );
}

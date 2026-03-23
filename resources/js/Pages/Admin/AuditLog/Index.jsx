import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, HStack, Text, Flex,
    Table,
} from '@chakra-ui/react';
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

export default function AuditLogIndex({ logs }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.audit-logs.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Audit Log">
            <Head title="Audit Log - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Audit Log</Text>
                </Flex>

                <form onSubmit={handleSearch}>
                    <HStack mb={4} maxW="md">
                        <Input
                            placeholder="Filter by action..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="sm"
                        />
                        <Button type="submit" colorPalette="blue" size="sm">Search</Button>
                    </HStack>
                </form>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Timestamp</Table.ColumnHeader>
                                <Table.ColumnHeader>User</Table.ColumnHeader>
                                <Table.ColumnHeader>Action</Table.ColumnHeader>
                                <Table.ColumnHeader>Resource</Table.ColumnHeader>
                                <Table.ColumnHeader>IP Address</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {logs.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <Text color="gray.500" textAlign="center" py={4}>No audit log entries found.</Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                logs.data.map((log) => (
                                    <Table.Row key={log.id}>
                                        <Table.Cell whiteSpace="nowrap" fontSize="xs" color="gray.600">
                                            {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" fontWeight="medium">{log.user?.name ?? 'System'}</Text>
                                            <Text fontSize="xs" color="gray.500">{log.user?.email ?? ''}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontFamily="mono" fontSize="xs" bg="gray.100" px={2} py={0.5} borderRadius="md" display="inline">
                                                {log.action}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {log.resource_type && (
                                                <Text fontSize="sm">
                                                    {log.resource_type}
                                                    {log.resource_id && <Text as="span" color="gray.500"> #{log.resource_id}</Text>}
                                                </Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell fontFamily="mono" fontSize="xs">{log.ip_address ?? '—'}</Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                <Flex justify="space-between" align="center" mt={4}>
                    <Text fontSize="sm" color="gray.500">
                        Showing {logs.data.length} of {logs.total} entries
                    </Text>
                    <Pagination links={logs.links} />
                </Flex>
            </Box>
        </AdminLayout>
    );
}

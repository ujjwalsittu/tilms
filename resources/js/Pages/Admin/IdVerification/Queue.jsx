import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Text, Flex, HStack,
    Table,
} from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';

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

export default function IdVerificationQueue({ users }) {
    const handleApprove = (userId) => {
        if (confirm('Approve this ID verification?')) {
            router.put(route('admin.id-verification.update', userId), { status: 'approved' });
        }
    };

    const handleReject = (userId) => {
        const reason = prompt('Enter rejection reason (optional):');
        router.put(route('admin.id-verification.update', userId), { status: 'rejected', reason: reason ?? '' });
    };

    return (
        <AdminLayout title="ID Verification Queue">
            <Head title="ID Verification Queue - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Box>
                        <Text fontSize="xl" fontWeight="bold">ID Verification Queue</Text>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                            {users.total} pending verification{users.total !== 1 ? 's' : ''}
                        </Text>
                    </Box>
                </Flex>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Email</Table.ColumnHeader>
                                <Table.ColumnHeader>Submitted At</Table.ColumnHeader>
                                <Table.ColumnHeader>Document</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <Text color="gray.500" textAlign="center" py={6}>
                                            No pending ID verifications.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                users.data.map((user) => (
                                    <Table.Row key={user.id}>
                                        <Table.Cell fontWeight="medium">{user.name}</Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell fontSize="sm">
                                            {user.id_document_uploaded_at
                                                ? new Date(user.id_document_uploaded_at).toLocaleDateString()
                                                : user.updated_at
                                                    ? new Date(user.updated_at).toLocaleDateString()
                                                    : '—'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.id_document_path ? (
                                                <Button
                                                    as="a"
                                                    href={`/storage/${user.id_document_path}`}
                                                    target="_blank"
                                                    size="xs"
                                                    variant="outline"
                                                    colorPalette="blue"
                                                >
                                                    View Document
                                                </Button>
                                            ) : (
                                                <Text fontSize="xs" color="gray.400">No document</Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={2}>
                                                <Button
                                                    size="xs"
                                                    colorPalette="green"
                                                    onClick={() => handleApprove(user.id)}
                                                >
                                                    <FiCheck /> Approve
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    colorPalette="red"
                                                    variant="outline"
                                                    onClick={() => handleReject(user.id)}
                                                >
                                                    <FiX /> Reject
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                <Flex justify="space-between" align="center" mt={4}>
                    <Text fontSize="sm" color="gray.500">
                        Showing {users.data.length} of {users.total} users
                    </Text>
                    <Pagination links={users.links} />
                </Flex>
            </Box>
        </AdminLayout>
    );
}

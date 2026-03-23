import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import {
    Box, Button, Flex, Text, Table, HStack, Badge, Input,
} from '@chakra-ui/react';
import { FiEye, FiPlus } from 'react-icons/fi';
import { useState } from 'react';

export default function PartnersIndex({ partners }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.partners.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Partners">
            <Head title="Partners - Admin" />
            <FlashMessage />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Partners</Text>
                    <Link href={route('admin.partners.create')}>
                        <Button colorPalette="blue" size="sm">
                            <FiPlus />
                            Add Partner
                        </Button>
                    </Link>
                </Flex>

                <form onSubmit={handleSearch}>
                    <HStack mb={4} gap={3}>
                        <Input
                            placeholder="Search by name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="sm"
                            maxW="xs"
                        />
                        <Button type="submit" colorPalette="blue" size="sm">Search</Button>
                    </HStack>
                </form>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Contact</Table.ColumnHeader>
                                <Table.ColumnHeader>Affiliate Code</Table.ColumnHeader>
                                <Table.ColumnHeader>Students</Table.ColumnHeader>
                                <Table.ColumnHeader>Active</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {partners.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <Text color="gray.500" textAlign="center" py={6}>
                                            No partners found.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                partners.data.map((partner) => (
                                    <Table.Row key={partner.id} _hover={{ bg: 'gray.50' }}>
                                        <Table.Cell fontWeight="medium">{partner.name}</Table.Cell>
                                        <Table.Cell>
                                            <Box>
                                                <Text fontSize="sm">{partner.contact_name ?? '—'}</Text>
                                                {partner.contact_email && (
                                                    <Text fontSize="xs" color="gray.400">{partner.contact_email}</Text>
                                                )}
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontFamily="mono" fontSize="xs" bg="gray.100" px={2} py={0.5} borderRadius="md" display="inline-block">
                                                {partner.affiliate_code ?? '—'}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>{partner.enrollments_count ?? 0}</Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                colorPalette={partner.is_active ? 'green' : 'red'}
                                                size="sm"
                                            >
                                                {partner.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link href={route('admin.partners.show', partner.id)}>
                                                <Button size="xs" variant="ghost" colorPalette="blue" aria-label="View partner">
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

                {partners.last_page > 1 && (
                    <Flex justify="space-between" align="center" mt={4}>
                        <Text fontSize="sm" color="gray.500">
                            Showing {partners.data.length} of {partners.total} partners
                        </Text>
                        <Pagination
                            links={partners.links}
                            currentPage={partners.current_page}
                            lastPage={partners.last_page}
                        />
                    </Flex>
                )}
            </Box>
        </AdminLayout>
    );
}

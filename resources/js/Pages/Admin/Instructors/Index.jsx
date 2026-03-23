import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, HStack, Badge, Flex, Text,
    Table,
} from '@chakra-ui/react';
import { FiPlus, FiEye, FiEdit, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useState } from 'react';

function Pagination({ links, currentPage, lastPage }) {
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

export default function InstructorsIndex({ instructors }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.instructors.index'), { search }, { preserveState: true, replace: true });
    };

    const handleToggleActive = (instructor) => {
        router.patch(route('admin.instructors.toggle-active', instructor.id), {}, { preserveState: true });
    };

    return (
        <AdminLayout title="Instructors">
            <Head title="Instructors - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Instructors</Text>
                    <Link href={route('admin.instructors.create')}>
                        <Button colorPalette="blue" size="sm">
                            <FiPlus />
                            Create Instructor
                        </Button>
                    </Link>
                </Flex>

                <form onSubmit={handleSearch}>
                    <HStack mb={4} maxW="md">
                        <Input
                            placeholder="Search by name or email..."
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
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Email</Table.ColumnHeader>
                                <Table.ColumnHeader>Specialization</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Cohorts</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {instructors.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <Text color="gray.500" textAlign="center" py={4}>No instructors found.</Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                instructors.data.map((instructor) => (
                                    <Table.Row key={instructor.id}>
                                        <Table.Cell fontWeight="medium">{instructor.name}</Table.Cell>
                                        <Table.Cell>{instructor.email}</Table.Cell>
                                        <Table.Cell>{instructor.instructor_profile?.specialization ?? '—'}</Table.Cell>
                                        <Table.Cell>
                                            <Badge colorPalette={instructor.is_active ? 'green' : 'red'} size="sm">
                                                {instructor.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>{instructor.cohorts_count ?? 0}</Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={1}>
                                                <Link href={route('admin.instructors.show', instructor.id)}>
                                                    <Button aria-label="View" size="xs" variant="ghost" colorPalette="blue">
                                                        <FiEye />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.instructors.edit', instructor.id)}>
                                                    <Button aria-label="Edit" size="xs" variant="ghost" colorPalette="orange">
                                                        <FiEdit />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    aria-label="Toggle Active"
                                                    size="xs"
                                                    variant="ghost"
                                                    colorPalette={instructor.is_active ? 'red' : 'green'}
                                                    onClick={() => handleToggleActive(instructor)}
                                                >
                                                    {instructor.is_active ? <FiToggleRight /> : <FiToggleLeft />}
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
                        Showing {instructors.data.length} of {instructors.total} instructors
                    </Text>
                    <Pagination links={instructors.links} currentPage={instructors.current_page} lastPage={instructors.last_page} />
                </Flex>
            </Box>
        </AdminLayout>
    );
}

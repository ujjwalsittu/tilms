import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, HStack, Badge, Flex, Text,
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

const VERIFICATION_OPTIONS = [
    { value: '', label: 'All Verification Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'not_submitted', label: 'Not Submitted' },
];

export default function StudentsIndex({ students, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [verificationStatus, setVerificationStatus] = useState(filters?.id_verification_status ?? '');

    const applyFilters = (newSearch, newStatus) => {
        router.get(
            route('admin.students.index'),
            { search: newSearch, id_verification_status: newStatus },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters(search, verificationStatus);
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setVerificationStatus(val);
        applyFilters(search, val);
    };

    const verificationBadgeColor = (status) => {
        switch (status) {
            case 'verified': return 'green';
            case 'pending': return 'yellow';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };

    return (
        <AdminLayout title="Students">
            <Head title="Students - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Students</Text>
                </Flex>

                <form onSubmit={handleSearch}>
                    <HStack mb={4} gap={3} flexWrap="wrap">
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="sm"
                            maxW="xs"
                        />
                        <NativeSelect.Root size="sm" maxW="xs">
                            <NativeSelect.Field value={verificationStatus} onChange={handleStatusChange}>
                                {VERIFICATION_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <Button type="submit" colorPalette="blue" size="sm">Search</Button>
                    </HStack>
                </form>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Email</Table.ColumnHeader>
                                <Table.ColumnHeader>Verified</Table.ColumnHeader>
                                <Table.ColumnHeader>Active</Table.ColumnHeader>
                                <Table.ColumnHeader>Enrollments</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {students.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <Text color="gray.500" textAlign="center" py={4}>No students found.</Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                students.data.map((student) => (
                                    <Table.Row key={student.id}>
                                        <Table.Cell fontWeight="medium">{student.name}</Table.Cell>
                                        <Table.Cell>{student.email}</Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                colorPalette={verificationBadgeColor(student.id_verification_status)}
                                                size="sm"
                                            >
                                                {student.id_verification_status ?? 'not_submitted'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge colorPalette={student.is_active ? 'green' : 'red'} size="sm">
                                                {student.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>{student.enrollments_count ?? 0}</Table.Cell>
                                        <Table.Cell>
                                            <Link href={route('admin.students.show', student.id)}>
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
                        Showing {students.data.length} of {students.total} students
                    </Text>
                    <Pagination links={students.links} />
                </Flex>
            </Box>
        </AdminLayout>
    );
}

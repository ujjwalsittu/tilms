import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Text, Flex, Badge, HStack, VStack,
    Table,
} from '@chakra-ui/react';

const verificationBadgeColor = (status) => {
    switch (status) {
        case 'verified': return 'green';
        case 'pending': return 'yellow';
        case 'rejected': return 'red';
        default: return 'gray';
    }
};

export default function StudentsShow({ student, enrollments, certificates }) {
    return (
        <AdminLayout title="Student Details">
            <Head title={`${student.name} - Admin`} />

            <VStack gap={6} align="stretch">
                {/* Profile Header */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Flex justify="space-between" align="flex-start">
                        <Box>
                            <Flex align="center" gap={3} mb={2}>
                                <Text fontSize="2xl" fontWeight="bold">{student.name}</Text>
                                <Badge colorPalette={student.is_active ? 'green' : 'red'} size="sm">
                                    {student.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </Flex>
                            <Text color="gray.600" mb={2}>{student.email}</Text>
                            {student.phone && <Text color="gray.500" fontSize="sm">{student.phone}</Text>}
                            <HStack mt={3} gap={3}>
                                <Box>
                                    <Text fontSize="xs" color="gray.400" mb={1}>ID Verification</Text>
                                    <Badge colorPalette={verificationBadgeColor(student.id_verification_status)} size="sm">
                                        {student.id_verification_status ?? 'Not Submitted'}
                                    </Badge>
                                </Box>
                                <Box>
                                    <Text fontSize="xs" color="gray.400" mb={1}>Joined</Text>
                                    <Text fontSize="sm">{student.created_at ? new Date(student.created_at).toLocaleDateString() : '—'}</Text>
                                </Box>
                            </HStack>
                        </Box>
                        <Link href={route('admin.students.index')}>
                            <Button size="sm" variant="outline">Back to List</Button>
                        </Link>
                    </Flex>
                </Box>

                {/* Enrollments */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Enrollments ({enrollments?.length ?? 0})</Text>
                    {enrollments && enrollments.length > 0 ? (
                        <Box overflowX="auto">
                            <Table.Root size="sm" variant="outline">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                        <Table.ColumnHeader>Instructor</Table.ColumnHeader>
                                        <Table.ColumnHeader>Enrolled At</Table.ColumnHeader>
                                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                                        <Table.ColumnHeader>Payment Status</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {enrollments.map((enrollment) => (
                                        <Table.Row key={enrollment.id}>
                                            <Table.Cell fontWeight="medium">{enrollment.cohort?.name ?? '—'}</Table.Cell>
                                            <Table.Cell>{enrollment.cohort?.instructor?.name ?? '—'}</Table.Cell>
                                            <Table.Cell>{enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString() : '—'}</Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={enrollment.status === 'active' ? 'green' : 'gray'} size="sm">
                                                    {enrollment.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={enrollment.payment_status === 'paid' ? 'green' : 'yellow'} size="sm">
                                                    {enrollment.payment_status ?? 'pending'}
                                                </Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No enrollments found.</Text>
                    )}
                </Box>

                {/* Certificates */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Certificates ({certificates?.length ?? 0})</Text>
                    {certificates && certificates.length > 0 ? (
                        <Box overflowX="auto">
                            <Table.Root size="sm" variant="outline">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                        <Table.ColumnHeader>Certificate Number</Table.ColumnHeader>
                                        <Table.ColumnHeader>Issued At</Table.ColumnHeader>
                                        <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {certificates.map((cert) => (
                                        <Table.Row key={cert.id}>
                                            <Table.Cell>{cert.cohort?.name ?? '—'}</Table.Cell>
                                            <Table.Cell fontFamily="mono" fontSize="xs">{cert.certificate_number}</Table.Cell>
                                            <Table.Cell>{cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '—'}</Table.Cell>
                                            <Table.Cell>
                                                {cert.pdf_path && (
                                                    <Button size="xs" variant="outline" colorPalette="blue" as="a" href={`/storage/${cert.pdf_path}`} target="_blank">
                                                        Download
                                                    </Button>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No certificates issued yet.</Text>
                    )}
                </Box>
            </VStack>
        </AdminLayout>
    );
}

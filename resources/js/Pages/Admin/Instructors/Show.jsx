import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Text, Flex, SimpleGrid, Badge, HStack, VStack, Icon,
    Table,
} from '@chakra-ui/react';
import { FiEdit, FiUsers, FiBook, FiDollarSign, FiGlobe, FiLinkedin, FiGithub } from 'react-icons/fi';

function StatCard({ label, value, icon, color }) {
    return (
        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                </Box>
                <Flex w={10} h={10} bg={`${color}.50`} borderRadius="lg" align="center" justify="center">
                    <Icon as={icon} boxSize={5} color={`${color}.500`} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default function InstructorsShow({ instructor, stats }) {
    const profile = instructor.instructor_profile ?? {};

    return (
        <AdminLayout title="Instructor Details">
            <Head title={`${instructor.name} - Admin`} />

            <VStack gap={6} align="stretch">
                {/* Header */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Flex justify="space-between" align="flex-start">
                        <Box>
                            <Flex align="center" gap={3} mb={2}>
                                <Text fontSize="2xl" fontWeight="bold">{instructor.name}</Text>
                                <Badge colorPalette={instructor.is_active ? 'green' : 'red'} size="sm">
                                    {instructor.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </Flex>
                            <Text color="gray.600" mb={1}>{instructor.email}</Text>
                            {profile.title && <Text color="gray.500" fontSize="sm">{profile.title}</Text>}
                            {profile.specialization && (
                                <Text color="blue.600" fontSize="sm" mt={1}>{profile.specialization}</Text>
                            )}
                            {profile.bio && (
                                <Text color="gray.600" fontSize="sm" mt={3} maxW="2xl">{profile.bio}</Text>
                            )}
                            <HStack mt={3} gap={4}>
                                {profile.website_url && (
                                    <Flex as="a" href={profile.website_url} target="_blank" align="center" gap={1} color="blue.500" fontSize="sm">
                                        <FiGlobe /> Website
                                    </Flex>
                                )}
                                {profile.linkedin_url && (
                                    <Flex as="a" href={profile.linkedin_url} target="_blank" align="center" gap={1} color="blue.500" fontSize="sm">
                                        <FiLinkedin /> LinkedIn
                                    </Flex>
                                )}
                                {profile.github_username && (
                                    <Flex as="a" href={`https://github.com/${profile.github_username}`} target="_blank" align="center" gap={1} color="gray.700" fontSize="sm">
                                        <FiGithub /> {profile.github_username}
                                    </Flex>
                                )}
                            </HStack>
                        </Box>
                        <HStack gap={2}>
                            <Link href={route('admin.instructors.edit', instructor.id)}>
                                <Button size="sm" colorPalette="blue" variant="outline">
                                    <FiEdit /> Edit
                                </Button>
                            </Link>
                            <Link href={route('admin.instructors.index')}>
                                <Button size="sm" variant="outline">Back</Button>
                            </Link>
                        </HStack>
                    </Flex>
                </Box>

                {/* Stats */}
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <StatCard label="Total Cohorts" value={stats?.cohorts_count ?? 0} icon={FiBook} color="blue" />
                    <StatCard label="Total Students" value={stats?.students_count ?? 0} icon={FiUsers} color="green" />
                    <StatCard label="Total Revenue" value={`₹${(stats?.total_revenue ?? 0).toLocaleString()}`} icon={FiDollarSign} color="purple" />
                </SimpleGrid>

                {/* Cohorts */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>Cohorts</Text>
                    {instructor.cohorts && instructor.cohorts.length > 0 ? (
                        <Box overflowX="auto">
                            <Table.Root size="sm" variant="outline">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                                        <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                                        <Table.ColumnHeader>End Date</Table.ColumnHeader>
                                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                                        <Table.ColumnHeader>Students</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {instructor.cohorts.map((cohort) => (
                                        <Table.Row key={cohort.id}>
                                            <Table.Cell fontWeight="medium">{cohort.name}</Table.Cell>
                                            <Table.Cell>{cohort.start_date}</Table.Cell>
                                            <Table.Cell>{cohort.end_date ?? '—'}</Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={cohort.status === 'active' ? 'green' : 'gray'} size="sm">
                                                    {cohort.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>{cohort.students_count ?? 0}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No cohorts assigned yet.</Text>
                    )}
                </Box>
            </VStack>
        </AdminLayout>
    );
}

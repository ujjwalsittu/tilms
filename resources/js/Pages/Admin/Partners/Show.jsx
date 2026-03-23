import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Text, Flex, HStack, VStack, Badge,
    Table, SimpleGrid, Field, NativeSelect, Input,
} from '@chakra-ui/react';
import { FiCopy, FiCheck, FiUsers, FiLayers, FiUpload } from 'react-icons/fi';
import { useState, useRef } from 'react';

function StatCard({ label, value, icon, color }) {
    return (
        <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={5}>
            <Flex justify="space-between" align="flex-start">
                <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="semibold" mb={1}>
                        {label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>{value}</Text>
                </Box>
                <Flex
                    w={10}
                    h={10}
                    bg={`${color}.50`}
                    borderRadius="lg"
                    align="center"
                    justify="center"
                    flexShrink={0}
                >
                    {icon}
                </Flex>
            </Flex>
        </Box>
    );
}

export default function PartnersShow({ partner, enrollments = [], stats = {}, cohorts = [] }) {
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cohort_id: '',
        csv_file: null,
    });

    const fileInputRef = useRef(null);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(partner.affiliate_code ?? '').then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleCsvSubmit = (e) => {
        e.preventDefault();
        post(route('admin.partners.bulk-enroll', partner.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <AdminLayout title="Partner Details">
            <Head title={`${partner.name} - Partners`} />
            <FlashMessage />

            <VStack gap={6} align="stretch">
                {/* Partner Info Card */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Flex justify="space-between" align="flex-start">
                        <Box flex={1} mr={4}>
                            <Flex align="center" gap={3} mb={2}>
                                <Text fontSize="2xl" fontWeight="bold">{partner.name}</Text>
                                <Badge colorPalette={partner.is_active ? 'green' : 'red'} size="sm">
                                    {partner.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </Flex>

                            <VStack gap={1} align="start" mb={4}>
                                {partner.contact_name && (
                                    <Text fontSize="sm" color="gray.600">Contact: {partner.contact_name}</Text>
                                )}
                                {partner.contact_email && (
                                    <Text fontSize="sm" color="gray.500">{partner.contact_email}</Text>
                                )}
                                {partner.phone && (
                                    <Text fontSize="sm" color="gray.500">{partner.phone}</Text>
                                )}
                            </VStack>

                            <HStack gap={4} flexWrap="wrap">
                                {partner.discount_percent != null && (
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" mb={0.5}>Student Discount</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                                            {partner.discount_percent}%
                                        </Text>
                                    </Box>
                                )}
                                {partner.revenue_share_percent != null && (
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" mb={0.5}>Revenue Share</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="green.600">
                                            {partner.revenue_share_percent}%
                                        </Text>
                                    </Box>
                                )}
                            </HStack>
                        </Box>

                        <Link href={route('admin.partners.index')}>
                            <Button size="sm" variant="outline">Back to List</Button>
                        </Link>
                    </Flex>

                    {/* Affiliate Code */}
                    {partner.affiliate_code && (
                        <Box mt={5} pt={5} borderTopWidth="1px" borderColor="gray.100">
                            <Text fontSize="xs" color="gray.400" mb={2} fontWeight="semibold" textTransform="uppercase">
                                Affiliate Code
                            </Text>
                            <HStack gap={3}>
                                <Box bg="gray.50" borderRadius="md" px={4} py={2} borderWidth="1px" borderColor="gray.200">
                                    <Text fontFamily="mono" fontWeight="bold" letterSpacing="wider" fontSize="lg">
                                        {partner.affiliate_code}
                                    </Text>
                                </Box>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    colorPalette="gray"
                                    onClick={handleCopyCode}
                                >
                                    {copied ? <FiCheck /> : <FiCopy />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </HStack>
                        </Box>
                    )}
                </Box>

                {/* Stats */}
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                    <StatCard
                        label="Total Students"
                        value={stats.total_students ?? enrollments.length}
                        icon={<FiUsers size={18} color="#3182CE" />}
                        color="blue"
                    />
                    <StatCard
                        label="Active Cohorts"
                        value={stats.active_cohorts ?? 0}
                        icon={<FiLayers size={18} color="#38A169" />}
                        color="green"
                    />
                </SimpleGrid>

                {/* Bulk CSV Enrollment */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={1}>Bulk Enroll Students</Text>
                    <Text fontSize="sm" color="gray.500" mb={4}>
                        Upload a CSV file with student emails to bulk-enroll them into a cohort.
                    </Text>

                    <form onSubmit={handleCsvSubmit}>
                        <VStack gap={4} align="stretch">
                            <Field.Root invalid={!!errors.cohort_id}>
                                <Field.Label>Select Cohort</Field.Label>
                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={data.cohort_id}
                                        onChange={(e) => setData('cohort_id', e.target.value)}
                                    >
                                        <option value="">— Choose a cohort —</option>
                                        {cohorts.map((cohort) => (
                                            <option key={cohort.id} value={cohort.id}>
                                                {cohort.title ?? cohort.name}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                                {errors.cohort_id && <Field.ErrorText>{errors.cohort_id}</Field.ErrorText>}
                            </Field.Root>

                            <Field.Root invalid={!!errors.csv_file}>
                                <Field.Label>CSV File (column: email)</Field.Label>
                                <Input
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={(e) => setData('csv_file', e.target.files[0] ?? null)}
                                    pt={1}
                                />
                                {errors.csv_file && <Field.ErrorText>{errors.csv_file}</Field.ErrorText>}
                            </Field.Root>

                            <Box>
                                <Button type="submit" colorPalette="blue" size="sm" loading={processing}>
                                    <FiUpload />
                                    Upload &amp; Enroll
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                </Box>

                {/* Enrolled Students Table */}
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                    <Text fontWeight="semibold" fontSize="lg" mb={4}>
                        Enrolled Students ({enrollments.length})
                    </Text>

                    {enrollments.length === 0 ? (
                        <Box bg="gray.50" borderRadius="md" p={6} textAlign="center">
                            <Text color="gray.500" fontSize="sm">No students enrolled via this partner yet.</Text>
                        </Box>
                    ) : (
                        <Box overflowX="auto">
                            <Table.Root size="sm" variant="outline">
                                <Table.Header>
                                    <Table.Row bg="gray.50">
                                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                                        <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                        <Table.ColumnHeader>Enrolled At</Table.ColumnHeader>
                                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {enrollments.map((enrollment) => (
                                        <Table.Row key={enrollment.id} _hover={{ bg: 'gray.50' }}>
                                            <Table.Cell fontWeight="medium">
                                                {enrollment.student?.name ?? enrollment.user?.name ?? '—'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="sm" color="gray.500">
                                                    {enrollment.student?.email ?? enrollment.user?.email ?? '—'}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {enrollment.cohort?.title ?? enrollment.cohort?.name ?? '—'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="sm" color="gray.500">
                                                    {enrollment.created_at
                                                        ? new Date(enrollment.created_at).toLocaleDateString()
                                                        : '—'}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge
                                                    colorPalette={enrollment.status === 'active' ? 'green' : 'gray'}
                                                    size="sm"
                                                >
                                                    {enrollment.status ?? 'enrolled'}
                                                </Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    )}
                </Box>
            </VStack>
        </AdminLayout>
    );
}

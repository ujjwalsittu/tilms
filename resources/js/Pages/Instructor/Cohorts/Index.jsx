import { Head, Link, router } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    Table,
    Text,
    Badge,
    HStack,
    VStack,
} from '@chakra-ui/react';

const sel = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px', background: 'white', maxWidth: '200px' };
import { FiPlus, FiEye, FiEdit2, FiCopy, FiXCircle, FiSearch } from 'react-icons/fi';

export default function Index({ cohorts }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const handleFilter = () => {
        router.get(route('instructor.cohorts.index'), { search, status }, { preserveState: true });
    };

    const handleClone = (id) => {
        if (confirm('Clone this cohort?')) {
            router.post(route('instructor.cohorts.clone', id));
        }
    };

    const handleClose = (id) => {
        if (confirm('Close this cohort? Enrolled students will be notified.')) {
            router.patch(route('instructor.cohorts.close', id));
        }
    };

    const typeColor = { internship: 'purple', learning: 'blue' };

    return (
        <InstructorLayout title="My Cohorts">
            <Head title="My Cohorts" />
            <FlashMessage />

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">My Cohorts</Text>
                <Link href={route('instructor.cohorts.create')}>
                    <Button colorPalette="blue"><FiPlus size={14} /> Create Cohort</Button>
                </Link>
            </Flex>

            {/* Filters */}
            <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <HStack gap={3} flexWrap="wrap">
                    <Input
                        placeholder="Search cohorts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        maxW="300px"
                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                    />
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        maxW="200px"
                    >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="registration_open">Registration Open</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                    </Select>
                    <Button onClick={handleFilter} leftIcon={<FiSearch />} colorScheme="blue" variant="outline">
                        Search
                    </Button>
                </HStack>
            </Box>

            {/* Table */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                <Box overflowX="auto">
                    <Table.Root variant="line">
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader>Title</Table.ColumnHeader>
                                <Table.ColumnHeader>Type</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Students</Table.ColumnHeader>
                                <Table.ColumnHeader>Price</Table.ColumnHeader>
                                <Table.ColumnHeader>Created</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {cohorts.data?.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={7} textAlign="center" py={8} color="gray.500">
                                        No cohorts found. Create your first cohort!
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {cohorts.data?.map((cohort) => (
                                <Table.Row key={cohort.id} _hover={{ bg: 'gray.50' }}>
                                    <Table.Cell>
                                        <Text fontWeight="medium">{cohort.title}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge colorScheme={typeColor[cohort.type] ?? 'gray'}>
                                            {cohort.type}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <StatusBadge status={cohort.status} />
                                    </Table.Cell>
                                    <Table.Cell>{cohort.enrollments_count ?? 0}</Table.Cell>
                                    <Table.Cell>
                                        {cohort.price_amount
                                            ? `${cohort.price_currency ?? 'INR'} ${Number(cohort.price_amount).toLocaleString()}`
                                            : 'Free'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {new Date(cohort.created_at).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack gap={1}>
                                            <Link href={route('instructor.cohorts.show', cohort.id)}>
                                                <Button size="sm" variant="ghost" colorScheme="blue" aria-label="View">
                                                    <FiEye />
                                                </Button>
                                            </Link>
                                            <Link href={route('instructor.cohorts.edit', cohort.id)}>
                                                <Button size="sm" variant="ghost" colorScheme="gray" aria-label="Edit">
                                                    <FiEdit2 />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="teal"
                                                aria-label="Clone"
                                                onClick={() => handleClone(cohort.id)}
                                            >
                                                <FiCopy />
                                            </Button>
                                            {cohort.status !== 'closed' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    aria-label="Close"
                                                    onClick={() => handleClose(cohort.id)}
                                                >
                                                    <FiXCircle />
                                                </Button>
                                            )}
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
                <Box p={4} borderTopWidth="1px">
                    <Pagination links={cohorts.links} meta={cohorts.meta} />
                </Box>
            </Box>
        </InstructorLayout>
    );
}

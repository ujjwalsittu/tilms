import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Text, Flex, HStack, VStack, Badge, Table,
} from '@chakra-ui/react';
import { FiTag, FiPercent, FiBook } from 'react-icons/fi';

function CouponStatusBadge({ coupon }) {
    const now = new Date();
    const until = coupon.valid_until ? new Date(coupon.valid_until) : null;
    const from = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const used = Number(coupon.times_used ?? 0);
    const max = coupon.max_uses !== null ? Number(coupon.max_uses) : null;

    if (!coupon.is_active) return <Badge colorPalette="gray" size="sm">Inactive</Badge>;
    if (until && now > until) return <Badge colorPalette="orange" size="sm">Expired</Badge>;
    if (from && now < from) return <Badge colorPalette="yellow" size="sm">Scheduled</Badge>;
    if (max !== null && used >= max) return <Badge colorPalette="red" size="sm">Exhausted</Badge>;
    return <Badge colorPalette="green" size="sm">Active</Badge>;
}

function formatValue(coupon) {
    if (coupon.type === 'percentage') return `${coupon.value}%`;
    return `₹${Number(coupon.value).toLocaleString()}`;
}

function formatDate(dt) {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CouponsIndex({ coupons = [] }) {
    const activeCoupons = coupons.filter(c => c.is_active && !(c.valid_until && new Date(c.valid_until) < new Date())).length;

    return (
        <AdminLayout title="Coupons">
            <Head title="Coupons - Admin" />
            <FlashMessage />

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Discount Coupons</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Platform-wide view of all coupons across all cohorts. Coupons are managed per-cohort by instructors.
                    </Text>
                </Box>
                <HStack gap={3}>
                    <Badge colorPalette="green" size="lg" px={3} py={1} borderRadius="full">
                        {activeCoupons} active
                    </Badge>
                    <Badge colorPalette="gray" size="lg" px={3} py={1} borderRadius="full">
                        {coupons.length} total
                    </Badge>
                </HStack>
            </Flex>

            {coupons.length === 0 ? (
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={12} textAlign="center">
                    <Flex w={14} h={14} bg="purple.50" borderRadius="full" align="center" justify="center" mx="auto" mb={3}>
                        <FiTag size={24} color="#6B46C1" />
                    </Flex>
                    <Text fontWeight="medium" mb={1} color="gray.600">No coupons created yet</Text>
                    <Text fontSize="sm" color="gray.400" mb={4}>
                        Instructors create coupons from their cohort management pages.
                    </Text>
                    <Link href={route('admin.instructors.index')}>
                        <Button size="sm" variant="outline" colorPalette="blue">
                            View Instructors
                        </Button>
                    </Link>
                </Box>
            ) : (
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" overflow="hidden">
                    <Box overflowX="auto">
                        <Table.Root size="sm" variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Code</Table.ColumnHeader>
                                    <Table.ColumnHeader>Cohort</Table.ColumnHeader>
                                    <Table.ColumnHeader>Created By</Table.ColumnHeader>
                                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                                    <Table.ColumnHeader>Value</Table.ColumnHeader>
                                    <Table.ColumnHeader>Usage</Table.ColumnHeader>
                                    <Table.ColumnHeader>Valid Period</Table.ColumnHeader>
                                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {coupons.map((coupon) => (
                                    <Table.Row key={coupon.id} _hover={{ bg: 'gray.50' }}>
                                        <Table.Cell>
                                            <Text fontFamily="mono" fontWeight="bold" fontSize="sm" letterSpacing="wide">
                                                {coupon.code}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {coupon.cohort ? (
                                                <HStack gap={1}>
                                                    <FiBook size={13} color="#6B7280" />
                                                    <Text fontSize="sm" color="gray.700">{coupon.cohort.title}</Text>
                                                </HStack>
                                            ) : (
                                                <Text fontSize="sm" color="gray.400">—</Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm" color="gray.600">
                                                {coupon.creator?.name ?? '—'}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={1}>
                                                {coupon.type === 'percentage'
                                                    ? <FiPercent size={13} color="#6B46C1" />
                                                    : <Text fontSize="xs" color="#276749" fontWeight="bold">₹</Text>
                                                }
                                                <Text fontSize="sm" textTransform="capitalize">{coupon.type}</Text>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontWeight="semibold" fontSize="sm" color="purple.600">
                                                {formatValue(coupon)}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontSize="sm">
                                                {Number(coupon.times_used ?? 0).toLocaleString()}
                                                {' / '}
                                                {coupon.max_uses !== null
                                                    ? Number(coupon.max_uses).toLocaleString()
                                                    : '∞'
                                                }
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="xs" color="gray.500">
                                                    {coupon.valid_from ? `From ${formatDate(coupon.valid_from)}` : 'No start limit'}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    {coupon.valid_until ? `Until ${formatDate(coupon.valid_until)}` : 'No end limit'}
                                                </Text>
                                            </VStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <CouponStatusBadge coupon={coupon} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Box>
            )}
        </AdminLayout>
    );
}

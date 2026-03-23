import { Head, Link, router, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    Input,
    SimpleGrid,
    Table,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiTag, FiSlash, FiArrowLeft, FiPercent, FiDollarSign } from 'react-icons/fi';

const statusColor = {
    active: 'green',
    inactive: 'gray',
    expired: 'orange',
    exhausted: 'red',
};

function CouponStatusBadge({ coupon }) {
    const now = new Date();
    const from = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const until = coupon.valid_until ? new Date(coupon.valid_until) : null;
    const uses = Number(coupon.uses_count ?? 0);
    const max = coupon.max_uses !== null ? Number(coupon.max_uses) : null;

    if (!coupon.is_active) return <Badge colorPalette="gray">Inactive</Badge>;
    if (until && now > until) return <Badge colorPalette="orange">Expired</Badge>;
    if (from && now < from) return <Badge colorPalette="yellow">Scheduled</Badge>;
    if (max !== null && uses >= max) return <Badge colorPalette="red">Exhausted</Badge>;
    return <Badge colorPalette="green">Active</Badge>;
}

const defaultForm = {
    code: '',
    type: 'percentage',
    value: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
};

export default function Coupons({ cohort, coupons = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(defaultForm);

    const setField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setFormError(prev => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const errors = {};
        if (!form.code.trim()) errors.code = 'Coupon code is required.';
        if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) {
            errors.value = 'Enter a valid positive value.';
        }
        if (form.type === 'percentage' && Number(form.value) > 100) {
            errors.value = 'Percentage cannot exceed 100.';
        }
        if (form.max_uses && (isNaN(Number(form.max_uses)) || Number(form.max_uses) < 1)) {
            errors.max_uses = 'Enter a valid number of uses.';
        }
        if (form.valid_from && form.valid_until && form.valid_from > form.valid_until) {
            errors.valid_until = 'End date must be after start date.';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }
        setSubmitting(true);
        router.post(
            route('instructor.cohorts.coupons.store', cohort.id),
            {
                code: form.code.trim().toUpperCase(),
                type: form.type,
                value: form.value,
                max_uses: form.max_uses || null,
                valid_from: form.valid_from || null,
                valid_until: form.valid_until || null,
            },
            {
                onSuccess: () => {
                    setForm(defaultForm);
                    setShowForm(false);
                    setFormError({});
                },
                onError: (errs) => setFormError(errs),
                onFinish: () => setSubmitting(false),
            }
        );
    };

    const handleDeactivate = (couponId) => {
        if (!confirm('Deactivate this coupon? Existing uses will not be affected.')) return;
        router.patch(route('instructor.cohorts.coupons.deactivate', couponId));
    };

    const handleDelete = (couponId) => {
        if (!confirm('Delete this coupon permanently?')) return;
        router.delete(route('instructor.cohorts.coupons.destroy', couponId));
    };

    const formatValue = (coupon) => {
        if (coupon.type === 'percentage') return `${coupon.value}%`;
        return `₹${Number(coupon.value).toLocaleString()}`;
    };

    return (
        <InstructorLayout title="Manage Coupons">
            <Head title={`Coupons — ${cohort.title}`} />
            <FlashMessage />

            {/* Breadcrumb */}
            <HStack gap={2} mb={4} fontSize="sm" color="gray.500">
                <Link href={route('instructor.cohorts.index')}>
                    <Text _hover={{ color: 'blue.600' }}>Cohorts</Text>
                </Link>
                <Text>/</Text>
                <Link href={route('instructor.cohorts.show', cohort.id)}>
                    <Text _hover={{ color: 'blue.600' }}>{cohort.title}</Text>
                </Link>
                <Text>/</Text>
                <Text color="gray.700" fontWeight="medium">Coupons</Text>
            </HStack>

            {/* Page header */}
            <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Coupon Management</Text>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        Create and manage discount coupons for <strong>{cohort.title}</strong>
                    </Text>
                </Box>
                <Button
                    colorPalette="blue"
                    onClick={() => setShowForm(v => !v)}
                >
                    <FiPlus size={14} /> {showForm ? 'Cancel' : 'New Coupon'}
                </Button>
            </Flex>

            {/* Create form */}
            {showForm && (
                <Box
                    as="form"
                    onSubmit={handleSubmit}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="blue.200"
                    p={6}
                    mb={6}
                >
                    <Text fontWeight="semibold" mb={4} fontSize="md">Create New Coupon</Text>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4} mb={4}>
                        {/* Code */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                Coupon Code <Text as="span" color="red.500">*</Text>
                            </Text>
                            <Input
                                value={form.code}
                                onChange={e => setField('code', e.target.value.toUpperCase())}
                                placeholder="e.g. LAUNCH20"
                                textTransform="uppercase"
                                fontFamily="mono"
                                borderColor={formError.code ? 'red.400' : undefined}
                            />
                            {formError.code && (
                                <Text fontSize="xs" color="red.500" mt={1}>{formError.code}</Text>
                            )}
                        </Box>

                        {/* Type */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                Discount Type <Text as="span" color="red.500">*</Text>
                            </Text>
                            <select
                                value={form.type}
                                onChange={e => setField('type', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px', background: 'white' }}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </Box>

                        {/* Value */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                Value <Text as="span" color="red.500">*</Text>
                            </Text>
                            <HStack gap={0} borderWidth="1px" borderRadius="md" borderColor={formError.value ? 'red.400' : 'gray.200'} overflow="hidden">
                                <Flex
                                    px={3}
                                    h="40px"
                                    bg="gray.50"
                                    align="center"
                                    borderRightWidth="1px"
                                    borderColor="gray.200"
                                    flexShrink={0}
                                >
                                    {form.type === 'percentage'
                                        ? <FiPercent size={14} color="gray" />
                                        : <Text fontSize="sm" color="gray.500">₹</Text>
                                    }
                                </Flex>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.value}
                                    onChange={e => setField('value', e.target.value)}
                                    placeholder={form.type === 'percentage' ? '10' : '500'}
                                    style={{
                                        flex: 1,
                                        padding: '0 12px',
                                        height: '40px',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px',
                                        background: 'transparent',
                                    }}
                                />
                            </HStack>
                            {formError.value && (
                                <Text fontSize="xs" color="red.500" mt={1}>{formError.value}</Text>
                            )}
                        </Box>

                        {/* Max uses */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                Max Uses
                                <Text as="span" color="gray.400" fontWeight="normal"> (leave blank for unlimited)</Text>
                            </Text>
                            <Input
                                type="number"
                                min="1"
                                value={form.max_uses}
                                onChange={e => setField('max_uses', e.target.value)}
                                placeholder="Unlimited"
                                borderColor={formError.max_uses ? 'red.400' : undefined}
                            />
                            {formError.max_uses && (
                                <Text fontSize="xs" color="red.500" mt={1}>{formError.max_uses}</Text>
                            )}
                        </Box>

                        {/* Valid from */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Valid From</Text>
                            <Input
                                type="datetime-local"
                                value={form.valid_from}
                                onChange={e => setField('valid_from', e.target.value)}
                            />
                        </Box>

                        {/* Valid until */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Valid Until</Text>
                            <Input
                                type="datetime-local"
                                value={form.valid_until}
                                onChange={e => setField('valid_until', e.target.value)}
                                borderColor={formError.valid_until ? 'red.400' : undefined}
                            />
                            {formError.valid_until && (
                                <Text fontSize="xs" color="red.500" mt={1}>{formError.valid_until}</Text>
                            )}
                        </Box>
                    </SimpleGrid>

                    <Flex justify="flex-end" gap={3}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowForm(false);
                                setForm(defaultForm);
                                setFormError({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                                type="submit"
                            colorPalette="blue"
                            loading={submitting}
                            loadingText="Creating…"
                        >
                            <FiTag size={14} /> Create Coupon
                        </Button>
                    </Flex>
                </Box>
            )}

            {/* Coupons table */}
            <Box
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.200"
                overflow="hidden"
            >
                <Box px={6} py={4} borderBottomWidth="1px" borderColor="gray.100">
                    <Flex align="center" justify="space-between">
                        <Text fontWeight="semibold">
                            Coupons
                        </Text>
                        {coupons.length > 0 && (
                            <Badge colorPalette="blue" variant="subtle">{coupons.length} total</Badge>
                        )}
                    </Flex>
                </Box>

                {coupons.length === 0 ? (
                    <Box py={14} textAlign="center">
                        <Flex w={14} h={14} bg="blue.50" borderRadius="full" align="center" justify="center" mx="auto" mb={3}>
                            <FiTag size={24} color="#3182CE" />
                        </Flex>
                        <Text fontWeight="medium" mb={1}>No coupons yet</Text>
                        <Text fontSize="sm" color="gray.500" mb={4}>
                            Create your first coupon to offer discounts on this cohort.
                        </Text>
                        <Button
                            size="sm"
                            colorPalette="blue"
                            onClick={() => setShowForm(true)}
                        >
                            <FiPlus size={14} /> Create Coupon
                        </Button>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table.Root variant="line">
                            <Table.Header>
                                <Table.Row bg="gray.50">
                                    <Table.ColumnHeader>Code</Table.ColumnHeader>
                                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                                    <Table.ColumnHeader>Value</Table.ColumnHeader>
                                    <Table.ColumnHeader>Uses / Max</Table.ColumnHeader>
                                    <Table.ColumnHeader>Valid Period</Table.ColumnHeader>
                                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {coupons.map((coupon) => (
                                    <Table.Row key={coupon.id} _hover={{ bg: 'gray.50' }}>
                                        {/* Code */}
                                        <Table.Cell>
                                            <Text fontFamily="mono" fontWeight="bold" fontSize="sm" letterSpacing="wide">
                                                {coupon.code}
                                            </Text>
                                        </Table.Cell>

                                        {/* Type */}
                                        <Table.Cell>
                                            <HStack gap={1}>
                                                {coupon.type === 'percentage'
                                                    ? <FiPercent size={13} color="#6B46C1" />
                                                    : <Text fontSize="xs" color="#276749" fontWeight="bold">₹</Text>
                                                }
                                                <Text fontSize="sm" textTransform="capitalize">
                                                    {coupon.type}
                                                </Text>
                                            </HStack>
                                        </Table.Cell>

                                        {/* Value */}
                                        <Table.Cell>
                                            <Text fontWeight="semibold" fontSize="sm" color="purple.600">
                                                {formatValue(coupon)}
                                            </Text>
                                        </Table.Cell>

                                        {/* Uses / Max */}
                                        <Table.Cell>
                                            <Text fontSize="sm">
                                                {Number(coupon.uses_count ?? 0).toLocaleString()}
                                                {' / '}
                                                {coupon.max_uses !== null
                                                    ? Number(coupon.max_uses).toLocaleString()
                                                    : <Text as="span" color="gray.400">∞</Text>
                                                }
                                            </Text>
                                        </Table.Cell>

                                        {/* Valid period */}
                                        <Table.Cell>
                                            <VStack align="start" gap={0}>
                                                {coupon.valid_from ? (
                                                    <Text fontSize="xs" color="gray.500">
                                                        From {new Date(coupon.valid_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </Text>
                                                ) : (
                                                    <Text fontSize="xs" color="gray.400">No start limit</Text>
                                                )}
                                                {coupon.valid_until ? (
                                                    <Text fontSize="xs" color="gray.500">
                                                        Until {new Date(coupon.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </Text>
                                                ) : (
                                                    <Text fontSize="xs" color="gray.400">No end limit</Text>
                                                )}
                                            </VStack>
                                        </Table.Cell>

                                        {/* Status */}
                                        <Table.Cell>
                                            <CouponStatusBadge coupon={coupon} />
                                        </Table.Cell>

                                        {/* Actions */}
                                        <Table.Cell>
                                            <HStack gap={1}>
                                                {coupon.is_active && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorPalette="orange"
                                                        onClick={() => handleDeactivate(coupon.id)}
                                                        title="Deactivate coupon"
                                                        aria-label="Deactivate"
                                                    >
                                                        <FiSlash />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    colorPalette="red"
                                                    onClick={() => handleDelete(coupon.id)}
                                                    title="Delete coupon"
                                                    aria-label="Delete"
                                                    disabled={Number(coupon.uses_count ?? 0) > 0}
                                                >
                                                    <Text fontSize="sm">✕</Text>
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                )}
            </Box>

            {/* Back link */}
            <Box mt={6}>
                <Link href={route('instructor.cohorts.show', cohort.id)}>
                    <HStack gap={2} color="gray.500" _hover={{ color: 'blue.600' }} fontSize="sm">
                        <FiArrowLeft size={14} />
                        <Text>Back to {cohort.title}</Text>
                    </HStack>
                </Link>
            </Box>
        </InstructorLayout>
    );
}

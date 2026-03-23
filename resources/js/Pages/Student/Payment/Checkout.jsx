import { Head, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Button,
    Text,
    VStack,
    HStack,
    Input,
    Heading,
    Badge,
    Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiLock, FiTag } from 'react-icons/fi';

export default function Checkout({ cohort, razorpayKeyId, environment }) {
    const [couponCode, setCouponCode] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [discountInfo, setDiscountInfo] = useState(null);
    const [couponApplied, setCouponApplied] = useState(false);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setError('');
        try {
            const response = await fetch(route('student.checkout.create-order', cohort.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ coupon_code: couponCode, cohort_id: cohort.id }),
            });
            const data = await response.json();
            if (data.valid) {
                setDiscountInfo(data);
                setCouponApplied(true);
            } else {
                setError(data.message ?? 'Invalid coupon code.');
                setDiscountInfo(null);
                setCouponApplied(false);
            }
        } catch {
            setError('Could not validate coupon. Please try again.');
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(route('student.checkout.create-order', cohort.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    coupon_code: couponCode,
                    referral_code: referralCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? 'Failed to create order. Please try again.');
                setLoading(false);
                return;
            }

            if (data.order_id) {
                const options = {
                    key: razorpayKeyId,
                    amount: data.amount,
                    currency: data.currency ?? 'INR',
                    name: 'TILMS',
                    description: `Enrollment: ${cohort.title}`,
                    order_id: data.order_id,
                    handler: function (response) {
                        router.post(route('student.checkout.verify'), {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                    },
                    modal: {
                        ondismiss: () => setLoading(false),
                    },
                    prefill: {},
                    theme: { color: '#6B46C1' },
                };

                if (!window.Razorpay) {
                    setError('Razorpay SDK not loaded. Please refresh the page.');
                    setLoading(false);
                    return;
                }

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function () {
                    setError('Payment failed. Please try again.');
                    setLoading(false);
                });
                rzp.open();
            } else {
                setError(data.message ?? 'Failed to initiate payment. Please try again.');
                setLoading(false);
            }
        } catch {
            setError('Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    const baseAmount = Number(cohort.price_amount ?? 0);
    const discountAmount = discountInfo?.discount_amount ?? 0;
    const finalAmount = Math.max(0, baseAmount - discountAmount);
    const currency = cohort.price_currency ?? 'INR';

    return (
        <StudentLayout title="Checkout">
            <Head title={`Checkout - ${cohort.title}`} />
            <FlashMessage />

            <Box maxW="lg" mx="auto">
                <Heading size="lg" mb={6}>Complete Your Enrollment</Heading>

                {/* Cohort Summary */}
                <Box
                    bg="white"
                    p={6}
                    borderRadius="lg"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                    mb={6}
                >
                    <Text fontWeight="semibold" fontSize="lg" mb={2}>{cohort.title}</Text>
                    <HStack gap={2} mb={3}>
                        <Badge colorPalette={cohort.type === 'internship' ? 'purple' : 'blue'}>
                            {cohort.type}
                        </Badge>
                        {environment === 'test' && (
                            <Badge colorPalette="yellow">Test Mode</Badge>
                        )}
                    </HStack>
                    {cohort.description && (
                        <Text fontSize="sm" color="gray.500" mb={4}>
                            {cohort.description.substring(0, 200)}
                            {cohort.description.length > 200 ? '…' : ''}
                        </Text>
                    )}

                    <Box borderTopWidth="1px" borderColor="gray.100" pt={4} mt={2}>
                        <Flex justify="space-between" align="center" mb={1}>
                            <Text fontSize="sm" color="gray.500">Base price</Text>
                            <Text fontSize="sm">
                                {currency} {baseAmount.toLocaleString()}
                            </Text>
                        </Flex>
                        {discountAmount > 0 && (
                            <Flex justify="space-between" align="center" mb={1}>
                                <Text fontSize="sm" color="green.600">
                                    Discount ({discountInfo?.coupon_code})
                                </Text>
                                <Text fontSize="sm" color="green.600">
                                    − {currency} {discountAmount.toLocaleString()}
                                </Text>
                            </Flex>
                        )}
                        <Flex justify="space-between" align="center" pt={2} borderTopWidth="1px" borderColor="gray.100" mt={2}>
                            <Text fontWeight="bold" fontSize="lg">Total</Text>
                            <Text fontWeight="bold" fontSize="xl" color="purple.600">
                                {currency} {finalAmount.toLocaleString()}
                            </Text>
                        </Flex>
                    </Box>
                </Box>

                {/* Coupon & Referral */}
                <Box
                    bg="white"
                    p={6}
                    borderRadius="lg"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                    mb={6}
                >
                    <VStack gap={5} align="stretch">
                        {/* Coupon */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                Discount Coupon
                                <Text as="span" color="gray.400" fontWeight="normal"> (optional)</Text>
                            </Text>
                            <HStack gap={2}>
                                <Input
                                    value={couponCode}
                                    onChange={e => {
                                        setCouponCode(e.target.value);
                                        setCouponApplied(false);
                                        setDiscountInfo(null);
                                    }}
                                    placeholder="Enter coupon code"
                                    textTransform="uppercase"
                                    disabled={couponApplied}
                                />
                                <Button
                                    onClick={applyCoupon}
                                    variant="outline"
                                    colorPalette={couponApplied ? 'green' : 'purple'}
                                    flexShrink={0}
                                    disabled={!couponCode.trim() || couponApplied}
                                >
                                    {couponApplied ? 'Applied' : 'Apply'}
                                </Button>
                            </HStack>
                            {couponApplied && discountInfo && (
                                <HStack gap={1} mt={1}>
                                    <FiTag size={12} color="green" />
                                    <Text fontSize="xs" color="green.600">
                                        Coupon applied: {discountInfo.label ?? `${currency} ${discountAmount.toLocaleString()} off`}
                                    </Text>
                                </HStack>
                            )}
                        </Box>

                        {/* Referral */}
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                Referral Code
                                <Text as="span" color="gray.400" fontWeight="normal"> (optional)</Text>
                            </Text>
                            <Input
                                value={referralCode}
                                onChange={e => setReferralCode(e.target.value)}
                                placeholder="Enter referral code"
                                textTransform="uppercase"
                            />
                        </Box>
                    </VStack>
                </Box>

                {/* Error */}
                {error && (
                    <Box bg="red.50" p={3} borderRadius="md" borderWidth="1px" borderColor="red.200" mb={4}>
                        <Text color="red.600" fontSize="sm">{error}</Text>
                    </Box>
                )}

                {/* Pay Button */}
                <Button
                    colorPalette="purple"
                    size="lg"
                    w="full"
                    onClick={handlePayment}
                    loading={loading}
                    loadingText="Initiating payment…"
                >
                    Pay {currency} {finalAmount.toLocaleString()} &amp; Enroll
                </Button>

                <HStack justify="center" gap={1} mt={3}>
                    <FiLock size={12} color="gray" />
                    <Text fontSize="xs" color="gray.500">
                        Payments are processed securely via Razorpay
                    </Text>
                </HStack>
            </Box>
        </StudentLayout>
    );
}

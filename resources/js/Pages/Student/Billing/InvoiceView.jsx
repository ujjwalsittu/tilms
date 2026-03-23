import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Badge,
    Button,
    Flex,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FiPrinter, FiDownload } from 'react-icons/fi';

const statusColor = {
    paid: 'green',
    pending: 'yellow',
    failed: 'red',
    refunded: 'orange',
    cancelled: 'gray',
};

function InvoiceRow({ label, value, bold, color }) {
    return (
        <Flex justify="space-between" align="center" py={2}>
            <Text fontSize="sm" color="gray.500">{label}</Text>
            <Text
                fontSize="sm"
                fontWeight={bold ? 'bold' : 'medium'}
                color={color ?? 'gray.800'}
            >
                {value}
            </Text>
        </Flex>
    );
}

export default function InvoiceView({ invoice }) {
    const payment = invoice?.payment ?? {};
    const cohort = payment?.cohort ?? {};
    const user = payment?.user ?? {};

    const currency = payment.currency ?? 'INR';
    const grossAmount = Number(payment.gross_amount ?? payment.amount ?? 0);
    const discountAmount = Number(payment.discount_amount ?? 0);
    const totalAmount = Number(payment.amount ?? 0);

    const invoiceDate = invoice?.issued_at
        ? new Date(invoice.issued_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : new Date(payment.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          });

    const handlePrint = () => {
        window.print();
    };

    return (
        <StudentLayout title="Invoice">
            <Head title={`Invoice ${invoice?.invoice_number ?? ''}`} />

            {/* Print / Download actions — hidden when printing */}
            <Flex justify="flex-end" gap={3} mb={6} className="no-print">
                <a
                    href={route('student.billing.invoice.download', invoice?.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline" colorPalette="purple" size="sm">
                        <FiDownload size={13} /> Download PDF
                    </Button>
                </a>
                <Button colorPalette="purple" size="sm" onClick={handlePrint}>
                    <FiPrinter size={13} /> Print
                </Button>
            </Flex>

            {/* Invoice card */}
            <Box
                id="invoice-print-area"
                bg="white"
                maxW="700px"
                mx="auto"
                borderRadius="xl"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                overflow="hidden"
            >
                {/* Header band */}
                <Box bg="purple.700" px={8} py={6} color="white">
                    <Flex justify="space-between" align="flex-start">
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" letterSpacing="wide">TILMS</Text>
                            <Text fontSize="xs" color="purple.200" mt={0.5}>
                                Technology Integrated Learning & Mentorship System
                            </Text>
                        </Box>
                        <Box textAlign="right">
                            <Text fontSize="lg" fontWeight="bold">INVOICE</Text>
                            <Text fontSize="sm" color="purple.200" mt={0.5}>
                                #{invoice?.invoice_number ?? '—'}
                            </Text>
                        </Box>
                    </Flex>
                </Box>

                {/* Body */}
                <Box px={8} py={6}>

                    {/* Meta row */}
                    <Flex justify="space-between" align="flex-start" mb={6} flexWrap="wrap" gap={4}>
                        {/* Student details */}
                        <Box>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" mb={2}>
                                Billed To
                            </Text>
                            <Text fontWeight="semibold" fontSize="md">{user.name ?? '—'}</Text>
                            <Text fontSize="sm" color="gray.500">{user.email ?? '—'}</Text>
                            {user.phone && (
                                <Text fontSize="sm" color="gray.500">{user.phone}</Text>
                            )}
                        </Box>

                        {/* Invoice details */}
                        <Box textAlign="right">
                            <Text fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" mb={2}>
                                Invoice Details
                            </Text>
                            <VStack align="flex-end" gap={0.5}>
                                <HStack gap={2}>
                                    <Text fontSize="sm" color="gray.500">Invoice No:</Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {invoice?.invoice_number ?? '—'}
                                    </Text>
                                </HStack>
                                <HStack gap={2}>
                                    <Text fontSize="sm" color="gray.500">Date:</Text>
                                    <Text fontSize="sm" fontWeight="medium">{invoiceDate}</Text>
                                </HStack>
                                <HStack gap={2}>
                                    <Text fontSize="sm" color="gray.500">Payment ID:</Text>
                                    <Text fontSize="sm" fontWeight="medium" fontFamily="mono" fontSize="xs">
                                        {payment.razorpay_payment_id ?? payment.transaction_id ?? '—'}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </Flex>

                    {/* Line items */}
                    <Box borderRadius="lg" borderWidth="1px" borderColor="gray.200" overflow="hidden" mb={6}>
                        {/* Column headers */}
                        <Flex
                            bg="gray.50"
                            px={4}
                            py={3}
                            borderBottomWidth="1px"
                            borderColor="gray.200"
                        >
                            <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" flex={1}>
                                Description
                            </Text>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" textAlign="right" w="120px">
                                Amount
                            </Text>
                        </Flex>

                        {/* Cohort line */}
                        <Flex px={4} py={4} borderBottomWidth="1px" borderColor="gray.100">
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm">{cohort.title ?? 'Course Enrollment'}</Text>
                                {cohort.type && (
                                    <Badge
                                        colorScheme={cohort.type === 'internship' ? 'purple' : 'blue'}
                                        variant="subtle"
                                        mt={1}
                                        fontSize="xs"
                                    >
                                        {cohort.type}
                                    </Badge>
                                )}
                            </Box>
                            <Text fontSize="sm" textAlign="right" w="120px">
                                {currency} {grossAmount.toLocaleString()}
                            </Text>
                        </Flex>

                        {/* Discount line */}
                        {discountAmount > 0 && (
                            <Flex px={4} py={3} borderBottomWidth="1px" borderColor="gray.100">
                                <Box flex={1}>
                                    <Text fontSize="sm" color="green.600">
                                        Discount
                                        {payment.coupon_code ? ` (${payment.coupon_code})` : ''}
                                    </Text>
                                </Box>
                                <Text fontSize="sm" color="green.600" textAlign="right" w="120px">
                                    − {currency} {discountAmount.toLocaleString()}
                                </Text>
                            </Flex>
                        )}

                        {/* Total */}
                        <Flex
                            px={4}
                            py={4}
                            bg="purple.50"
                            align="center"
                        >
                            <Text flex={1} fontWeight="bold" fontSize="md">Total</Text>
                            <Text fontWeight="bold" fontSize="lg" color="purple.700" textAlign="right" w="120px">
                                {currency} {totalAmount.toLocaleString()}
                            </Text>
                        </Flex>
                    </Box>

                    {/* Payment status */}
                    <Flex justify="space-between" align="center" mb={6}>
                        <HStack gap={2}>
                            <Text fontSize="sm" color="gray.500">Payment Status:</Text>
                            <Badge colorScheme={statusColor[payment.status] ?? 'gray'} fontSize="sm" px={3} py={1}>
                                {payment.status ?? 'Unknown'}
                            </Badge>
                        </HStack>
                        {payment.paid_at && (
                            <Text fontSize="xs" color="gray.400">
                                Paid on {new Date(payment.paid_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </Text>
                        )}
                    </Flex>

                    {/* Footer note */}
                    <Box
                        bg="gray.50"
                        borderRadius="md"
                        px={4}
                        py={3}
                        borderWidth="1px"
                        borderColor="gray.200"
                    >
                        <Text fontSize="xs" color="gray.400" textAlign="center">
                            This is a computer-generated invoice and does not require a physical signature.
                            For support, contact support@tilms.in
                        </Text>
                    </Box>
                </Box>
            </Box>

            {/* Print styles injected via style tag */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    #invoice-print-area {
                        box-shadow: none !important;
                        border: none !important;
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </StudentLayout>
    );
}

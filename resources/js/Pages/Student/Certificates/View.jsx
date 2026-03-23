import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Button,
    Flex,
    Text,
    Badge,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { FiPrinter, FiAward, FiShield } from 'react-icons/fi';

export default function View({ certificate = {} }) {
    const cohort = certificate.cohort ?? {};
    const typeColor = { internship: 'purple', learning: 'blue' };

    const verificationUrl = certificate.verification_url
        ?? `${window.location.origin}/verify/${certificate.uuid}`;

    const completionDate = certificate.issued_at
        ? new Date(certificate.issued_at).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
        })
        : '—';

    const studentName = certificate.user?.name
        ?? certificate.student_name
        ?? 'Student Name';

    return (
        <StudentLayout title="Certificate">
            <Head title="Certificate of Completion" />

            {/* Print action bar — hidden when printing */}
            <Flex justify="flex-end" mb={4} className="no-print">
                <Button
                    colorPalette="purple"
                    onClick={() => window.print()}
                >
                    <FiPrinter size={14} /> Print Certificate
                </Button>
            </Flex>

            {/* Certificate card */}
            <Box
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                borderWidth="2px"
                borderColor="purple.200"
                overflow="hidden"
                maxW="780px"
                mx="auto"
                id="certificate-card"
            >
                {/* Top gradient bar */}
                <Box
                    bgGradient="linear(to-r, purple.600, blue.500)"
                    h={3}
                />

                <Box p={{ base: 8, md: 14 }}>
                    {/* Header: Platform name / logo */}
                    <VStack gap={1} mb={8} textAlign="center">
                        <Flex align="center" gap={2}>
                            <FiAward size={28} color="#7C3AED" />
                            <Text
                                fontSize="xl"
                                fontWeight="extrabold"
                                color="purple.700"
                                letterSpacing="wide"
                                textTransform="uppercase"
                            >
                                TILMS
                            </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.400" letterSpacing="widest" textTransform="uppercase">
                            Training &amp; Internship Learning Management System
                        </Text>
                    </VStack>

                    {/* Decorative divider */}
                    <Flex align="center" mb={8} gap={3}>
                        <Box flex={1} h="1px" bg="purple.100" />
                        <Box w={2} h={2} borderRadius="full" bg="purple.300" />
                        <Box flex={1} h="1px" bg="purple.100" />
                    </Flex>

                    {/* Main certificate content */}
                    <VStack gap={4} textAlign="center" mb={10}>
                        <Text
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight="bold"
                            color="gray.700"
                            letterSpacing="wide"
                            textTransform="uppercase"
                        >
                            Certificate of Completion
                        </Text>

                        <Text fontSize="md" color="gray.500">
                            This is to certify that
                        </Text>

                        <Text
                            fontSize={{ base: '3xl', md: '4xl' }}
                            fontWeight="extrabold"
                            color="purple.700"
                            fontStyle="italic"
                            borderBottomWidth="2px"
                            borderColor="purple.200"
                            pb={2}
                            px={4}
                        >
                            {studentName}
                        </Text>

                        <Text fontSize="md" color="gray.500">
                            has successfully completed
                        </Text>

                        <VStack gap={1}>
                            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.800">
                                {cohort.title ?? 'Cohort'}
                            </Text>
                            {cohort.type && (
                                <Badge
                                    colorScheme={typeColor[cohort.type] ?? 'gray'}
                                    fontSize="sm"
                                    px={3}
                                    py={0.5}
                                    borderRadius="full"
                                >
                                    {cohort.type === 'internship' ? 'Internship Program' : 'Learning Cohort'}
                                </Badge>
                            )}
                        </VStack>

                        <Text fontSize="sm" color="gray.500" mt={2}>
                            Completed on{' '}
                            <Box as="span" fontWeight="semibold" color="gray.700">
                                {completionDate}
                            </Box>
                        </Text>
                    </VStack>

                    {/* Decorative divider */}
                    <Flex align="center" mb={8} gap={3}>
                        <Box flex={1} h="1px" bg="purple.100" />
                        <Box w={2} h={2} borderRadius="full" bg="purple.300" />
                        <Box flex={1} h="1px" bg="purple.100" />
                    </Flex>

                    {/* Footer row: cert number + QR placeholder + verification */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        justify="space-between"
                        align={{ base: 'center', md: 'flex-end' }}
                        gap={6}
                    >
                        {/* Certificate number */}
                        <VStack align={{ base: 'center', md: 'flex-start' }} gap={0.5}>
                            <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                                Certificate Number
                            </Text>
                            <Text fontSize="sm" fontFamily="mono" fontWeight="semibold" color="gray.600">
                                {certificate.certificate_number ?? certificate.uuid}
                            </Text>
                        </VStack>

                        {/* QR code placeholder */}
                        <Box
                            w="80px"
                            h="80px"
                            bg="gray.100"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="gray.200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                        >
                            <VStack gap={0.5}>
                                <FiShield size={20} color="#9CA3AF" />
                                <Text fontSize="8px" color="gray.400" textAlign="center">QR Code</Text>
                            </VStack>
                        </Box>

                        {/* Verification URL */}
                        <VStack align={{ base: 'center', md: 'flex-end' }} gap={0.5}>
                            <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                                Verify at
                            </Text>
                            <Text fontSize="xs" fontFamily="mono" color="blue.500" textAlign="right" maxW="200px">
                                {verificationUrl}
                            </Text>
                        </VStack>
                    </Flex>
                </Box>

                {/* Bottom gradient bar */}
                <Box bgGradient="linear(to-r, purple.600, blue.500)" h={1.5} />
            </Box>

            {/* Print styles */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body * { visibility: hidden; }
                    #certificate-card, #certificate-card * { visibility: visible; }
                    #certificate-card { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </StudentLayout>
    );
}

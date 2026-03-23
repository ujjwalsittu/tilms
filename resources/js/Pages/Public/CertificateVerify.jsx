import { Head } from '@inertiajs/react';
import {
    Box,
    Container,
    Flex,
    Text,
    Badge,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { FiCheckCircle, FiXCircle, FiAward, FiShield } from 'react-icons/fi';

export default function CertificateVerify({ certificate = null, verified = false }) {
    const cohort = certificate?.cohort ?? {};
    const typeColor = { internship: 'purple', learning: 'blue' };

    const completionDate = certificate?.issued_at
        ? new Date(certificate.issued_at).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
        })
        : null;

    const studentName = certificate?.user?.name ?? certificate?.student_name ?? null;

    return (
        <Container maxW="2xl" py={16}>
            <Head title="Verify Certificate" />

            {/* Platform header */}
            <Flex justify="center" align="center" gap={2} mb={8}>
                <FiAward size={22} color="#7C3AED" />
                <Text fontWeight="extrabold" fontSize="lg" color="purple.700" letterSpacing="wide" textTransform="uppercase">
                    TILMS
                </Text>
                <Text fontSize="sm" color="gray.400">Certificate Verification</Text>
            </Flex>

            {/* ── Verified ── */}
            {verified && certificate ? (
                <VStack gap={5}>
                    {/* Green banner */}
                    <Box
                        bg="green.50"
                        borderWidth="1px"
                        borderColor="green.300"
                        borderRadius="xl"
                        p={5}
                        w="full"
                    >
                        <Flex align="center" gap={3}>
                            <FiCheckCircle size={24} color="#16A34A" />
                            <Box>
                                <Text fontWeight="bold" color="green.700" fontSize="md">
                                    Certificate Verified
                                </Text>
                                <Text fontSize="sm" color="green.600">
                                    This certificate is authentic and was issued by TILMS.
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    {/* Certificate details card */}
                    <Box
                        bg="white"
                        borderRadius="xl"
                        boxShadow="md"
                        borderWidth="2px"
                        borderColor="purple.200"
                        overflow="hidden"
                        w="full"
                    >
                        <Box bgGradient="linear(to-r, purple.600, blue.500)" h={2} />
                        <Box p={8}>
                            <VStack gap={4} textAlign="center">
                                {studentName && (
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={1}>
                                            Awarded to
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="extrabold" color="purple.700" fontStyle="italic">
                                            {studentName}
                                        </Text>
                                    </Box>
                                )}

                                <Flex align="center" gap={3} w="full">
                                    <Box flex={1} h="1px" bg="gray.100" />
                                    <Box w={1.5} h={1.5} borderRadius="full" bg="purple.300" />
                                    <Box flex={1} h="1px" bg="gray.100" />
                                </Flex>

                                <Box>
                                    <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={1}>
                                        For completing
                                    </Text>
                                    <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                        {cohort.title ?? 'Cohort'}
                                    </Text>
                                    {cohort.type && (
                                        <Badge
                                            colorPalette={typeColor[cohort.type] ?? 'gray'}
                                            mt={1}
                                            px={3}
                                            py={0.5}
                                            borderRadius="full"
                                        >
                                            {cohort.type === 'internship' ? 'Internship Program' : 'Learning Cohort'}
                                        </Badge>
                                    )}
                                </Box>

                                {completionDate && (
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={0.5}>
                                            Completion Date
                                        </Text>
                                        <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                            {completionDate}
                                        </Text>
                                    </Box>
                                )}

                                {/* Certificate number */}
                                <Box
                                    bg="gray.50"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    px={5}
                                    py={3}
                                    w="full"
                                >
                                    <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={0.5}>
                                        Certificate Number
                                    </Text>
                                    <Text fontFamily="mono" fontWeight="semibold" color="gray.600" fontSize="sm">
                                        {certificate.certificate_number ?? certificate.uuid}
                                    </Text>
                                </Box>

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
                                    mx="auto"
                                >
                                    <VStack gap={0.5}>
                                        <FiShield size={20} color="#9CA3AF" />
                                        <Text fontSize="8px" color="gray.400">QR Code</Text>
                                    </VStack>
                                </Box>
                            </VStack>
                        </Box>
                        <Box bgGradient="linear(to-r, purple.600, blue.500)" h={1} />
                    </Box>
                </VStack>
            ) : (
                /* ── Not verified ── */
                <Box
                    bg="red.50"
                    borderWidth="1px"
                    borderColor="red.300"
                    borderRadius="xl"
                    p={8}
                    textAlign="center"
                >
                    <Flex justify="center" mb={4}>
                        <FiXCircle size={40} color="#DC2626" />
                    </Flex>
                    <Text fontWeight="bold" color="red.700" fontSize="xl" mb={2}>
                        Certificate Not Found or Invalid
                    </Text>
                    <Text fontSize="sm" color="red.500">
                        The certificate you are looking for does not exist or the verification link is incorrect.
                        Please check the URL and try again.
                    </Text>
                </Box>
            )}
        </Container>
    );
}

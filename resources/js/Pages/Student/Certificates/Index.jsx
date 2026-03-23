import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { useState } from 'react';
import {
    Box,
    Button,
    Badge,
    Flex,
    Text,
    SimpleGrid,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { FiAward, FiDownload, FiShare2, FiCopy, FiCheck } from 'react-icons/fi';

function CertificateCard({ cert }) {
    const [copied, setCopied] = useState(false);

    const verificationUrl = cert.verification_url
        ?? `${window.location.origin}/verify/${cert.uuid}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(verificationUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const cohort = cert.cohort ?? {};
    const typeColor = { internship: 'purple', learning: 'blue' };

    return (
        <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
            overflow="hidden"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
        >
            {/* Top accent */}
            <Box bg="purple.500" h={1.5} />

            <Box p={5}>
                {/* Icon + Type badge */}
                <Flex justify="space-between" align="flex-start" mb={3}>
                    <Flex
                        w={12}
                        h={12}
                        bg="purple.50"
                        borderRadius="lg"
                        align="center"
                        justify="center"
                    >
                        <FiAward size={22} color="#7C3AED" />
                    </Flex>
                    <Badge colorScheme={typeColor[cohort.type] ?? 'gray'} variant="subtle">
                        {cohort.type ?? 'cohort'}
                    </Badge>
                </Flex>

                {/* Cohort title */}
                <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={2}>
                    {cohort.title ?? 'Certificate'}
                </Text>

                {/* Certificate number */}
                <Text fontSize="xs" color="gray.500" mb={1}>
                    Cert #: <Box as="span" fontFamily="mono">{cert.certificate_number ?? cert.uuid}</Box>
                </Text>

                {/* Issued date */}
                {cert.issued_at && (
                    <Text fontSize="xs" color="gray.400" mb={4}>
                        Issued: {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric',
                        })}
                    </Text>
                )}

                {/* Verification URL row */}
                <Box
                    bg="gray.50"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    p={2}
                    mb={3}
                >
                    <Text fontSize="xs" color="gray.500" mb={1}>Verification URL</Text>
                    <Flex align="center" gap={2}>
                        <Text fontSize="xs" color="blue.600" noOfLines={1} flex={1} fontFamily="mono">
                            {verificationUrl}
                        </Text>
                        <Button
                            size="xs"
                            variant="ghost"
                            colorScheme={copied ? 'green' : 'gray'}
                            onClick={handleCopy}
                            aria-label="Copy verification URL"
                        >
                            {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                        </Button>
                    </Flex>
                </Box>

                {/* Actions */}
                <HStack gap={2}>
                    <a
                        href={route('student.certificates.download', cert.id)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ flex: 1 }}
                    >
                        <Button
                            w="full"
                            size="sm"
                            colorScheme="purple"
                            variant="outline"
                        >
                            <FiDownload size={13} style={{ marginRight: 4 }} />
                            Download
                        </Button>
                    </a>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={handleCopy}
                        aria-label="Share certificate"
                        flex={0}
                        px={3}
                    >
                        <FiShare2 size={13} />
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
}

export default function Index({ certificates = [] }) {
    return (
        <StudentLayout title="My Certificates">
            <Head title="My Certificates" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">My Certificates</Text>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
                    </Text>
                </Box>
            </Flex>

            {certificates.length === 0 ? (
                <Box
                    bg="gray.50"
                    p={14}
                    borderRadius="xl"
                    textAlign="center"
                    borderWidth="1px"
                    borderStyle="dashed"
                    borderColor="gray.200"
                >
                    <Flex justify="center" mb={4}>
                        <Flex
                            w={16}
                            h={16}
                            bg="purple.50"
                            borderRadius="full"
                            align="center"
                            justify="center"
                        >
                            <FiAward size={32} color="#7C3AED" opacity={0.5} />
                        </Flex>
                    </Flex>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
                        No certificates yet
                    </Text>
                    <Text color="gray.400" maxW="sm" mx="auto">
                        Complete a cohort to earn your first certificate. Keep going — you're almost there!
                    </Text>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={5}>
                    {certificates.map((cert) => (
                        <CertificateCard key={cert.id} cert={cert} />
                    ))}
                </SimpleGrid>
            )}
        </StudentLayout>
    );
}

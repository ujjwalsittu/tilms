import { Head } from '@inertiajs/react';
import {
    Box,
    Container,
    Badge,
    Flex,
    Text,
    SimpleGrid,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { FiAward, FiGithub, FiExternalLink, FiZap } from 'react-icons/fi';

const typeColor = { internship: 'purple', learning: 'blue' };

const BADGE_COLORS = [
    'blue', 'purple', 'green', 'orange', 'teal', 'red', 'pink', 'cyan',
];

function badgeColor(badge, index) {
    if (badge.color && BADGE_COLORS.includes(badge.color)) return badge.color;
    return BADGE_COLORS[index % BADGE_COLORS.length];
}

function SectionHeading({ children }) {
    return (
        <Text
            fontWeight="bold"
            fontSize="lg"
            mb={4}
            pb={2}
            borderBottomWidth="2px"
            borderColor="gray.100"
            color="gray.800"
        >
            {children}
        </Text>
    );
}

export default function Portfolio({
    portfolio = {},
    user = {},
    completedCohorts = [],
    certificates = [],
    projectSubmissions = [],
    badges = [],
}) {
    const skills = Array.isArray(portfolio.skills)
        ? portfolio.skills
        : (portfolio.skills ? String(portfolio.skills).split(',').map((s) => s.trim()).filter(Boolean) : []);

    const displayName = user.name ?? 'Student';

    return (
        <Container maxW="3xl" py={12}>
            <Head title={`${displayName} — Portfolio`} />

            {/* ── Header ── */}
            <Box bg="white" borderRadius="2xl" boxShadow="sm" borderWidth="1px" p={8} mb={6}>
                <Flex align="center" gap={6} direction={{ base: 'column', sm: 'row' }}>
                    {/* Avatar */}
                    <Flex
                        w={20}
                        h={20}
                        bg="blue.100"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        borderWidth="3px"
                        borderColor="blue.200"
                    >
                        <Text fontWeight="extrabold" fontSize="3xl" color="blue.600" lineHeight="1">
                            {displayName[0].toUpperCase()}
                        </Text>
                    </Flex>

                    <Box textAlign={{ base: 'center', sm: 'left' }}>
                        <Text fontWeight="extrabold" fontSize="2xl" color="gray.900">
                            {displayName}
                        </Text>
                        {portfolio.headline && (
                            <Text fontSize="md" color="gray.500" mt={0.5}>
                                {portfolio.headline}
                            </Text>
                        )}
                    </Box>
                </Flex>
            </Box>

            {/* ── About ── */}
            {portfolio.about && (
                <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" p={6} mb={5}>
                    <SectionHeading>About</SectionHeading>
                    <Text fontSize="sm" color="gray.600" lineHeight="tall" whiteSpace="pre-wrap">
                        {portfolio.about}
                    </Text>
                </Box>
            )}

            {/* ── Skills ── */}
            {skills.length > 0 && (
                <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" p={6} mb={5}>
                    <SectionHeading>Skills</SectionHeading>
                    <HStack gap={2} flexWrap="wrap">
                        {skills.map((skill) => (
                            <Badge
                                key={skill}
                                colorPalette="blue"
                                variant="subtle"
                                borderRadius="full"
                                px={3}
                                py={1}
                                fontSize="sm"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </HStack>
                </Box>
            )}

            {/* ── Completed Cohorts ── */}
            {completedCohorts.length > 0 && (
                <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" p={6} mb={5}>
                    <SectionHeading>Completed Cohorts</SectionHeading>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                        {completedCohorts.map((enrollment) => {
                            const cohort = enrollment.cohort ?? enrollment;
                            return (
                                <Box
                                    key={cohort.id}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    p={4}
                                    bg="gray.50"
                                >
                                    <Flex justify="space-between" align="flex-start" mb={1}>
                                        <Text fontWeight="semibold" fontSize="sm" flex={1} noOfLines={2}>
                                            {cohort.title}
                                        </Text>
                                        <Badge
                                            colorPalette={typeColor[cohort.type] ?? 'gray'}
                                            ml={2}
                                            flexShrink={0}
                                            fontSize="xs"
                                        >
                                            {cohort.type}
                                        </Badge>
                                    </Flex>
                                    {(enrollment.completed_at ?? enrollment.ends_at) && (
                                        <Text fontSize="xs" color="gray.400">
                                            Completed{' '}
                                            {new Date(enrollment.completed_at ?? enrollment.ends_at).toLocaleDateString('en-IN', {
                                                year: 'numeric', month: 'short',
                                            })}
                                        </Text>
                                    )}
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                </Box>
            )}

            {/* ── Certificates ── */}
            {certificates.length > 0 && (
                <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" p={6} mb={5}>
                    <SectionHeading>Certificates</SectionHeading>
                    <VStack gap={3} align="stretch">
                        {certificates.map((cert) => {
                            const verificationUrl = cert.verification_url
                                ?? `${window.location.origin}/verify/${cert.uuid}`;
                            return (
                                <Flex
                                    key={cert.id}
                                    align="center"
                                    gap={3}
                                    p={3}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    bg="purple.50"
                                    justify="space-between"
                                >
                                    <Flex align="center" gap={3}>
                                        <Flex
                                            w={9}
                                            h={9}
                                            bg="purple.100"
                                            borderRadius="lg"
                                            align="center"
                                            justify="center"
                                            flexShrink={0}
                                        >
                                            <FiAward size={16} color="#7C3AED" />
                                        </Flex>
                                        <Box>
                                            <Text fontWeight="semibold" fontSize="sm">
                                                {cert.cohort?.title ?? 'Certificate'}
                                            </Text>
                                            {cert.issued_at && (
                                                <Text fontSize="xs" color="gray.500">
                                                    Issued {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                                                        year: 'numeric', month: 'short',
                                                    })}
                                                </Text>
                                            )}
                                        </Box>
                                    </Flex>
                                    <a
                                        href={verificationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ flexShrink: 0 }}
                                    >
                                        <Flex align="center" gap={1} color="purple.600" fontSize="xs">
                                            <FiExternalLink size={12} />
                                            <Text fontSize="xs">Verify</Text>
                                        </Flex>
                                    </a>
                                </Flex>
                            );
                        })}
                    </VStack>
                </Box>
            )}

            {/* ── GitHub Projects ── */}
            {projectSubmissions.length > 0 && (
                <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" p={6} mb={5}>
                    <SectionHeading>GitHub Projects</SectionHeading>
                    <VStack gap={3} align="stretch">
                        {projectSubmissions.map((sub) => {
                            const repoUrl = sub.github_url ?? sub.repo_url ?? null;
                            return (
                                <Flex
                                    key={sub.id}
                                    align="center"
                                    gap={3}
                                    p={3}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    bg="gray.50"
                                    justify="space-between"
                                >
                                    <Flex align="center" gap={3}>
                                        <Flex
                                            w={9}
                                            h={9}
                                            bg="gray.200"
                                            borderRadius="lg"
                                            align="center"
                                            justify="center"
                                            flexShrink={0}
                                        >
                                            <FiGithub size={16} color="#374151" />
                                        </Flex>
                                        <Box>
                                            <Text fontWeight="semibold" fontSize="sm">
                                                {sub.title ?? sub.task?.title ?? 'Project'}
                                            </Text>
                                            {repoUrl && (
                                                <Text fontSize="xs" color="gray.400" noOfLines={1}>
                                                    {repoUrl}
                                                </Text>
                                            )}
                                        </Box>
                                    </Flex>
                                    {repoUrl && (
                                        <a
                                            href={repoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ flexShrink: 0 }}
                                        >
                                            <Flex align="center" gap={1} color="gray.600" fontSize="xs">
                                                <FiExternalLink size={12} />
                                                <Text fontSize="xs">View</Text>
                                            </Flex>
                                        </a>
                                    )}
                                </Flex>
                            );
                        })}
                    </VStack>
                </Box>
            )}

            {/* ── Badges ── */}
            {badges.length > 0 && (
                <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" p={6} mb={5}>
                    <SectionHeading>Badges</SectionHeading>
                    <HStack gap={4} flexWrap="wrap">
                        {badges.map((ub, i) => {
                            const badge = ub.badge ?? ub;
                            const color = badgeColor(badge, i);
                            return (
                                <VStack key={ub.id ?? i} gap={1} align="center" minW="60px">
                                    <Flex
                                        w={12}
                                        h={12}
                                        bg={`${color}.100`}
                                        borderRadius="full"
                                        align="center"
                                        justify="center"
                                        borderWidth="2px"
                                        borderColor={`${color}.200`}
                                    >
                                        <Text
                                            fontWeight="extrabold"
                                            fontSize="lg"
                                            color={`${color}.600`}
                                            lineHeight="1"
                                        >
                                            {(badge.name ?? 'B')[0].toUpperCase()}
                                        </Text>
                                    </Flex>
                                    <Text fontSize="xs" color="gray.600" textAlign="center" noOfLines={2} maxW="60px">
                                        {badge.name}
                                    </Text>
                                </VStack>
                            );
                        })}
                    </HStack>
                </Box>
            )}

            {/* Empty state if nothing to show */}
            {!portfolio.about && skills.length === 0 && completedCohorts.length === 0 &&
             certificates.length === 0 && projectSubmissions.length === 0 && badges.length === 0 && (
                <Box bg="gray.50" borderRadius="xl" p={10} textAlign="center" borderWidth="1px" borderStyle="dashed">
                    <Flex justify="center" mb={3}>
                        <FiZap size={28} color="#9CA3AF" />
                    </Flex>
                    <Text color="gray.400">This portfolio doesn't have any content yet.</Text>
                </Box>
            )}
        </Container>
    );
}

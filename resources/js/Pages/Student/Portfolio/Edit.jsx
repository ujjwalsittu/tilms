import { Head, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Badge,
    Flex,
    Text,
    SimpleGrid,
    HStack,
    VStack,
    Textarea,
    Input,
} from '@chakra-ui/react';
import {
    FiUser,
    FiGlobe,
    FiGithub,
    FiAward,
    FiCopy,
    FiCheck,
    FiEye,
    FiSave,
    FiX,
} from 'react-icons/fi';

const typeColor = { internship: 'purple', learning: 'blue' };

/* ── Small helpers ──────────────────────────────────────────────────── */

function TagList({ tags }) {
    if (!tags || tags.length === 0) return null;
    return (
        <HStack gap={2} flexWrap="wrap" mt={2}>
            {tags.map((t) => (
                <Badge key={t} colorPalette="blue" variant="subtle" borderRadius="full" px={2} py={0.5}>
                    {t}
                </Badge>
            ))}
        </HStack>
    );
}

function SectionCard({ title, children }) {
    return (
        <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" p={4} mb={3}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.600" mb={3} textTransform="uppercase" letterSpacing="wide">
                {title}
            </Text>
            {children}
        </Box>
    );
}

/* ── Live Preview ───────────────────────────────────────────────────── */

function PortfolioPreview({ form, user, completedCohorts, certificates, projectSubmissions, badges }) {
    const skills = form.skills
        ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <Box bg="gray.50" borderRadius="xl" p={5} h="100%" overflowY="auto">
            <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Preview
            </Text>

            {/* Header */}
            <Box bg="white" borderRadius="lg" p={5} mb={3} boxShadow="sm">
                <Flex align="center" gap={4}>
                    <Flex
                        w={14}
                        h={14}
                        bg="blue.100"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        flexShrink={0}
                    >
                        <Text fontWeight="bold" color="blue.600" fontSize="xl">
                            {(user?.name ?? 'U')[0].toUpperCase()}
                        </Text>
                    </Flex>
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">{user?.name ?? 'Your Name'}</Text>
                        {form.headline ? (
                            <Text fontSize="sm" color="gray.500">{form.headline}</Text>
                        ) : (
                            <Text fontSize="sm" color="gray.300" fontStyle="italic">Your headline</Text>
                        )}
                    </Box>
                </Flex>
            </Box>

            {/* About */}
            {form.about && (
                <SectionCard title="About">
                    <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">{form.about}</Text>
                </SectionCard>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <SectionCard title="Skills">
                    <TagList tags={skills} />
                </SectionCard>
            )}

            {/* Completed Cohorts */}
            {completedCohorts?.length > 0 && (
                <SectionCard title="Completed Cohorts">
                    <VStack gap={2} align="stretch">
                        {completedCohorts.map((enrollment) => {
                            const cohort = enrollment.cohort ?? enrollment;
                            return (
                                <Flex key={cohort.id} justify="space-between" align="center" py={1}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium">{cohort.title}</Text>
                                        {enrollment.completed_at && (
                                            <Text fontSize="xs" color="gray.400">
                                                {new Date(enrollment.completed_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                    </Box>
                                    <Badge colorPalette={typeColor[cohort.type] ?? 'gray'} fontSize="xs">
                                        {cohort.type}
                                    </Badge>
                                </Flex>
                            );
                        })}
                    </VStack>
                </SectionCard>
            )}

            {/* Certificates */}
            {certificates?.length > 0 && (
                <SectionCard title="Certificates">
                    <VStack gap={2} align="stretch">
                        {certificates.map((cert) => (
                            <Flex key={cert.id} align="center" gap={2} py={1}>
                                <FiAward size={14} color="#7C3AED" />
                                <Text fontSize="sm">{cert.cohort?.title ?? 'Certificate'}</Text>
                            </Flex>
                        ))}
                    </VStack>
                </SectionCard>
            )}

            {/* GitHub Projects */}
            {projectSubmissions?.length > 0 && (
                <SectionCard title="GitHub Projects">
                    <VStack gap={2} align="stretch">
                        {projectSubmissions.map((sub) => (
                            <Flex key={sub.id} align="center" gap={2} py={1}>
                                <FiGithub size={14} color="#374151" />
                                <Text fontSize="sm" color="blue.500" noOfLines={1}>
                                    {sub.github_url ?? sub.repo_url ?? 'Project'}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>
                </SectionCard>
            )}

            {/* Badges */}
            {badges?.length > 0 && (
                <SectionCard title="Badges">
                    <HStack gap={2} flexWrap="wrap">
                        {badges.map((ub) => {
                            const badge = ub.badge ?? ub;
                            return (
                                <VStack key={ub.id} gap={0.5} align="center">
                                    <Flex
                                        w={10}
                                        h={10}
                                        bg={`${badge.color ?? 'blue'}.100`}
                                        borderRadius="full"
                                        align="center"
                                        justify="center"
                                    >
                                        <Text fontWeight="bold" fontSize="sm" color={`${badge.color ?? 'blue'}.600`}>
                                            {(badge.name ?? 'B')[0].toUpperCase()}
                                        </Text>
                                    </Flex>
                                    <Text fontSize="9px" color="gray.500" textAlign="center" maxW="40px" noOfLines={2}>
                                        {badge.name}
                                    </Text>
                                </VStack>
                            );
                        })}
                    </HStack>
                </SectionCard>
            )}
        </Box>
    );
}

/* ── Main Page ──────────────────────────────────────────────────────── */

export default function Edit({
    portfolio = {},
    user = {},
    completedCohorts = [],
    certificates = [],
    projectSubmissions = [],
    badges = [],
}) {
    const [form, setForm] = useState({
        headline: portfolio.headline ?? '',
        about: portfolio.about ?? '',
        skills: Array.isArray(portfolio.skills)
            ? portfolio.skills.join(', ')
            : (portfolio.skills ?? ''),
        is_public: portfolio.is_public ?? false,
    });
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = portfolio.slug
        ? `${window.location.origin}/portfolio/${portfolio.slug}`
        : '';

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setSaving(true);
        router.put(
            route('student.portfolio.update'),
            {
                ...form,
                skills: form.skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
            },
            {
                onFinish: () => setSaving(false),
                preserveScroll: true,
            }
        );
    };

    const handleCopyShare = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <StudentLayout title="My Portfolio">
            <Head title="Edit Portfolio" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">My Portfolio</Text>
                    <Text fontSize="sm" color="gray.500">Showcase your skills and achievements</Text>
                </Box>
                <HStack gap={2}>
                    {shareUrl && (
                        <a href={shareUrl} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline" colorPalette="blue">
                                <FiEye size={13} style={{ marginRight: 4 }} />
                                View Public
                            </Button>
                        </a>
                    )}
                    <Button
                        size="sm"
                        colorPalette="blue"
                        onClick={handleSave}
                        loading={saving}
                    >
                        <FiSave size={13} style={{ marginRight: 4 }} />
                        Save
                    </Button>
                </HStack>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                {/* ── LEFT: Editor ── */}
                <Box>
                    {/* Headline */}
                    <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" p={5} mb={4}>
                        <Text fontWeight="semibold" mb={1}>Headline</Text>
                        <Text fontSize="xs" color="gray.400" mb={2}>
                            A short tagline shown at the top of your portfolio
                        </Text>
                        <Input
                            placeholder="e.g. Full-Stack Developer | React &amp; Laravel"
                            value={form.headline}
                            onChange={(e) => handleChange('headline', e.target.value)}
                            maxLength={120}
                        />
                        <Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
                            {form.headline.length}/120
                        </Text>
                    </Box>

                    {/* About */}
                    <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" p={5} mb={4}>
                        <Text fontWeight="semibold" mb={1}>About</Text>
                        <Text fontSize="xs" color="gray.400" mb={2}>
                            Describe yourself, your interests and goals
                        </Text>
                        <Textarea
                            placeholder="Write a short bio..."
                            value={form.about}
                            onChange={(e) => handleChange('about', e.target.value)}
                            rows={5}
                            resize="vertical"
                            maxLength={1000}
                        />
                        <Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
                            {form.about.length}/1000
                        </Text>
                    </Box>

                    {/* Skills */}
                    <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" p={5} mb={4}>
                        <Text fontWeight="semibold" mb={1}>Skills</Text>
                        <Text fontSize="xs" color="gray.400" mb={2}>
                            Enter skills separated by commas
                        </Text>
                        <Input
                            placeholder="React, Laravel, Python, Docker, ..."
                            value={form.skills}
                            onChange={(e) => handleChange('skills', e.target.value)}
                        />
                        {/* Tag preview */}
                        {form.skills && (
                            <HStack gap={2} flexWrap="wrap" mt={3}>
                                {form.skills
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .map((skill) => (
                                        <Badge
                                            key={skill}
                                            colorPalette="blue"
                                            variant="subtle"
                                            borderRadius="full"
                                            px={2}
                                            py={0.5}
                                            fontSize="xs"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                            </HStack>
                        )}
                    </Box>

                    {/* Visibility */}
                    <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" p={5} mb={4}>
                        <Text fontWeight="semibold" mb={1}>Visibility</Text>
                        <Flex align="center" gap={3} mt={2}>
                            <input
                                type="checkbox"
                                id="is_public"
                                checked={form.is_public}
                                onChange={(e) => handleChange('is_public', e.target.checked)}
                                style={{ width: 16, height: 16, cursor: 'pointer' }}
                            />
                            <Box as="label" htmlFor="is_public" cursor="pointer">
                                <Text fontSize="sm" fontWeight="medium">
                                    Make portfolio public
                                </Text>
                                <Text fontSize="xs" color="gray.400">
                                    Anyone with the link can view your portfolio
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    {/* Share link */}
                    {shareUrl && (
                        <Box bg="blue.50" borderRadius="lg" borderWidth="1px" borderColor="blue.200" p={4} mb={4}>
                            <Flex align="center" gap={2}>
                                <FiGlobe size={14} color="#2563EB" />
                                <Text fontSize="sm" fontWeight="medium" color="blue.700">Share Link</Text>
                            </Flex>
                            <Flex align="center" gap={2} mt={2}>
                                <Text
                                    fontSize="sm"
                                    fontFamily="mono"
                                    color="blue.600"
                                    flex={1}
                                    noOfLines={1}
                                >
                                    {shareUrl}
                                </Text>
                                <Button
                                    size="xs"
                                    colorPalette={copied ? 'green' : 'blue'}
                                    variant="outline"
                                    onClick={handleCopyShare}
                                >
                                    {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                </Button>
                            </Flex>
                        </Box>
                    )}

                    {/* Save */}
                    <Button
                        w="full"
                        colorPalette="blue"
                        size="md"
                        onClick={handleSave}
                        loading={saving}
                        loadingText="Saving..."
                    >
                        <FiSave size={14} style={{ marginRight: 6 }} />
                        Save Portfolio
                    </Button>
                </Box>

                {/* ── RIGHT: Live Preview ── */}
                <Box>
                    <PortfolioPreview
                        form={form}
                        user={user}
                        completedCohorts={completedCohorts}
                        certificates={certificates}
                        projectSubmissions={projectSubmissions}
                        badges={badges}
                    />
                </Box>
            </SimpleGrid>
        </StudentLayout>
    );
}

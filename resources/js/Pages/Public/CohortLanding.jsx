import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Container,
    Flex,
    Text,
    Heading,
    Badge,
    SimpleGrid,
    VStack,
    HStack,
} from '@chakra-ui/react';
import {
    FiUsers,
    FiBook,
    FiCheckCircle,
    FiAward,
    FiStar,
    FiClock,
    FiShield,
    FiArrowRight,
} from 'react-icons/fi';

function FeaturePill({ icon: IconComp, text }) {
    return (
        <HStack gap={2} bg="blue.50" px={3} py={1.5} borderRadius="full">
            <IconComp size={16} />
            <Text fontSize="sm" color="blue.700" fontWeight="medium">{text}</Text>
        </HStack>
    );
}

function StatBadge({ value, label, icon: IconComp }) {
    return (
        <Box textAlign="center" px={6}>
            <HStack justify="center" gap={1} mb={1}>
                <IconComp size={20} />
                <Text fontSize="2xl" fontWeight="bold">{value}</Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">{label}</Text>
        </Box>
    );
}

export default function CohortLanding({ cohort, instructor, taskCount = 0, enrollmentCount = 0 }) {
    const { auth } = usePage().props;

    if (!cohort) {
        return (
            <Container maxW="4xl" py={16}>
                <Head title="Cohort Not Found" />
                <Box textAlign="center">
                    <Heading size="xl" mb={4}>Cohort Not Found</Heading>
                    <Text color="gray.500">This cohort may no longer be available.</Text>
                </Box>
            </Container>
        );
    }

    const typeColor = { internship: 'purple', learning: 'blue' };
    const landingContent = (() => {
        if (!cohort.landing_page_content) return null;
        try {
            return typeof cohort.landing_page_content === 'string'
                ? JSON.parse(cohort.landing_page_content)
                : cohort.landing_page_content;
        } catch {
            return null;
        }
    })();

    return (
        <>
            <Head title={`${cohort.title} — TILMS`} />

            {/* Nav */}
            <Box bg="white" borderBottomWidth="1px" py={3} px={6}>
                <Container maxW="5xl">
                    <Flex justify="space-between" align="center">
                        <Link href="/">
                            <Text fontWeight="bold" fontSize="lg" color="blue.600">TILMS</Text>
                        </Link>
                        <HStack gap={3}>
                            {auth?.user ? (
                                <Link href={route('student.dashboard')}>
                                    <Button size="sm" colorPalette="blue">Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button size="sm" variant="ghost">Login</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="sm" colorPalette="blue">Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box bg="linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)" color="white" py={16}>
                <Container maxW="5xl">
                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} align="center">
                        <Box>
                            <HStack gap={2} mb={4}>
                                <Badge colorPalette={typeColor[cohort.type] ?? 'blue'} variant="solid" fontSize="sm">
                                    {cohort.type}
                                </Badge>
                                {cohort.status === 'registration_open' && (
                                    <Badge colorPalette="green" variant="solid" fontSize="sm">
                                        Enrolling Now
                                    </Badge>
                                )}
                            </HStack>

                            <Heading size="2xl" mb={4} lineHeight="shorter">
                                {cohort.title}
                            </Heading>

                            <Text fontSize="lg" opacity={0.9} mb={6}>
                                {landingContent?.hero?.subheadline ?? cohort.description}
                            </Text>

                            {/* Feature Pills */}
                            {landingContent?.highlights && (
                                <Flex gap={2} flexWrap="wrap" mb={6}>
                                    {landingContent.highlights.map((h, i) => (
                                        <FeaturePill key={i} icon={FiCheckCircle} text={h} />
                                    ))}
                                </Flex>
                            )}

                            {/* CTA */}
                            <HStack gap={3}>
                                {cohort.price_amount ? (
                                    <Link href={`/register/${cohort.slug ?? cohort.id}`}>
                                        <Button
                                            size="lg"
                                            colorPalette="orange"
                                        >
                                            Enroll for {cohort.price_currency ?? 'INR'} {Number(cohort.price_amount).toLocaleString()}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={`/register/${cohort.slug ?? cohort.id}`}>
                                        <Button size="lg" colorPalette="green">
                                            Enroll for Free
                                        </Button>
                                    </Link>
                                )}
                                {cohort.has_free_audit && (
                                    <Link href={`/register/${cohort.slug ?? cohort.id}` + '?audit=1'}>
                                        <Button size="lg" variant="outline" color="white" borderColor="white">
                                            Audit Free
                                        </Button>
                                    </Link>
                                )}
                            </HStack>
                        </Box>

                        {/* Stats Panel */}
                        <Box bg="whiteAlpha.100" borderRadius="xl" p={6} backdropFilter="blur(8px)">
                            <Flex justify="space-around" mb={6} borderBottomWidth="1px" borderColor="whiteAlpha.300" pb={6}>
                                <StatBadge value={enrollmentCount} label="Enrolled" icon={FiUsers} />
                                <Box borderLeftWidth="1px" borderColor="whiteAlpha.300" />
                                <StatBadge value={taskCount} label="Tasks" icon={FiBook} />
                            </Flex>

                            <VStack gap={3} align="start">
                                {cohort.starts_at && (
                                    <HStack gap={2}>
                                        <FiClock size={16} style={{opacity: 0.8}} />
                                        <Text fontSize="sm" opacity={0.9}>
                                            Starts {new Date(cohort.starts_at).toLocaleDateString(undefined, {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </Text>
                                    </HStack>
                                )}
                                {cohort.completion_threshold && (
                                    <HStack gap={2}>
                                        <FiAward size={16} style={{opacity: 0.8}} />
                                        <Text fontSize="sm" opacity={0.9}>
                                            Certificate at {cohort.completion_threshold}% completion
                                        </Text>
                                    </HStack>
                                )}
                                {cohort.has_leaderboard && (
                                    <HStack gap={2}>
                                        <FiStar size={16} style={{opacity: 0.8}} />
                                        <Text fontSize="sm" opacity={0.9}>Leaderboard enabled</Text>
                                    </HStack>
                                )}
                                {cohort.max_students && (
                                    <HStack gap={2}>
                                        <FiShield size={16} style={{opacity: 0.8}} />
                                        <Text fontSize="sm" opacity={0.9}>
                                            Limited to {cohort.max_students} students
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>

            <Container maxW="5xl" py={12}>
                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
                    {/* Main Content */}
                    <Box gridColumn={{ lg: 'span 2' }}>

                        {/* Curriculum Overview */}
                        {taskCount > 0 && (
                            <Box mb={10}>
                                <Heading size="lg" mb={6}>What You'll Learn</Heading>
                                <Box bg="white" borderRadius="lg" borderWidth="1px" overflow="hidden">
                                    <Box p={4} bg="gray.50" borderBottomWidth="1px">
                                        <HStack gap={2}>
                                            <FiBook size={16} />
                                            <Text fontWeight="semibold">{taskCount} Tasks</Text>
                                        </HStack>
                                    </Box>
                                    {landingContent?.curriculum ? (
                                        <VStack gap={0} align="stretch">
                                            {landingContent.curriculum.map((item, i) => (
                                                <Flex
                                                    key={i}
                                                    p={4}
                                                    borderBottomWidth="1px"
                                                    _last={{ borderBottomWidth: 0 }}
                                                    align="center"
                                                    gap={3}
                                                >
                                                    <FiCheckCircle size={16} style={{flexShrink: 0}} />
                                                    <Text fontSize="sm">{item}</Text>
                                                </Flex>
                                            ))}
                                        </VStack>
                                    ) : (
                                        <Box p={6}>
                                            <Text color="gray.600">
                                                This {cohort.type} contains {taskCount} hands-on tasks designed to build
                                                real-world skills. Complete tasks sequentially to unlock your certificate.
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* FAQ */}
                        {landingContent?.faq?.length > 0 && (
                            <Box mb={10}>
                                <Heading size="lg" mb={6}>Frequently Asked Questions</Heading>
                                <VStack gap={4} align="stretch">
                                    {landingContent.faq.map((item, i) => (
                                        <Box key={i} bg="white" p={5} borderRadius="lg" borderWidth="1px">
                                            <Text fontWeight="semibold" mb={2}>{item.q}</Text>
                                            <Text fontSize="sm" color="gray.600">{item.a}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </Box>

                    {/* Sidebar */}
                    <Box>
                        {/* Instructor Card */}
                        {instructor && (
                            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                                <Text fontWeight="semibold" mb={4} color="gray.500" fontSize="xs" textTransform="uppercase">
                                    Your Instructor
                                </Text>
                                <VStack align="start" gap={3}>
                                    <HStack gap={3}>
                                        <Flex w={12} h={12} bg="blue.100" borderRadius="full" align="center" justify="center" flexShrink={0}>
                                            <Text fontWeight="bold" fontSize="lg" color="blue.600">{instructor.name?.[0]?.toUpperCase()}</Text>
                                        </Flex>
                                        <Box>
                                            <HStack gap={1}>
                                                <Text fontWeight="bold">{instructor.name}</Text>
                                                {instructor.is_verified && (
                                                    <FiShield size={16} title="Verified" />
                                                )}
                                            </HStack>
                                            {instructor.specialization && (
                                                <Text fontSize="sm" color="gray.600">{instructor.specialization}</Text>
                                            )}
                                        </Box>
                                    </HStack>
                                    {instructor.bio && (
                                        <Text fontSize="sm" color="gray.600" noOfLines={3}>{instructor.bio}</Text>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        {/* Pricing Card */}
                        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" position="sticky" top={4}>
                            <Text fontSize="3xl" fontWeight="bold" mb={1}>
                                {cohort.price_amount
                                    ? `${cohort.price_currency ?? 'INR'} ${Number(cohort.price_amount).toLocaleString()}`
                                    : 'Free'}
                            </Text>
                            {cohort.price_amount && (
                                <Text fontSize="sm" color="gray.500" mb={4}>One-time payment</Text>
                            )}

                            <VStack gap={2} align="stretch" mb={5}>
                                {[
                                    `${taskCount} hands-on tasks`,
                                    'Certificate on completion',
                                    'Instructor feedback',
                                    cohort.has_leaderboard ? 'Leaderboard access' : null,
                                    cohort.has_free_audit ? 'Free audit available' : null,
                                ].filter(Boolean).map((item, i) => (
                                    <HStack key={i} gap={2}>
                                        <FiCheckCircle size={16} style={{flexShrink: 0}} />
                                        <Text fontSize="sm">{item}</Text>
                                    </HStack>
                                ))}
                            </VStack>

                            <Link href={`/register/${cohort.slug ?? cohort.id}`}>
                                <Button w="full" colorPalette="blue" size="lg">
                                    Enroll Now
                                </Button>
                            </Link>

                            {cohort.has_waitlist && enrollmentCount >= (cohort.max_students ?? Infinity) && (
                                <Button w="full" variant="outline" mt={2} size="sm">
                                    Join Waitlist
                                </Button>
                            )}
                        </Box>
                    </Box>
                </SimpleGrid>
            </Container>

            {/* Footer */}
            <Box bg="gray.800" color="gray.400" py={8} textAlign="center">
                <Text fontSize="sm">© {new Date().getFullYear()} TILMS. All rights reserved.</Text>
            </Box>
        </>
    );
}

import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Badge,
    Flex,
    Text,
    SimpleGrid,
    VStack,
} from '@chakra-ui/react';
import { FiZap } from 'react-icons/fi';

/* Map badge colour names to Chakra colour schemes */
const BADGE_COLORS = [
    'blue', 'purple', 'green', 'orange', 'teal', 'red', 'pink', 'cyan',
];

function badgeColor(badge, index) {
    if (badge.color && BADGE_COLORS.includes(badge.color)) return badge.color;
    return BADGE_COLORS[index % BADGE_COLORS.length];
}

function BadgeCard({ userBadge, index }) {
    const badge = userBadge.badge ?? userBadge;
    const cohort = userBadge.cohort ?? badge.cohort ?? null;
    const color = badgeColor(badge, index);

    const earnedDate = userBadge.earned_at ?? userBadge.created_at;

    return (
        <Box
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
            p={5}
            textAlign="center"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
        >
            {/* Badge icon — colored circle with first letter */}
            <Flex justify="center" mb={3}>
                <Flex
                    w={16}
                    h={16}
                    bg={`${color}.100`}
                    borderRadius="full"
                    align="center"
                    justify="center"
                    borderWidth="3px"
                    borderColor={`${color}.200`}
                >
                    <Text
                        fontWeight="extrabold"
                        fontSize="2xl"
                        color={`${color}.600`}
                        lineHeight="1"
                    >
                        {(badge.name ?? 'B')[0].toUpperCase()}
                    </Text>
                </Flex>
            </Flex>

            {/* Badge name */}
            <Text fontWeight="bold" fontSize="md" mb={1}>
                {badge.name ?? 'Badge'}
            </Text>

            {/* Description */}
            {badge.description && (
                <Text fontSize="xs" color="gray.500" mb={3} noOfLines={3}>
                    {badge.description}
                </Text>
            )}

            {/* Cohort name */}
            {cohort?.title && (
                <Badge colorScheme={color} variant="subtle" borderRadius="full" px={2} py={0.5} fontSize="xs" mb={2}>
                    {cohort.title}
                </Badge>
            )}

            {/* Earned date */}
            {earnedDate && (
                <Text fontSize="xs" color="gray.400">
                    Earned {new Date(earnedDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                    })}
                </Text>
            )}
        </Box>
    );
}

export default function Index({ badges = [] }) {
    return (
        <StudentLayout title="My Badges">
            <Head title="My Badges" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">My Badges</Text>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        {badges.length} badge{badges.length !== 1 ? 's' : ''} earned
                    </Text>
                </Box>
            </Flex>

            {badges.length === 0 ? (
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
                            bg="orange.50"
                            borderRadius="full"
                            align="center"
                            justify="center"
                        >
                            <FiZap size={32} color="#EA580C" opacity={0.5} />
                        </Flex>
                    </Flex>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
                        No badges yet — but you're on your way!
                    </Text>
                    <Text color="gray.400" maxW="sm" mx="auto">
                        Badges are awarded for completing tasks, streaks, and special milestones.
                        Stay consistent and they'll start rolling in.
                    </Text>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={5}>
                    {badges.map((ub, i) => (
                        <BadgeCard key={ub.id ?? i} userBadge={ub} index={i} />
                    ))}
                </SimpleGrid>
            )}
        </StudentLayout>
    );
}

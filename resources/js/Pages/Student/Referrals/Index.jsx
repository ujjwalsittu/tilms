import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
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
import { FiShare2, FiCopy, FiCheck, FiUsers, FiDollarSign, FiClock, FiGift } from 'react-icons/fi';

const rewardStatusColor = {
    pending: 'yellow',
    approved: 'green',
    paid: 'green',
    rejected: 'red',
    expired: 'gray',
};

function StatCard({ label, value, icon, color, sub }) {
    return (
        <Box
            bg="white"
            p={5}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
        >
            <Flex justify="space-between" align="flex-start">
                <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="semibold" mb={1}>
                        {label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>{value}</Text>
                    {sub && <Text fontSize="xs" color="gray.400" mt={0.5}>{sub}</Text>}
                </Box>
                <Flex
                    w={10}
                    h={10}
                    bg={`${color}.50`}
                    borderRadius="lg"
                    align="center"
                    justify="center"
                    flexShrink={0}
                >
                    {icon}
                </Flex>
            </Flex>
        </Box>
    );
}

export default function Index({ referralCode, rewards = [], stats = {} }) {
    const [copied, setCopied] = useState(false);

    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const totalEarned = Number(stats.total_earned ?? 0);
    const pendingAmount = Number(stats.pending_amount ?? 0);
    const totalReferrals = Number(stats.total_referrals ?? rewards.length ?? 0);

    return (
        <StudentLayout title="Referrals">
            <Head title="Referrals" />
            <FlashMessage />

            {/* Page header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">Referral Program</Text>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        Invite friends and earn rewards for every successful enrollment
                    </Text>
                </Box>
            </Flex>

            {/* Share card */}
            <Box
                bg="purple.700"
                borderRadius="xl"
                p={6}
                mb={8}
                color="white"
                position="relative"
                overflow="hidden"
            >
                {/* Decorative circles */}
                <Box
                    position="absolute"
                    top="-40px"
                    right="-40px"
                    w="160px"
                    h="160px"
                    bg="purple.600"
                    borderRadius="full"
                    opacity={0.4}
                />
                <Box
                    position="absolute"
                    bottom="-30px"
                    right="80px"
                    w="100px"
                    h="100px"
                    bg="purple.500"
                    borderRadius="full"
                    opacity={0.3}
                />

                <Flex gap={3} align="center" mb={4} position="relative">
                    <Flex
                        w={10}
                        h={10}
                        bg="purple.500"
                        borderRadius="lg"
                        align="center"
                        justify="center"
                    >
                        <FiGift size={20} />
                    </Flex>
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">Your Referral Link</Text>
                        <Text fontSize="xs" color="purple.200">
                            Share this link with friends — you earn when they enroll
                        </Text>
                    </Box>
                </Flex>

                {/* Link row */}
                <HStack gap={2} mb={4} position="relative">
                    <Box flex={1} bg="purple.800" borderRadius="md" px={3} py={2} borderWidth="1px" borderColor="purple.600">
                        <Text fontSize="sm" fontFamily="mono" color="purple.100" isTruncated>
                            {referralLink}
                        </Text>
                    </Box>
                    <Button
                        size="sm"
                        bg="white"
                        color="purple.700"
                        _hover={{ bg: 'purple.50' }}
                        onClick={handleCopy}
                        leftIcon={copied ? <FiCheck /> : <FiCopy />}
                        flexShrink={0}
                    >
                        {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                </HStack>

                {/* Code row */}
                <HStack gap={3} position="relative">
                    <Text fontSize="sm" color="purple.200">Referral Code:</Text>
                    <Box bg="purple.800" borderRadius="md" px={3} py={1} borderWidth="1px" borderColor="purple.600">
                        <Text fontWeight="bold" fontFamily="mono" letterSpacing="wider" fontSize="sm">
                            {referralCode}
                        </Text>
                    </Box>
                    <button
                        onClick={handleCopyCode}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D6BCFA', padding: 0 }}
                        title="Copy code"
                    >
                        {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    </button>
                </HStack>
            </Box>

            {/* Stats */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4} mb={8}>
                <StatCard
                    label="Total Referrals"
                    value={totalReferrals}
                    icon={<FiUsers size={18} color="#6B46C1" />}
                    color="purple"
                    sub="All time"
                />
                <StatCard
                    label="Total Earned"
                    value={`₹${totalEarned.toLocaleString()}`}
                    icon={<FiDollarSign size={18} color="#276749" />}
                    color="green"
                    sub="Credited rewards"
                />
                <StatCard
                    label="Pending"
                    value={`₹${pendingAmount.toLocaleString()}`}
                    icon={<FiClock size={18} color="#B7791F" />}
                    color="yellow"
                    sub="Awaiting approval"
                />
            </SimpleGrid>

            {/* How it works */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} mb={8}>
                <Text fontWeight="semibold" fontSize="md" mb={4}>How It Works</Text>
                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
                    {[
                        { step: '1', title: 'Share Your Link', desc: 'Send your referral link or code to friends interested in learning.' },
                        { step: '2', title: 'They Enroll', desc: 'Your friend registers and completes payment for a cohort.' },
                        { step: '3', title: 'You Earn', desc: 'Receive your reward credit once the enrollment is confirmed.' },
                    ].map(item => (
                        <Flex key={item.step} gap={3} align="flex-start">
                            <Flex
                                w={8}
                                h={8}
                                bg="purple.100"
                                borderRadius="full"
                                align="center"
                                justify="center"
                                flexShrink={0}
                            >
                                <Text fontSize="sm" fontWeight="bold" color="purple.700">{item.step}</Text>
                            </Flex>
                            <Box>
                                <Text fontWeight="medium" fontSize="sm">{item.title}</Text>
                                <Text fontSize="xs" color="gray.500" mt={0.5}>{item.desc}</Text>
                            </Box>
                        </Flex>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Referred users list */}
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
                        <Text fontWeight="semibold">Referred Users</Text>
                        {rewards.length > 0 && (
                            <Badge colorScheme="purple" variant="subtle">{rewards.length} referral{rewards.length !== 1 ? 's' : ''}</Badge>
                        )}
                    </Flex>
                </Box>

                {rewards.length === 0 ? (
                    <Box py={12} textAlign="center">
                        <Flex w={14} h={14} bg="purple.50" borderRadius="full" align="center" justify="center" mx="auto" mb={3}>
                            <FiShare2 size={24} color="#6B46C1" />
                        </Flex>
                        <Text fontWeight="medium" mb={1}>No referrals yet</Text>
                        <Text fontSize="sm" color="gray.500">
                            Share your referral link to start earning rewards.
                        </Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table.Root variant="line">
                            <Table.Header>
                                <Table.Row bg="gray.50">
                                    <Table.ColumnHeader>Referred User</Table.ColumnHeader>
                                    <Table.ColumnHeader>Cohort Enrolled</Table.ColumnHeader>
                                    <Table.ColumnHeader>Reward</Table.ColumnHeader>
                                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rewards.map((reward) => (
                                    <Table.Row key={reward.id} _hover={{ bg: 'gray.50' }}>
                                        {/* Referred user */}
                                        <Table.Cell>
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {reward.referred_user?.name ?? '—'}
                                                </Text>
                                                <Text fontSize="xs" color="gray.400">
                                                    {reward.referred_user?.email ?? ''}
                                                </Text>
                                            </VStack>
                                        </Table.Cell>

                                        {/* Cohort */}
                                        <Table.Cell>
                                            <Text fontSize="sm">
                                                {reward.cohort?.title ?? reward.payment?.cohort?.title ?? '—'}
                                            </Text>
                                        </Table.Cell>

                                        {/* Reward amount */}
                                        <Table.Cell>
                                            <Text fontSize="sm" fontWeight="semibold" color="green.600">
                                                {reward.currency ?? 'INR'} {Number(reward.amount ?? 0).toLocaleString()}
                                            </Text>
                                        </Table.Cell>

                                        {/* Status */}
                                        <Table.Cell>
                                            <Badge colorScheme={rewardStatusColor[reward.status] ?? 'gray'} textTransform="capitalize">
                                                {reward.status}
                                            </Badge>
                                        </Table.Cell>

                                        {/* Date */}
                                        <Table.Cell>
                                            <Text fontSize="sm" color="gray.500">
                                                {new Date(reward.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                )}
            </Box>
        </StudentLayout>
    );
}

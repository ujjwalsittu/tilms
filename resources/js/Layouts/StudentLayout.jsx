import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Icon,
    Avatar,
} from '@chakra-ui/react';
import {
    FiHome,
    FiBook,
    FiCode,
    FiMessageCircle,
    FiMic,
    FiAward,
    FiUser,
    FiCreditCard,
    FiLifeBuoy,
    FiShare2,
    FiStar,
    FiTrendingUp,
} from 'react-icons/fi';

const navItems = [
    { label: 'Dashboard', icon: FiHome, href: '/student/dashboard' },
    { label: 'My Cohorts', icon: FiBook, href: '/student/cohorts' },
    { label: 'AI Assistant', icon: FiMessageCircle, href: '/student/ai/doubt' },
    { label: 'Interview Prep', icon: FiMic, href: '/student/ai/interview' },
    { label: 'Progress', icon: FiTrendingUp, href: '/student/progress-reports' },
    { label: 'Certificates', icon: FiAward, href: '/student/certificates' },
    { label: 'Portfolio', icon: FiUser, href: '/student/portfolio/edit' },
    { label: 'Billing', icon: FiCreditCard, href: '/student/billing' },
    { label: 'Support', icon: FiLifeBuoy, href: '/student/support' },
    { label: 'Referrals', icon: FiShare2, href: '/student/referrals' },
    { label: 'Badges', icon: FiStar, href: '/student/badges' },
];

export default function StudentLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <Flex minH="100vh">
            <Box
                as="nav"
                w="250px"
                bg="purple.900"
                color="white"
                position="fixed"
                h="100vh"
                overflowY="auto"
            >
                <Box p={4} borderBottomWidth="1px" borderColor="purple.700">
                    <Text fontSize="xl" fontWeight="bold">TILMS</Text>
                    <Text fontSize="xs" color="purple.300">Student Portal</Text>
                </Box>

                <VStack gap={1} p={2} align="stretch">
                    {navItems.map((item) => (
                        <Link key={item.label} href={item.href}>
                            <HStack
                                px={3}
                                py={2}
                                borderRadius="md"
                                _hover={{ bg: 'purple.700' }}
                                transition="background 0.2s"
                            >
                                <Icon as={item.icon} boxSize={4} />
                                <Text fontSize="sm">{item.label}</Text>
                            </HStack>
                        </Link>
                    ))}
                </VStack>
            </Box>

            <Box ml="250px" flex={1} bg="gray.50" minH="100vh">
                <Flex
                    h="60px"
                    px={6}
                    align="center"
                    justify="space-between"
                    bg="white"
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    position="sticky"
                    top={0}
                    zIndex={10}
                >
                    <Text fontSize="lg" fontWeight="semibold">{title}</Text>
                    <HStack gap={3}>
                        <Text fontSize="sm" color="gray.600">{auth?.user?.name}</Text>
                        <Avatar size="sm" name={auth?.user?.name} />
                    </HStack>
                </Flex>

                <Box p={6}>
                    {children}
                </Box>
            </Box>
        </Flex>
    );
}

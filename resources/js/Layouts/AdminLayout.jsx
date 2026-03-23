import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Icon,
} from '@chakra-ui/react';
import {
    FiHome,
    FiUsers,
    FiSettings,
    FiDollarSign,
    FiCpu,
    FiFileText,
    FiLifeBuoy,
    FiShield,
    FiTag,
    FiCheckCircle,
    FiLogOut,
    FiUser,
} from 'react-icons/fi';

const navItems = [
    { label: 'Dashboard', icon: FiHome, href: '/admin/dashboard', routeName: 'admin.dashboard' },
    { label: 'Instructors', icon: FiUsers, href: '/admin/instructors', routeName: 'admin.instructors.*' },
    { label: 'Students', icon: FiUser, href: '/admin/students', routeName: 'admin.students.*' },
    { label: 'Settings', icon: FiSettings, href: '/admin/settings/platform', routeName: 'admin.settings.*' },
    { label: 'Finance', icon: FiDollarSign, href: '/admin/finance', routeName: 'admin.finance.*' },
    { label: 'AI Usage', icon: FiCpu, href: '/admin/ai-usage', routeName: 'admin.ai-usage.*' },
    { label: 'Audit Logs', icon: FiFileText, href: '/admin/audit-logs', routeName: 'admin.audit-logs.*' },
    { label: 'Support', icon: FiLifeBuoy, href: '/admin/support-tickets', routeName: 'admin.support.*' },
    { label: 'Partners', icon: FiShield, href: '/admin/partners', routeName: 'admin.partners.*' },
    { label: 'Coupons', icon: FiTag, href: '/admin/coupons', routeName: 'admin.coupons.*' },
    { label: 'ID Verification', icon: FiCheckCircle, href: '/admin/id-verification', routeName: 'admin.id-verification.*' },
];

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <Flex minH="100vh">
            {/* Sidebar */}
            <Box
                as="nav"
                w="250px"
                bg="gray.900"
                color="white"
                position="fixed"
                h="100vh"
                overflowY="auto"
            >
                <Box p={4} borderBottomWidth="1px" borderColor="gray.700">
                    <Text fontSize="xl" fontWeight="bold">TILMS</Text>
                    <Text fontSize="xs" color="gray.400">Admin Panel</Text>
                </Box>

                <VStack gap={1} p={2} align="stretch">
                    {navItems.map((item) => (
                        <Link key={item.label} href={item.href}>
                            <HStack
                                px={3}
                                py={2}
                                borderRadius="md"
                                _hover={{ bg: 'gray.700' }}
                                transition="background 0.2s"
                            >
                                <Icon as={item.icon} boxSize={4} />
                                <Text fontSize="sm">{item.label}</Text>
                            </HStack>
                        </Link>
                    ))}
                </VStack>
            </Box>

            {/* Main content */}
            <Box ml="250px" flex={1} bg="gray.50" minH="100vh">
                {/* Top bar */}
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
                        <Flex w={8} h={8} bg="blue.500" borderRadius="full" align="center" justify="center">
                            <Text fontSize="sm" color="white" fontWeight="bold">{auth?.user?.name?.[0]?.toUpperCase()}</Text>
                        </Flex>
                    </HStack>
                </Flex>

                {/* Page content */}
                <Box p={6}>
                    {children}
                </Box>
            </Box>
        </Flex>
    );
}

import { Link, usePage, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Flex,
    VStack,
    HStack,
    Text,
} from '@chakra-ui/react';
import {
    FiHome,
    FiBook,
    FiDatabase,
    FiCheckSquare,
    FiClock,
    FiDollarSign,
    FiLogOut,
} from 'react-icons/fi';

// Note: Announcements, Newsletter, and Students are cohort-scoped.
// Access them via Cohorts > select a cohort.
const navItems = [
    { label: 'Dashboard', icon: FiHome, href: '/instructor/dashboard' },
    { label: 'Cohorts', icon: FiBook, href: '/instructor/cohorts' },
    { label: 'Task Bank', icon: FiDatabase, href: '/instructor/tasks' },
    { label: 'Submissions', icon: FiCheckSquare, href: '/instructor/submissions' },
    { label: 'Office Hours', icon: FiClock, href: '/instructor/office-hours' },
    { label: 'Finance', icon: FiDollarSign, href: '/instructor/finance' },
];

export default function InstructorLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <Flex minH="100vh">
            <Box
                as="nav"
                w="250px"
                bg="blue.900"
                color="white"
                position="fixed"
                h="100vh"
                overflowY="auto"
            >
                <Box p={4} borderBottomWidth="1px" borderColor="blue.700">
                    <Text fontSize="xl" fontWeight="bold">TILMS</Text>
                    <Text fontSize="xs" color="blue.300">Instructor Panel</Text>
                </Box>

                <VStack gap={1} p={2} align="stretch">
                    {navItems.map((item) => {
                        const IconComp = item.icon;
                        return (
                            <Link key={item.label} href={item.href}>
                                <HStack
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                    _hover={{ bg: 'blue.700' }}
                                    transition="background 0.2s"
                                >
                                    <IconComp size={16} />
                                    <Text fontSize="sm">{item.label}</Text>
                                </HStack>
                            </Link>
                        );
                    })}
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
                        <Flex w={8} h={8} bg="blue.500" borderRadius="full" align="center" justify="center">
                            <Text fontSize="sm" color="white" fontWeight="bold">{auth?.user?.name?.[0]?.toUpperCase()}</Text>
                        </Flex>
                        <Button size="sm" variant="ghost" color="gray.500" onClick={() => router.post(route('logout'))}>
                            <FiLogOut size={16} /> Logout
                        </Button>
                    </HStack>
                </Flex>

                <Box p={6}>
                    {children}
                </Box>
            </Box>
        </Flex>
    );
}

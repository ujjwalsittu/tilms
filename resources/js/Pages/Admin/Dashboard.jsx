import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    SimpleGrid,
    Box,
    Text,
    Flex,
} from '@chakra-ui/react';
import { FiUsers, FiBook, FiDollarSign, FiCpu } from 'react-icons/fi';

function StatCard({ label, value, icon: IconComp, color }) {
    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                    <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                </Box>
                <Flex
                    w={12}
                    h={12}
                    bg={`${color}.50`}
                    borderRadius="lg"
                    align="center"
                    justify="center"
                >
                    <IconComp size={24} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default function Dashboard({ stats, recentActivity }) {
    const totalStudents = stats?.total_students ?? 0;
    const activeCohorts = stats?.active_cohorts ?? 0;
    const revenueMtd = stats?.revenue_mtd ?? 0;
    const aiApiCalls = stats?.ai_api_calls ?? 0;
    const pendingVerifications = stats?.pending_verifications ?? 0;
    const openTickets = stats?.open_tickets ?? 0;

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
                <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon={FiUsers} color="blue" />
                <StatCard label="Active Cohorts" value={activeCohorts.toLocaleString()} icon={FiBook} color="green" />
                <StatCard label="Revenue (MTD)" value={`₹${Number(revenueMtd).toLocaleString()}`} icon={FiDollarSign} color="purple" />
                <StatCard label="AI API Calls" value={aiApiCalls.toLocaleString()} icon={FiCpu} color="orange" />
            </SimpleGrid>

            {(pendingVerifications > 0 || openTickets > 0) && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
                    {pendingVerifications > 0 && (
                        <StatCard label="Pending ID Verifications" value={pendingVerifications} icon={FiUsers} color="red" />
                    )}
                    {openTickets > 0 && (
                        <StatCard label="Open Support Tickets" value={openTickets} icon={FiBook} color="yellow" />
                    )}
                </SimpleGrid>
            )}

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Text fontWeight="semibold" mb={4}>Recent Activity</Text>
                    {recentActivity && recentActivity.length > 0 ? (
                        <Box>
                            {recentActivity.map((activity, i) => (
                                <Box
                                    key={i}
                                    py={2}
                                    borderBottomWidth={i < recentActivity.length - 1 ? '1px' : '0'}
                                    borderColor="gray.100"
                                >
                                    <Flex justify="space-between" align="flex-start">
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium">{activity.description ?? activity.action}</Text>
                                            {activity.user && (
                                                <Text fontSize="xs" color="gray.500">{activity.user.name}</Text>
                                            )}
                                        </Box>
                                        <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" ml={3}>
                                            {activity.created_at
                                                ? new Date(activity.created_at).toLocaleString()
                                                : ''}
                                        </Text>
                                    </Flex>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No recent activity yet.</Text>
                    )}
                </Box>
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <Text fontWeight="semibold" mb={4}>Pending Actions</Text>
                    {(pendingVerifications > 0 || openTickets > 0) ? (
                        <Box>
                            {pendingVerifications > 0 && (
                                <Flex justify="space-between" align="center" py={2} borderBottomWidth="1px" borderColor="gray.100">
                                    <Text fontSize="sm">{pendingVerifications} ID verification{pendingVerifications !== 1 ? 's' : ''} awaiting review</Text>
                                    <Text fontSize="xs" color="red.500" fontWeight="medium">Action needed</Text>
                                </Flex>
                            )}
                            {openTickets > 0 && (
                                <Flex justify="space-between" align="center" py={2}>
                                    <Text fontSize="sm">{openTickets} open support ticket{openTickets !== 1 ? 's' : ''}</Text>
                                    <Text fontSize="xs" color="orange.500" fontWeight="medium">Needs attention</Text>
                                </Flex>
                            )}
                        </Box>
                    ) : (
                        <Text color="gray.500" fontSize="sm">No pending actions.</Text>
                    )}
                </Box>
            </SimpleGrid>
        </AdminLayout>
    );
}

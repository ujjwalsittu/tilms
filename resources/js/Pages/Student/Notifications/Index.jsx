import { Head, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import {
    Box, Button, Flex, Text, VStack, HStack, Badge,
} from '@chakra-ui/react';
import {
    FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiDollarSign, FiBook,
} from 'react-icons/fi';

const TYPE_ICON_MAP = {
    payment: FiDollarSign,
    enrollment: FiBook,
    alert: FiAlertCircle,
    success: FiCheckCircle,
    info: FiInfo,
};

function notificationIcon(type) {
    const key = type?.split('\\').pop()?.toLowerCase() ?? 'info';
    for (const [prefix, Icon] of Object.entries(TYPE_ICON_MAP)) {
        if (key.includes(prefix)) return <Icon size={18} />;
    }
    return <FiBell size={18} />;
}

function notificationMessage(notification) {
    return (
        notification.data?.message
        ?? notification.data?.body
        ?? notification.data?.title
        ?? 'You have a new notification.'
    );
}

function NotificationCard({ notification, onMarkRead }) {
    const isUnread = !notification.read_at;

    return (
        <Box
            bg={isUnread ? 'white' : 'gray.50'}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={isUnread ? 'gray.200' : 'gray.100'}
            borderLeftWidth={isUnread ? '4px' : '1px'}
            borderLeftColor={isUnread ? 'blue.400' : 'gray.100'}
            p={4}
            transition="all 0.15s"
            _hover={{ boxShadow: 'sm' }}
        >
            <Flex justify="space-between" align="flex-start" gap={3}>
                <HStack gap={3} align="flex-start" flex={1}>
                    <Flex
                        w={9}
                        h={9}
                        bg={isUnread ? 'blue.50' : 'gray.100'}
                        borderRadius="full"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        color={isUnread ? 'blue.500' : 'gray.400'}
                    >
                        {notificationIcon(notification.type)}
                    </Flex>

                    <Box flex={1}>
                        <Text
                            fontSize="sm"
                            fontWeight={isUnread ? 'medium' : 'normal'}
                            color={isUnread ? 'gray.800' : 'gray.600'}
                            mb={1}
                        >
                            {notificationMessage(notification)}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                            {notification.created_at
                                ? new Date(notification.created_at).toLocaleString()
                                : '—'}
                        </Text>
                    </Box>
                </HStack>

                {isUnread && (
                    <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="blue"
                        flexShrink={0}
                        onClick={() => onMarkRead(notification.id)}
                    >
                        Mark read
                    </Button>
                )}
            </Flex>
        </Box>
    );
}

export default function NotificationsIndex({ notifications }) {
    const handleMarkAllRead = () => {
        router.post(route('student.notifications.mark-all-read'));
    };

    const handleMarkRead = (id) => {
        router.put(route('student.notifications.read', id));
    };

    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    return (
        <StudentLayout title="Notifications">
            <Head title="Notifications" />
            <FlashMessage />

            <Flex justify="space-between" align="center" mb={6}>
                <HStack gap={3}>
                    <Text fontSize="2xl" fontWeight="bold">Notifications</Text>
                    {unreadCount > 0 && (
                        <Badge colorPalette="blue" borderRadius="full" px={2}>
                            {unreadCount} unread
                        </Badge>
                    )}
                </HStack>
                {unreadCount > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        colorPalette="blue"
                        onClick={handleMarkAllRead}
                    >
                        <FiCheckCircle />
                        Mark All Read
                    </Button>
                )}
            </Flex>

            {notifications.data.length === 0 ? (
                <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center" borderWidth="1px" borderStyle="dashed">
                    <Flex w={14} h={14} bg="blue.50" borderRadius="full" align="center" justify="center" mx="auto" mb={3}>
                        <FiBell size={24} color="#3182CE" />
                    </Flex>
                    <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={1}>
                        No notifications yet
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                        You'll see updates about your courses, payments, and more here.
                    </Text>
                </Box>
            ) : (
                <VStack gap={3} align="stretch">
                    {notifications.data.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onMarkRead={handleMarkRead}
                        />
                    ))}

                    {notifications.last_page > 1 && (
                        <Pagination
                            links={notifications.links}
                            currentPage={notifications.current_page}
                            lastPage={notifications.last_page}
                        />
                    )}
                </VStack>
            )}
        </StudentLayout>
    );
}

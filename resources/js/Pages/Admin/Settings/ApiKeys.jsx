import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Box, Button, Input, Text, Flex, Badge, HStack, VStack } from '@chakra-ui/react';
import { FiKey, FiSave } from 'react-icons/fi';
import { useState } from 'react';

const SERVICE_LABELS = {
    claude: 'Claude AI (Anthropic)',
    resend: 'Resend (Email)',
    razorpay: 'Razorpay (Payments)',
    github: 'GitHub',
};

function KeyRow({ apiKey }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        router.put(route('admin.settings.api-keys.update', apiKey.id), {
            value: value,
            is_active: apiKey.is_active,
        }, {
            preserveState: true,
            onSuccess: () => { setEditing(false); setValue(''); setSaving(false); },
            onError: () => setSaving(false),
        });
    };

    const handleToggleActive = () => {
        router.put(route('admin.settings.api-keys.update', apiKey.id), {
            is_active: !apiKey.is_active,
        }, { preserveState: true });
    };

    return (
        <Box p={4} borderBottomWidth="1px" borderColor="gray.100" _last={{ borderBottomWidth: 0 }}>
            <Flex justify="space-between" align="center" mb={editing ? 3 : 0}>
                <Box>
                    <HStack gap={2} mb={1}>
                        <Text fontWeight="semibold" fontSize="sm">{apiKey.key_name}</Text>
                        <Badge colorPalette={apiKey.is_active ? 'green' : 'gray'} variant="subtle" fontSize="xs">
                            {apiKey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge colorPalette="blue" variant="outline" fontSize="xs">{apiKey.environment}</Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" fontFamily="mono">{apiKey.masked_value}</Text>
                </Box>
                <HStack gap={2}>
                    <Button size="xs" variant="outline" onClick={handleToggleActive}>
                        {apiKey.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="xs" colorPalette="blue" onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Update Key'}
                    </Button>
                </HStack>
            </Flex>

            {editing && (
                <HStack gap={2}>
                    <Input
                        type="password"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter new API key value..."
                        size="sm"
                    />
                    <Button size="sm" colorPalette="green" onClick={handleSave} loading={saving} disabled={!value}>
                        <FiSave size={14} /> Save
                    </Button>
                </HStack>
            )}
        </Box>
    );
}

export default function ApiKeys({ apiKeys = [] }) {
    const grouped = {};
    apiKeys.forEach(key => {
        const svc = key.service || 'other';
        if (!grouped[svc]) grouped[svc] = [];
        grouped[svc].push(key);
    });

    return (
        <AdminLayout title="API Keys">
            <Head title="API Keys" />
            <FlashMessage />

            <Box maxW="3xl">
                <Text color="gray.500" fontSize="sm" mb={6}>
                    Configure API keys for third-party services. Keys are stored encrypted in the database.
                </Text>

                <VStack gap={4} align="stretch">
                    {Object.entries(grouped).map(([service, keys]) => (
                        <Box key={service} bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                            <Box px={4} py={3} bg="gray.50" borderBottomWidth="1px">
                                <HStack gap={2}>
                                    <FiKey size={16} />
                                    <Text fontWeight="semibold" fontSize="sm">
                                        {SERVICE_LABELS[service] || service}
                                    </Text>
                                </HStack>
                            </Box>
                            {keys.map(key => (
                                <KeyRow key={key.id} apiKey={key} />
                            ))}
                        </Box>
                    ))}

                    {apiKeys.length === 0 && (
                        <Box bg="white" p={8} borderRadius="lg" textAlign="center" borderWidth="1px">
                            <Text color="gray.500">No API keys configured. Run database seeders to create key placeholders.</Text>
                        </Box>
                    )}
                </VStack>
            </Box>
        </AdminLayout>
    );
}

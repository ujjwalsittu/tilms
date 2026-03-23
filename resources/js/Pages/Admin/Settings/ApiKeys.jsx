import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Input, Text, Flex, Badge, HStack, VStack, Table,
} from '@chakra-ui/react';
import { FiEdit2, FiCheck, FiX, FiKey } from 'react-icons/fi';
import { useState } from 'react';

const ENV_BADGE = {
    production: 'green',
    live: 'green',
    staging: 'yellow',
    sandbox: 'yellow',
    development: 'blue',
    test: 'blue',
};

const SERVICE_ORDER = ['Claude AI', 'Razorpay', 'Resend', 'GitHub'];

function groupByService(apiKeys) {
    const groups = {};
    for (const key of apiKeys) {
        const svc = key.service ?? 'Other';
        if (!groups[svc]) groups[svc] = [];
        groups[svc].push(key);
    }
    // Sort by known service order, then alphabetically
    const ordered = {};
    for (const svc of SERVICE_ORDER) {
        if (groups[svc]) ordered[svc] = groups[svc];
    }
    for (const svc of Object.keys(groups).sort()) {
        if (!ordered[svc]) ordered[svc] = groups[svc];
    }
    return ordered;
}

function EditKeyRow({ apiKey, onCancel, onSaved }) {
    const [formData, setFormData] = useState({
        key_name: apiKey.key_name ?? '',
        value: '',
        is_active: apiKey.is_active ?? true,
        environment: apiKey.environment ?? 'production',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.put(
            route('admin.settings.api-keys.update', apiKey.id),
            {
                key_name: formData.key_name,
                value: formData.value || undefined,
                is_active: formData.is_active,
                environment: formData.environment,
            },
            {
                onSuccess: () => { setProcessing(false); onSaved(); },
                onError: (errs) => { setErrors(errs); setProcessing(false); },
            }
        );
    };

    return (
        <Table.Row bg="blue.50">
            <Table.Cell colSpan={6}>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3} p={2}>
                        <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                            Editing: {apiKey.service} — {apiKey.key_name}
                        </Text>

                        <Flex gap={3} flexWrap="wrap">
                            {/* Key Name */}
                            <Box minW="180px" flex={1}>
                                <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Key Name</Text>
                                <Input
                                    size="sm"
                                    value={formData.key_name}
                                    onChange={e => set('key_name', e.target.value)}
                                    placeholder="Key name"
                                />
                                {errors.key_name && <Text color="red.500" fontSize="xs" mt={1}>{errors.key_name}</Text>}
                            </Box>

                            {/* New Value */}
                            <Box minW="220px" flex={2}>
                                <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>New Value <Text as="span" color="gray.400">(leave blank to keep current)</Text></Text>
                                <Input
                                    type="password"
                                    size="sm"
                                    value={formData.value}
                                    onChange={e => set('value', e.target.value)}
                                    placeholder="Enter new API key value"
                                    autoFocus
                                />
                                {errors.value && <Text color="red.500" fontSize="xs" mt={1}>{errors.value}</Text>}
                            </Box>

                            {/* Environment */}
                            <Box minW="140px">
                                <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Environment</Text>
                                <select
                                    value={formData.environment}
                                    onChange={e => set('environment', e.target.value)}
                                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', height: '32px' }}
                                >
                                    <option value="production">Production</option>
                                    <option value="staging">Staging</option>
                                    <option value="development">Development</option>
                                </select>
                                {errors.environment && <Text color="red.500" fontSize="xs" mt={1}>{errors.environment}</Text>}
                            </Box>

                            {/* Active */}
                            <Box minW="100px">
                                <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>Active</Text>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', height: '32px' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={e => set('is_active', e.target.checked)}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                    <Text fontSize="sm">{formData.is_active ? 'Active' : 'Inactive'}</Text>
                                </label>
                            </Box>
                        </Flex>

                        <HStack gap={2}>
                            <Button type="submit" size="sm" colorPalette="green" disabled={processing}>
                                <FiCheck size={14} />
                                {processing ? 'Saving…' : 'Save Changes'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={onCancel} disabled={processing}>
                                <FiX size={14} />
                                Cancel
                            </Button>
                        </HStack>
                    </VStack>
                </form>
            </Table.Cell>
        </Table.Row>
    );
}

export default function ApiKeys({ apiKeys = [] }) {
    const [editingId, setEditingId] = useState(null);
    const grouped = groupByService(apiKeys);

    return (
        <AdminLayout title="API Keys">
            <Head title="API Keys - Admin" />
            <FlashMessage />

            <Box mb={4}>
                <Text fontSize="2xl" fontWeight="bold">API Key Management</Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                    Manage encrypted API keys for all third-party services. Keys are stored encrypted in the database.
                </Text>
            </Box>

            {apiKeys.length === 0 ? (
                <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={12} textAlign="center">
                    <Flex w={14} h={14} bg="blue.50" borderRadius="full" align="center" justify="center" mx="auto" mb={3}>
                        <FiKey size={24} color="#3182CE" />
                    </Flex>
                    <Text fontWeight="medium" mb={1}>No API keys configured</Text>
                    <Text fontSize="sm" color="gray.500">
                        Seed the database to populate default API key entries.
                    </Text>
                </Box>
            ) : (
                <VStack gap={6} align="stretch">
                    {Object.entries(grouped).map(([service, keys]) => (
                        <Box key={service} bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" overflow="hidden">
                            <Flex px={5} py={3} bg="gray.50" borderBottomWidth="1px" borderColor="gray.200" align="center" gap={2}>
                                <FiKey size={15} color="#6B7280" />
                                <Text fontWeight="semibold" fontSize="sm">{service}</Text>
                                <Badge colorPalette="gray" size="sm" ml={1}>{keys.length} key{keys.length !== 1 ? 's' : ''}</Badge>
                            </Flex>

                            <Box overflowX="auto">
                                <Table.Root size="sm" variant="outline">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>Key Name</Table.ColumnHeader>
                                            <Table.ColumnHeader>Current Value</Table.ColumnHeader>
                                            <Table.ColumnHeader>Environment</Table.ColumnHeader>
                                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                                            <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {keys.map((key) => (
                                            editingId === key.id ? (
                                                <EditKeyRow
                                                    key={key.id}
                                                    apiKey={key}
                                                    onCancel={() => setEditingId(null)}
                                                    onSaved={() => setEditingId(null)}
                                                />
                                            ) : (
                                                <Table.Row key={key.id} _hover={{ bg: 'gray.50' }}>
                                                    <Table.Cell>
                                                        <Text fontSize="sm" fontWeight="medium">{key.key_name}</Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Text fontFamily="mono" fontSize="xs" color="gray.500" letterSpacing="wide">
                                                            {key.masked_value || '••••••••••••'}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Badge
                                                            colorPalette={ENV_BADGE[key.environment] ?? 'gray'}
                                                            size="sm"
                                                            textTransform="capitalize"
                                                        >
                                                            {key.environment ?? '—'}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Badge colorPalette={key.is_active ? 'green' : 'red'} size="sm">
                                                            {key.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                            colorPalette="blue"
                                                            onClick={() => setEditingId(key.id)}
                                                        >
                                                            <FiEdit2 size={12} />
                                                            Edit
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Box>
                    ))}
                </VStack>
            )}
        </AdminLayout>
    );
}

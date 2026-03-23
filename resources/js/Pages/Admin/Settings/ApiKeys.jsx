import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, Text, Flex, Badge, HStack, VStack,
    Table,
} from '@chakra-ui/react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useState } from 'react';

function EditKeyRow({ apiKey, onCancel, onSaved }) {
    const { data, setData, put, processing, errors } = useForm({
        value: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.api-keys.update', apiKey.id), {
            onSuccess: onSaved,
        });
    };

    return (
        <Table.Row bg="blue.50">
            <Table.Cell colSpan={5}>
                <form onSubmit={handleSubmit}>
                    <HStack gap={3}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" minW="32">
                            {apiKey.service} — {apiKey.key_name}
                        </Text>
                        <Input
                            type="password"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            placeholder="Enter new API key value"
                            size="sm"
                            maxW="sm"
                            autoFocus
                        />
                        {errors.value && <Text color="red.500" fontSize="xs">{errors.value}</Text>}
                        <HStack gap={1}>
                            <Button type="submit" size="sm" colorPalette="green" loading={processing}>
                                <FiCheck /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={onCancel}>
                                <FiX /> Cancel
                            </Button>
                        </HStack>
                    </HStack>
                </form>
            </Table.Cell>
        </Table.Row>
    );
}

export default function ApiKeys({ apiKeys }) {
    const [editingId, setEditingId] = useState(null);

    const handleToggleActive = (key) => {
        router.patch(route('admin.settings.api-keys.toggle', key.id), {}, { preserveState: true });
    };

    const envBadgeColor = (env) => {
        switch (env) {
            case 'production': return 'green';
            case 'sandbox': return 'yellow';
            case 'test': return 'blue';
            default: return 'gray';
        }
    };

    return (
        <AdminLayout title="API Keys">
            <Head title="API Keys - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Text fontSize="xl" fontWeight="bold" mb={6}>API Key Management</Text>

                <Box overflowX="auto">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Service</Table.ColumnHeader>
                                <Table.ColumnHeader>Key Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Value</Table.ColumnHeader>
                                <Table.ColumnHeader>Environment</Table.ColumnHeader>
                                <Table.ColumnHeader>Active</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {apiKeys.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <Text color="gray.500" textAlign="center" py={4}>No API keys configured.</Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                apiKeys.map((key) => (
                                    editingId === key.id ? (
                                        <EditKeyRow
                                            key={key.id}
                                            apiKey={key}
                                            onCancel={() => setEditingId(null)}
                                            onSaved={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <Table.Row key={key.id}>
                                            <Table.Cell fontWeight="medium">{key.service}</Table.Cell>
                                            <Table.Cell>{key.key_name}</Table.Cell>
                                            <Table.Cell>
                                                <Text fontFamily="mono" fontSize="xs" color="gray.600">{key.masked_value}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={envBadgeColor(key.environment)} size="sm">
                                                    {key.environment}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={key.is_active ? 'green' : 'red'} size="sm">
                                                    {key.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <HStack gap={1}>
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        colorPalette="blue"
                                                        onClick={() => setEditingId(key.id)}
                                                    >
                                                        <FiEdit2 /> Update
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        colorPalette={key.is_active ? 'red' : 'green'}
                                                        onClick={() => handleToggleActive(key)}
                                                    >
                                                        {key.is_active ? 'Disable' : 'Enable'}
                                                    </Button>
                                                </HStack>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>
        </AdminLayout>
    );
}

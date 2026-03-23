import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, Text, Flex, Badge, HStack, VStack,
    Table, Textarea, Field,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

function CreateTemplateForm({ onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        layout_json: '',
        background_image: null,
        signature_image: null,
        is_default: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.certificate-templates.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess && onSuccess();
            },
        });
    };

    return (
        <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} mb={6}>
            <Text fontWeight="semibold" fontSize="lg" mb={4}>Create New Template</Text>
            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root invalid={!!errors.name}>
                        <Field.Label>Template Name</Field.Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Default Certificate"
                        />
                        {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.layout_json}>
                        <Field.Label>Layout JSON</Field.Label>
                        <Textarea
                            value={data.layout_json}
                            onChange={(e) => setData('layout_json', e.target.value)}
                            placeholder='{"width": 800, "height": 600, "elements": []}'
                            rows={5}
                            fontFamily="mono"
                            fontSize="sm"
                        />
                        {errors.layout_json && <Field.ErrorText>{errors.layout_json}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.background_image}>
                        <Field.Label>Background Image</Field.Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('background_image', e.target.files[0])}
                            p={1}
                        />
                        {errors.background_image && <Field.ErrorText>{errors.background_image}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.signature_image}>
                        <Field.Label>Signature Image</Field.Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('signature_image', e.target.files[0])}
                            p={1}
                        />
                        {errors.signature_image && <Field.ErrorText>{errors.signature_image}</Field.ErrorText>}
                    </Field.Root>

                    <Flex>
                        <Button type="submit" colorPalette="blue" loading={processing} size="sm">
                            Create Template
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </Box>
    );
}

function EditTemplateModal({ template, onCancel, onSaved }) {
    const { data, setData, put, processing, errors } = useForm({
        name: template.name ?? '',
        layout_json: template.layout_json ?? '',
        background_image: null,
        signature_image: null,
        is_default: template.is_default ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.certificate-templates.update', template.id), {
            forceFormData: true,
            onSuccess: onSaved,
        });
    };

    return (
        <Box bg="blue.50" borderRadius="lg" borderWidth="1px" borderColor="blue.200" p={5} mb={4}>
            <Text fontWeight="semibold" mb={3}>Edit Template: {template.name}</Text>
            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root invalid={!!errors.name}>
                        <Field.Label>Name</Field.Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.layout_json}>
                        <Field.Label>Layout JSON</Field.Label>
                        <Textarea
                            value={data.layout_json}
                            onChange={(e) => setData('layout_json', e.target.value)}
                            rows={5}
                            fontFamily="mono"
                            fontSize="sm"
                        />
                        {errors.layout_json && <Field.ErrorText>{errors.layout_json}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.background_image}>
                        <Field.Label>New Background Image (optional)</Field.Label>
                        <Input type="file" accept="image/*" onChange={(e) => setData('background_image', e.target.files[0])} p={1} />
                        {errors.background_image && <Field.ErrorText>{errors.background_image}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.signature_image}>
                        <Field.Label>New Signature Image (optional)</Field.Label>
                        <Input type="file" accept="image/*" onChange={(e) => setData('signature_image', e.target.files[0])} p={1} />
                        {errors.signature_image && <Field.ErrorText>{errors.signature_image}</Field.ErrorText>}
                    </Field.Root>

                    <HStack gap={2}>
                        <Button type="submit" colorPalette="blue" size="sm" loading={processing}>Save</Button>
                        <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}

export default function CertificateTemplates({ templates }) {
    const [editingId, setEditingId] = useState(null);

    const handleDelete = (template) => {
        if (confirm(`Delete template "${template.name}"? This cannot be undone.`)) {
            router.delete(route('admin.certificate-templates.destroy', template.id));
        }
    };

    const handleSetDefault = (template) => {
        router.patch(route('admin.certificate-templates.set-default', template.id));
    };

    return (
        <AdminLayout title="Certificate Templates">
            <Head title="Certificate Templates - Admin" />

            <CreateTemplateForm />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6}>
                <Text fontWeight="semibold" fontSize="lg" mb={4}>Templates ({templates.length})</Text>

                {templates.length === 0 ? (
                    <Text color="gray.500" fontSize="sm">No templates created yet.</Text>
                ) : (
                    <VStack gap={3} align="stretch">
                        {templates.map((template) => (
                            editingId === template.id ? (
                                <EditTemplateModal
                                    key={template.id}
                                    template={template}
                                    onCancel={() => setEditingId(null)}
                                    onSaved={() => setEditingId(null)}
                                />
                            ) : (
                                <Box
                                    key={template.id}
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    p={4}
                                >
                                    <Flex justify="space-between" align="center">
                                        <HStack gap={3}>
                                            <Text fontWeight="medium">{template.name}</Text>
                                            {template.is_default && (
                                                <Badge colorPalette="green" size="sm">Default</Badge>
                                            )}
                                        </HStack>
                                        <HStack gap={2}>
                                            {!template.is_default && (
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    colorPalette="green"
                                                    onClick={() => handleSetDefault(template)}
                                                >
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                colorPalette="blue"
                                                onClick={() => setEditingId(template.id)}
                                            >
                                                <FiEdit2 /> Edit
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                colorPalette="red"
                                                onClick={() => handleDelete(template)}
                                                disabled={template.is_default}
                                            >
                                                <FiTrash2 /> Delete
                                            </Button>
                                        </HStack>
                                    </Flex>
                                    {template.background_image_path && (
                                        <Text fontSize="xs" color="gray.400" mt={1}>
                                            Background: {template.background_image_path}
                                        </Text>
                                    )}
                                </Box>
                            )
                        ))}
                    </VStack>
                )}
            </Box>
        </AdminLayout>
    );
}

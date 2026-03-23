import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, VStack, Text, Flex, Field,
} from '@chakra-ui/react';

export default function PlatformSettings({ settings }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        platform_name: settings?.platform_name ?? '',
        logo: null,
        theme_color: settings?.theme_color ?? '#3B82F6',
        signatory_name: settings?.signatory_name ?? '',
        signatory_position: settings?.signatory_position ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.platform.update'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Platform Settings">
            <Head title="Platform Settings - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} maxW="2xl">
                <Text fontSize="xl" fontWeight="bold" mb={6}>Platform Settings</Text>

                <form onSubmit={handleSubmit}>
                    <VStack gap={5} align="stretch">
                        <Field.Root invalid={!!errors.platform_name}>
                            <Field.Label>Platform Name</Field.Label>
                            <Input
                                value={data.platform_name}
                                onChange={(e) => setData('platform_name', e.target.value)}
                                placeholder="e.g. TILMS"
                            />
                            {errors.platform_name && <Field.ErrorText>{errors.platform_name}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.logo}>
                            <Field.Label>Logo</Field.Label>
                            {settings?.logo_path && (
                                <Box mb={2}>
                                    <Text fontSize="sm" color="gray.500" mb={1}>Current logo:</Text>
                                    <img
                                        src={`/storage/${settings.logo_path}`}
                                        alt="Current logo"
                                        style={{ height: 48, objectFit: 'contain' }}
                                    />
                                </Box>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('logo', e.target.files[0])}
                                p={1}
                            />
                            {errors.logo && <Field.ErrorText>{errors.logo}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.theme_color}>
                            <Field.Label>Theme Color</Field.Label>
                            <Flex gap={3} align="center">
                                <Input
                                    type="color"
                                    value={data.theme_color}
                                    onChange={(e) => setData('theme_color', e.target.value)}
                                    w="16"
                                    h="10"
                                    p={1}
                                    cursor="pointer"
                                />
                                <Input
                                    value={data.theme_color}
                                    onChange={(e) => setData('theme_color', e.target.value)}
                                    placeholder="#3B82F6"
                                    maxW="xs"
                                />
                            </Flex>
                            {errors.theme_color && <Field.ErrorText>{errors.theme_color}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.signatory_name}>
                            <Field.Label>Certificate Signatory Name</Field.Label>
                            <Input
                                value={data.signatory_name}
                                onChange={(e) => setData('signatory_name', e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                            {errors.signatory_name && <Field.ErrorText>{errors.signatory_name}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.signatory_position}>
                            <Field.Label>Certificate Signatory Position</Field.Label>
                            <Input
                                value={data.signatory_position}
                                onChange={(e) => setData('signatory_position', e.target.value)}
                                placeholder="e.g. Director of Education"
                            />
                            {errors.signatory_position && <Field.ErrorText>{errors.signatory_position}</Field.ErrorText>}
                        </Field.Root>

                        <Flex gap={3} align="center" pt={2}>
                            <Button type="submit" colorPalette="blue" loading={processing}>
                                Save Settings
                            </Button>
                            {recentlySuccessful && (
                                <Text color="green.500" fontSize="sm">Settings saved successfully!</Text>
                            )}
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </AdminLayout>
    );
}

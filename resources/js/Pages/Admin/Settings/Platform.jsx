import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { Box, Button, Input, VStack, Text, Flex, Heading } from '@chakra-ui/react';

function SectionHeading({ children }) {
    return (
        <Heading size="md" mt={4} mb={2} pb={2} borderBottomWidth="1px" borderColor="gray.200">
            {children}
        </Heading>
    );
}

function Field({ label, error, children, description }) {
    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>{label}</Text>
            {children}
            {description && <Text fontSize="xs" color="gray.500" mt={1}>{description}</Text>}
            {error && <Text fontSize="sm" color="red.500" mt={1}>{error}</Text>}
        </Box>
    );
}

export default function Platform({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        platform_name: settings.platform_name || 'TILMS',
        theme_color: settings.theme_color || '#4F46E5',
        signatory_name: settings.signatory_name || '',
        signatory_position: settings.signatory_position || '',
        mail_from_address: settings.mail_from_address || '',
        mail_from_name: settings.mail_from_name || '',
        claude_default_model: settings.claude_default_model || 'claude-sonnet-4-20250514',
        razorpay_environment: settings.razorpay_environment || 'test',
        logo: null,
        _method: 'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.platform.update'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Platform Settings">
            <Head title="Platform Settings" />
            <FlashMessage />

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" maxW="2xl">
                <form onSubmit={handleSubmit}>
                    <VStack gap={4} align="stretch">

                        {/* Branding */}
                        <SectionHeading>Branding</SectionHeading>

                        <Field label="Platform Name" error={errors.platform_name}>
                            <Input value={data.platform_name} onChange={e => setData('platform_name', e.target.value)} />
                        </Field>

                        <Field label="Logo" error={errors.logo} description={settings.logo_path ? `Current: ${settings.logo_path}` : 'Upload your platform logo'}>
                            <Input type="file" accept="image/*" onChange={e => setData('logo', e.target.files[0])} p={1} />
                        </Field>

                        <Field label="Theme Color" error={errors.theme_color}>
                            <Flex gap={3} align="center">
                                <Input type="color" value={data.theme_color} onChange={e => setData('theme_color', e.target.value)} w="60px" h="40px" p={1} cursor="pointer" />
                                <Input value={data.theme_color} onChange={e => setData('theme_color', e.target.value)} maxW="150px" />
                            </Flex>
                        </Field>

                        {/* Email Settings */}
                        <SectionHeading>Email Settings</SectionHeading>

                        <Field label="From Email Address" error={errors.mail_from_address} description="This email is used as the sender for all platform emails. Must match your Resend verified domain.">
                            <Input type="email" value={data.mail_from_address} onChange={e => setData('mail_from_address', e.target.value)} placeholder="noreply@yourdomain.com" />
                        </Field>

                        <Field label="From Name" error={errors.mail_from_name} description="Display name shown in recipients' inboxes">
                            <Input value={data.mail_from_name} onChange={e => setData('mail_from_name', e.target.value)} placeholder="TILMS" />
                        </Field>

                        {/* Certificates */}
                        <SectionHeading>Certificate Signatory</SectionHeading>

                        <Flex gap={4}>
                            <Box flex={1}>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Signatory Name</Text>
                                <Input value={data.signatory_name} onChange={e => setData('signatory_name', e.target.value)} placeholder="John Doe" />
                            </Box>
                            <Box flex={1}>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Signatory Position</Text>
                                <Input value={data.signatory_position} onChange={e => setData('signatory_position', e.target.value)} placeholder="Director" />
                            </Box>
                        </Flex>

                        {/* AI & Payments */}
                        <SectionHeading>AI & Payments</SectionHeading>

                        <Field label="Default Claude Model" error={errors.claude_default_model} description="Used for AI features unless overridden per feature">
                            <select
                                value={data.claude_default_model}
                                onChange={e => setData('claude_default_model', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                            >
                                <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
                                <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (Faster, cheaper)</option>
                                <option value="claude-opus-4-20250515">Claude Opus 4 (Most capable)</option>
                            </select>
                        </Field>

                        <Field label="Razorpay Environment" error={errors.razorpay_environment} description="Use 'test' for development, switch to 'live' for production payments">
                            <select
                                value={data.razorpay_environment}
                                onChange={e => setData('razorpay_environment', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                            >
                                <option value="test">Test Mode</option>
                                <option value="live">Live Mode</option>
                            </select>
                        </Field>

                        <Box pt={4} borderTopWidth="1px" borderColor="gray.200">
                            <Button type="submit" colorPalette="blue" loading={processing}>
                                Save All Settings
                            </Button>
                        </Box>
                    </VStack>
                </form>
            </Box>
        </AdminLayout>
    );
}

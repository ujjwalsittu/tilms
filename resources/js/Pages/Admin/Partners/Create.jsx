import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Input, VStack, Text, Flex, Field, SimpleGrid,
} from '@chakra-ui/react';

export default function PartnersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_name: '',
        contact_email: '',
        phone: '',
        discount_percent: '',
        revenue_share_percent: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.partners.store'));
    };

    return (
        <AdminLayout title="Add Partner">
            <Head title="Add Partner - Admin" />
            <FlashMessage />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} maxW="2xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Add Partner</Text>
                    <Link href={route('admin.partners.index')}>
                        <Button variant="outline" size="sm">Back to List</Button>
                    </Link>
                </Flex>

                <form onSubmit={handleSubmit}>
                    <VStack gap={5} align="stretch">
                        <Field.Root invalid={!!errors.name}>
                            <Field.Label>Organization Name</Field.Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Partner organization name"
                            />
                            {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                        </Field.Root>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Field.Root invalid={!!errors.contact_name}>
                                <Field.Label>Contact Name</Field.Label>
                                <Input
                                    value={data.contact_name}
                                    onChange={(e) => setData('contact_name', e.target.value)}
                                    placeholder="Primary contact person"
                                />
                                {errors.contact_name && <Field.ErrorText>{errors.contact_name}</Field.ErrorText>}
                            </Field.Root>

                            <Field.Root invalid={!!errors.phone}>
                                <Field.Label>Phone</Field.Label>
                                <Input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+91 99999 00000"
                                />
                                {errors.phone && <Field.ErrorText>{errors.phone}</Field.ErrorText>}
                            </Field.Root>
                        </SimpleGrid>

                        <Field.Root invalid={!!errors.contact_email}>
                            <Field.Label>Contact Email</Field.Label>
                            <Input
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                placeholder="contact@partner.com"
                            />
                            {errors.contact_email && <Field.ErrorText>{errors.contact_email}</Field.ErrorText>}
                        </Field.Root>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Field.Root invalid={!!errors.discount_percent}>
                                <Field.Label>Discount % for Students</Field.Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.discount_percent}
                                    onChange={(e) => setData('discount_percent', e.target.value)}
                                    placeholder="e.g. 10"
                                />
                                {errors.discount_percent && <Field.ErrorText>{errors.discount_percent}</Field.ErrorText>}
                            </Field.Root>

                            <Field.Root invalid={!!errors.revenue_share_percent}>
                                <Field.Label>Revenue Share %</Field.Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.revenue_share_percent}
                                    onChange={(e) => setData('revenue_share_percent', e.target.value)}
                                    placeholder="e.g. 15"
                                />
                                {errors.revenue_share_percent && <Field.ErrorText>{errors.revenue_share_percent}</Field.ErrorText>}
                            </Field.Root>
                        </SimpleGrid>

                        <Flex gap={3} pt={2}>
                            <Button type="submit" colorPalette="blue" loading={processing}>
                                Create Partner
                            </Button>
                            <Link href={route('admin.partners.index')}>
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </AdminLayout>
    );
}

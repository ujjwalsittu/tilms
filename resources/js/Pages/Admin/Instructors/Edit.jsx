import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, VStack, Text, Flex, Field,
} from '@chakra-ui/react';

export default function InstructorsEdit({ instructor }) {
    const profile = instructor.instructor_profile ?? {};

    const { data, setData, put, processing, errors } = useForm({
        name: instructor.name ?? '',
        email: instructor.email ?? '',
        title: profile.title ?? '',
        specialization: profile.specialization ?? '',
        website_url: profile.website_url ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        github_username: profile.github_username ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.instructors.update', instructor.id));
    };

    return (
        <AdminLayout title="Edit Instructor">
            <Head title="Edit Instructor - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} maxW="2xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Edit Instructor: {instructor.name}</Text>
                    <Link href={route('admin.instructors.index')}>
                        <Button variant="outline" size="sm">Back to List</Button>
                    </Link>
                </Flex>

                <form onSubmit={handleSubmit}>
                    <VStack gap={5} align="stretch">
                        <Field.Root invalid={!!errors.name}>
                            <Field.Label>Full Name</Field.Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter full name"
                            />
                            {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.email}>
                            <Field.Label>Email Address</Field.Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter email address"
                            />
                            {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.title}>
                            <Field.Label>Title / Designation</Field.Label>
                            <Input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                            />
                            {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.specialization}>
                            <Field.Label>Specialization</Field.Label>
                            <Input
                                value={data.specialization}
                                onChange={(e) => setData('specialization', e.target.value)}
                                placeholder="e.g. Web Development, Data Science"
                            />
                            {errors.specialization && <Field.ErrorText>{errors.specialization}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.website_url}>
                            <Field.Label>Website URL</Field.Label>
                            <Input
                                type="url"
                                value={data.website_url}
                                onChange={(e) => setData('website_url', e.target.value)}
                                placeholder="https://example.com"
                            />
                            {errors.website_url && <Field.ErrorText>{errors.website_url}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.linkedin_url}>
                            <Field.Label>LinkedIn URL</Field.Label>
                            <Input
                                type="url"
                                value={data.linkedin_url}
                                onChange={(e) => setData('linkedin_url', e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                            />
                            {errors.linkedin_url && <Field.ErrorText>{errors.linkedin_url}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.github_username}>
                            <Field.Label>GitHub Username</Field.Label>
                            <Input
                                value={data.github_username}
                                onChange={(e) => setData('github_username', e.target.value)}
                                placeholder="github-username"
                            />
                            {errors.github_username && <Field.ErrorText>{errors.github_username}</Field.ErrorText>}
                        </Field.Root>

                        <Flex gap={3} pt={2}>
                            <Button type="submit" colorPalette="blue" loading={processing}>
                                Save Changes
                            </Button>
                            <Link href={route('admin.instructors.show', instructor.id)}>
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </AdminLayout>
    );
}

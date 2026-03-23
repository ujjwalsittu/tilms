import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Button, Input, VStack, Text, Flex, Field,
} from '@chakra-ui/react';

export default function InstructorsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        title: '',
        specialization: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.instructors.store'));
    };

    return (
        <AdminLayout title="Create Instructor">
            <Head title="Create Instructor - Admin" />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} maxW="2xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Create Instructor</Text>
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

                        <Field.Root invalid={!!errors.password}>
                            <Field.Label>Password</Field.Label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter password"
                            />
                            {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.password_confirmation}>
                            <Field.Label>Confirm Password</Field.Label>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                            />
                            {errors.password_confirmation && <Field.ErrorText>{errors.password_confirmation}</Field.ErrorText>}
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

                        <Flex gap={3} pt={2}>
                            <Button type="submit" colorPalette="blue" loading={processing}>
                                Create Instructor
                            </Button>
                            <Link href={route('admin.instructors.index')}>
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </AdminLayout>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';
import { Box, VStack, Heading, Text, Input, Button, Container } from '@chakra-ui/react';

function UpdateProfileForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={1}>Profile Information</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Update your account's profile information and email address.</Text>

            <form onSubmit={submit}>
                <VStack gap={4} align="stretch" maxW="xl">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Name</Text>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <Text fontSize="sm" color="red.500" mt={1}>{errors.name}</Text>}
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Email</Text>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        {errors.email && <Text fontSize="sm" color="red.500" mt={1}>{errors.email}</Text>}
                    </Box>
                    <Button type="submit" colorScheme="blue" alignSelf="start" loading={processing}>Save</Button>
                </VStack>
            </form>
        </Box>
    );
}

function UpdatePasswordForm() {
    const { data, setData, put, errors, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), { onSuccess: () => reset() });
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={1}>Update Password</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Ensure your account is using a long, random password to stay secure.</Text>

            <form onSubmit={submit}>
                <VStack gap={4} align="stretch" maxW="xl">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Current Password</Text>
                        <Input type="password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
                        {errors.current_password && <Text fontSize="sm" color="red.500" mt={1}>{errors.current_password}</Text>}
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>New Password</Text>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        {errors.password && <Text fontSize="sm" color="red.500" mt={1}>{errors.password}</Text>}
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Confirm Password</Text>
                        <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                    </Box>
                    <Button type="submit" colorScheme="blue" alignSelf="start" loading={processing}>Save</Button>
                </VStack>
            </form>
        </Box>
    );
}

function DeleteUserForm() {
    const { data, setData, delete: destroy, errors, processing } = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'));
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={1}>Delete Account</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Once your account is deleted, all of its resources and data will be permanently deleted.</Text>

            <form onSubmit={submit}>
                <VStack gap={4} align="stretch" maxW="xl">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Password</Text>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Enter your password to confirm" />
                        {errors.password && <Text fontSize="sm" color="red.500" mt={1}>{errors.password}</Text>}
                    </Box>
                    <Button type="submit" colorScheme="red" alignSelf="start" loading={processing}>Delete Account</Button>
                </VStack>
            </form>
        </Box>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <Container maxW="4xl" py={8}>
            <Head title="Profile" />
            <VStack gap={6} align="stretch">
                <Heading size="lg">Profile</Heading>
                <UpdateProfileForm mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </VStack>
        </Container>
    );
}

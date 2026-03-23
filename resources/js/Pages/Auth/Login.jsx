import { Head, useForm, Link } from '@inertiajs/react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Input,
    Button,
    Heading,
} from '@chakra-ui/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            <Head title="Log in" />

            <Box w="full" maxW="md" bg="white" p={8} borderRadius="xl" boxShadow="lg">
                <VStack gap={6} align="stretch">
                    <Box textAlign="center">
                        <Heading size="lg">TILMS</Heading>
                        <Text color="gray.500" mt={2}>Sign in to your account</Text>
                    </Box>

                    {status && (
                        <Text fontSize="sm" color="green.600" textAlign="center">{status}</Text>
                    )}

                    <form onSubmit={submit}>
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Email</Text>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                />
                                {errors.email && <Text fontSize="sm" color="red.500" mt={1}>{errors.email}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Password</Text>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                />
                                {errors.password && <Text fontSize="sm" color="red.500" mt={1}>{errors.password}</Text>}
                            </Box>

                            <Flex justify="space-between" align="center">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <Text fontSize="sm">Remember me</Text>
                                </label>

                                {canResetPassword && (
                                    <Link href={route('password.request')}>
                                        <Text fontSize="sm" color="blue.500">Forgot password?</Text>
                                    </Link>
                                )}
                            </Flex>

                            <Button
                                type="submit"
                                colorPalette="blue"
                                w="full"
                                loading={processing}
                            >
                                Sign in
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Flex>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';
import { Box, VStack, Heading, Text, Input, Button, Container, HStack, Badge, SimpleGrid } from '@chakra-ui/react';
import { FiGithub, FiShield } from 'react-icons/fi';

function UpdatePersonalForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        date_of_birth: user.date_of_birth ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={1}>Personal Details</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Update your name, email address, and contact information.</Text>

            {mustVerifyEmail && user.email_verified_at === null && (
                <Box bg="yellow.50" borderWidth="1px" borderColor="yellow.200" p={3} borderRadius="md" mb={4}>
                    <Text fontSize="sm" color="yellow.800">Your email address is unverified. Please check your inbox for a verification link.</Text>
                </Box>
            )}

            {status === 'profile-updated' && (
                <Box bg="green.50" borderWidth="1px" borderColor="green.200" p={3} borderRadius="md" mb={4}>
                    <Text fontSize="sm" color="green.800">Profile updated successfully.</Text>
                </Box>
            )}

            <form onSubmit={submit}>
                <VStack gap={4} align="stretch" maxW="xl">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Full Name</Text>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <Text fontSize="sm" color="red.500" mt={1}>{errors.name}</Text>}
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Email Address</Text>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        {errors.email && <Text fontSize="sm" color="red.500" mt={1}>{errors.email}</Text>}
                    </Box>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Phone Number</Text>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="+91..." />
                            {errors.phone && <Text fontSize="sm" color="red.500" mt={1}>{errors.phone}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Date of Birth</Text>
                            <Input type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                            {errors.date_of_birth && <Text fontSize="sm" color="red.500" mt={1}>{errors.date_of_birth}</Text>}
                        </Box>
                    </SimpleGrid>
                    <Button type="submit" colorPalette="blue" alignSelf="start" loading={processing}>Save Personal Details</Button>
                </VStack>
            </form>
        </Box>
    );
}

function UpdateAcademicForm() {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        college_name: user.college_name ?? '',
        course_name: user.course_name ?? '',
        semester: user.semester ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <Heading size="md" mb={1}>Academic Details</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Your institution and course information used for verification.</Text>

            <form onSubmit={submit}>
                <VStack gap={4} align="stretch" maxW="xl">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>College / Institution Name</Text>
                        <Input value={data.college_name} onChange={(e) => setData('college_name', e.target.value)} placeholder="e.g., IIT Delhi" />
                        {errors.college_name && <Text fontSize="sm" color="red.500" mt={1}>{errors.college_name}</Text>}
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Course / Program</Text>
                        <Input value={data.course_name} onChange={(e) => setData('course_name', e.target.value)} placeholder="e.g., B.Tech Computer Science" />
                        {errors.course_name && <Text fontSize="sm" color="red.500" mt={1}>{errors.course_name}</Text>}
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Current Semester / Year</Text>
                        <select
                            value={data.semester}
                            onChange={(e) => setData('semester', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                        >
                            <option value="">Select...</option>
                            {['1st Semester','2nd Semester','3rd Semester','4th Semester','5th Semester','6th Semester','7th Semester','8th Semester','Graduate','Post-Graduate'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {errors.semester && <Text fontSize="sm" color="red.500" mt={1}>{errors.semester}</Text>}
                    </Box>
                    <Button type="submit" colorPalette="blue" alignSelf="start" loading={processing}>Save Academic Details</Button>
                </VStack>
            </form>
        </Box>
    );
}

function GitHubConnectionSection() {
    const user = usePage().props.auth.user;
    const githubUsername = user.github_username;

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <HStack mb={1} gap={2}>
                <FiGithub size={20} />
                <Heading size="md">GitHub Connection</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.500" mb={4}>Connect your GitHub account to submit projects and build your portfolio.</Text>

            {githubUsername ? (
                <HStack gap={3} p={4} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
                    <FiGithub size={20} color="green" />
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color="green.800">Connected as @{githubUsername}</Text>
                        <Text fontSize="xs" color="green.600">Your GitHub account is linked and ready for project submissions.</Text>
                    </Box>
                    <Badge colorPalette="green" ml="auto">Connected</Badge>
                </HStack>
            ) : (
                <Box>
                    <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px" mb={3}>
                        <Text fontSize="sm" color="gray.600">No GitHub account connected. Connect GitHub to enable project task submissions and portfolio showcasing.</Text>
                    </Box>
                    <Button
                        as="a"
                        href="/auth/github"
                        colorPalette="gray"
                        gap={2}
                    >
                        <FiGithub />
                        Connect GitHub Account
                    </Button>
                </Box>
            )}
        </Box>
    );
}

function IdVerificationSection() {
    const user = usePage().props.auth.user;
    const status = user.id_verification_status;

    const statusConfig = {
        approved:      { colorPalette: 'green',  label: 'Approved',      description: 'Your identity has been verified successfully.' },
        pending:       { colorPalette: 'yellow', label: 'Under Review',   description: 'Your documents are being reviewed by our team. This usually takes 1-2 business days.' },
        rejected:      { colorPalette: 'red',    label: 'Rejected',       description: 'Your documents were rejected. Please re-upload valid documents.' },
        not_submitted: { colorPalette: 'gray',   label: 'Not Submitted',  description: 'You have not submitted your ID documents yet.' },
    };

    const config = statusConfig[status] ?? statusConfig['not_submitted'];

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
            <HStack mb={1} gap={2}>
                <FiShield size={20} />
                <Heading size="md">ID Verification</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.500" mb={4}>Identity verification is required to access certain features and receive certificates.</Text>

            <HStack gap={3} p={4} bg="gray.50" borderRadius="md" borderWidth="1px" mb={4}>
                <Box flex={1}>
                    <HStack gap={2} mb={1}>
                        <Text fontSize="sm" fontWeight="medium">Verification Status</Text>
                        <Badge colorPalette={config.colorPalette}>{config.label}</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">{config.description}</Text>
                </Box>
            </HStack>

            {(status === 'not_submitted' || status === 'rejected') && (
                <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Upload ID Documents</Text>
                    <Text fontSize="xs" color="gray.500" mb={3}>Please visit the ID Verification portal or contact support to submit your documents.</Text>
                    <Button as="a" href="/student/support/create" variant="outline" colorPalette="blue" size="sm">
                        Contact Support
                    </Button>
                </Box>
            )}
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
                    <Button type="submit" colorPalette="blue" alignSelf="start" loading={processing}>Update Password</Button>
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
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="red.100">
            <Heading size="md" mb={1} color="red.600">Delete Account</Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>Once your account is deleted, all of its resources and data will be permanently deleted.</Text>

            <form onSubmit={submit}>
                <VStack gap={4} align="stretch" maxW="xl">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Password</Text>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Enter your password to confirm" />
                        {errors.password && <Text fontSize="sm" color="red.500" mt={1}>{errors.password}</Text>}
                    </Box>
                    <Button type="submit" colorPalette="red" alignSelf="start" loading={processing}>Delete Account</Button>
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
                <Heading size="lg">Profile Settings</Heading>
                <UpdatePersonalForm mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdateAcademicForm />
                <GitHubConnectionSection />
                <IdVerificationSection />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </VStack>
        </Container>
    );
}

import { Head, useForm, Link } from '@inertiajs/react';
import { Box, Flex, VStack, HStack, Text, Input, Button, Heading, Badge, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { FiUser, FiBook, FiUpload, FiCheck } from 'react-icons/fi';

const steps = [
    { key: 'personal', label: 'Personal Details', icon: FiUser },
    { key: 'academic', label: 'Academic Details', icon: FiBook },
    { key: 'documents', label: 'Verification', icon: FiUpload },
    { key: 'confirm', label: 'Confirm', icon: FiCheck },
];

export default function CohortRegister({ cohort }) {
    const [step, setStep] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        date_of_birth: '',
        college_name: '',
        course_name: '',
        semester: '',
        id_document: null,
        govt_id_document: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/register/${cohort.slug}`, {
            forceFormData: true,
        });
    };

    const canNext = () => {
        if (step === 0) return data.name && data.email && data.password && data.password_confirmation && data.phone && data.date_of_birth;
        if (step === 1) return data.college_name && data.course_name && data.semester;
        return true;
    };

    return (
        <Flex minH="100vh" bg="gray.50">
            <Head title={`Register - ${cohort.title}`} />

            {/* Left: Cohort Info */}
            <Box w="400px" bg="blue.600" color="white" p={8} display={{ base: 'none', lg: 'block' }}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>TILMS</Text>
                <Box mt={8}>
                    <Badge colorPalette={cohort.type === 'internship' ? 'purple' : 'blue'} mb={3}>{cohort.type}</Badge>
                    <Heading size="lg" mb={4}>{cohort.title}</Heading>
                    <Text opacity={0.9} fontSize="sm" mb={6}>{cohort.description?.substring(0, 200)}</Text>
                    {cohort.price_amount > 0 && (
                        <Text fontSize="2xl" fontWeight="bold">{cohort.price_currency || 'INR'} {Number(cohort.price_amount).toLocaleString()}</Text>
                    )}
                </Box>
            </Box>

            {/* Right: Form */}
            <Flex flex={1} align="center" justify="center" p={8}>
                <Box w="full" maxW="lg">
                    {/* Step indicators */}
                    <HStack gap={0} mb={8} justify="center">
                        {steps.map((s, i) => {
                            const StepIcon = s.icon;
                            return (
                                <HStack key={s.key} gap={0}>
                                    <Flex
                                        w={10} h={10}
                                        borderRadius="full"
                                        bg={i <= step ? 'blue.500' : 'gray.200'}
                                        color={i <= step ? 'white' : 'gray.500'}
                                        align="center" justify="center"
                                        transition="all 0.2s"
                                    >
                                        <StepIcon size={18} />
                                    </Flex>
                                    {i < steps.length - 1 && (
                                        <Box w={12} h="2px" bg={i < step ? 'blue.500' : 'gray.200'} />
                                    )}
                                </HStack>
                            );
                        })}
                    </HStack>

                    <Text fontSize="lg" fontWeight="semibold" mb={1}>{steps[step].label}</Text>
                    <Text fontSize="sm" color="gray.500" mb={6}>Step {step + 1} of {steps.length}</Text>

                    <form onSubmit={handleSubmit}>
                        <VStack gap={4} align="stretch">

                            {/* Step 1: Personal */}
                            {step === 0 && (
                                <>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Full Name *</Text>
                                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                                        {errors.name && <Text fontSize="sm" color="red.500" mt={1}>{errors.name}</Text>}
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Email Address *</Text>
                                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                        {errors.email && <Text fontSize="sm" color="red.500" mt={1}>{errors.email}</Text>}
                                    </Box>
                                    <SimpleGrid columns={2} gap={4}>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium" mb={1}>Password *</Text>
                                            <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                                            {errors.password && <Text fontSize="sm" color="red.500" mt={1}>{errors.password}</Text>}
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium" mb={1}>Confirm Password *</Text>
                                            <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                                        </Box>
                                    </SimpleGrid>
                                    <SimpleGrid columns={2} gap={4}>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium" mb={1}>Phone Number *</Text>
                                            <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+91..." />
                                            {errors.phone && <Text fontSize="sm" color="red.500" mt={1}>{errors.phone}</Text>}
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium" mb={1}>Date of Birth *</Text>
                                            <Input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />
                                            {errors.date_of_birth && <Text fontSize="sm" color="red.500" mt={1}>{errors.date_of_birth}</Text>}
                                        </Box>
                                    </SimpleGrid>
                                </>
                            )}

                            {/* Step 2: Academic */}
                            {step === 1 && (
                                <>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>College / Institution Name *</Text>
                                        <Input value={data.college_name} onChange={e => setData('college_name', e.target.value)} />
                                        {errors.college_name && <Text fontSize="sm" color="red.500" mt={1}>{errors.college_name}</Text>}
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Course / Program *</Text>
                                        <Input value={data.course_name} onChange={e => setData('course_name', e.target.value)} placeholder="e.g., B.Tech Computer Science" />
                                        {errors.course_name && <Text fontSize="sm" color="red.500" mt={1}>{errors.course_name}</Text>}
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Current Semester / Year *</Text>
                                        <select
                                            value={data.semester}
                                            onChange={e => setData('semester', e.target.value)}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                                        >
                                            <option value="">Select...</option>
                                            {['1st Semester','2nd Semester','3rd Semester','4th Semester','5th Semester','6th Semester','7th Semester','8th Semester','Graduate','Post-Graduate'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {errors.semester && <Text fontSize="sm" color="red.500" mt={1}>{errors.semester}</Text>}
                                    </Box>
                                </>
                            )}

                            {/* Step 3: Documents */}
                            {step === 2 && (
                                <>
                                    <Box bg="blue.50" p={4} borderRadius="md" mb={2}>
                                        <Text fontSize="sm" color="blue.700">Upload your ID documents for verification. These will be reviewed by the admin before full account activation.</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Institution Student ID (PDF/Image)</Text>
                                        <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setData('id_document', e.target.files[0])} p={1} />
                                        {errors.id_document && <Text fontSize="sm" color="red.500" mt={1}>{errors.id_document}</Text>}
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={1}>Government ID (Aadhaar/PAN/Passport)</Text>
                                        <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setData('govt_id_document', e.target.files[0])} p={1} />
                                        {errors.govt_id_document && <Text fontSize="sm" color="red.500" mt={1}>{errors.govt_id_document}</Text>}
                                    </Box>
                                    <Text fontSize="xs" color="gray.500">You can skip this step and upload later from your profile.</Text>
                                </>
                            )}

                            {/* Step 4: Confirm */}
                            {step === 3 && (
                                <Box bg="white" p={6} borderRadius="lg" borderWidth="1px">
                                    <Text fontWeight="semibold" mb={4}>Review Your Details</Text>
                                    <VStack gap={2} align="stretch" fontSize="sm">
                                        <Flex justify="space-between"><Text color="gray.500">Name</Text><Text fontWeight="medium">{data.name}</Text></Flex>
                                        <Flex justify="space-between"><Text color="gray.500">Email</Text><Text fontWeight="medium">{data.email}</Text></Flex>
                                        <Flex justify="space-between"><Text color="gray.500">Phone</Text><Text fontWeight="medium">{data.phone}</Text></Flex>
                                        <Flex justify="space-between"><Text color="gray.500">Date of Birth</Text><Text fontWeight="medium">{data.date_of_birth}</Text></Flex>
                                        <Box borderTopWidth="1px" pt={2} mt={2} />
                                        <Flex justify="space-between"><Text color="gray.500">College</Text><Text fontWeight="medium">{data.college_name}</Text></Flex>
                                        <Flex justify="space-between"><Text color="gray.500">Course</Text><Text fontWeight="medium">{data.course_name}</Text></Flex>
                                        <Flex justify="space-between"><Text color="gray.500">Semester</Text><Text fontWeight="medium">{data.semester}</Text></Flex>
                                        <Box borderTopWidth="1px" pt={2} mt={2} />
                                        <Flex justify="space-between"><Text color="gray.500">Cohort</Text><Text fontWeight="medium">{cohort.title}</Text></Flex>
                                        <Flex justify="space-between">
                                            <Text color="gray.500">Amount</Text>
                                            <Text fontWeight="bold" color="blue.600">
                                                {cohort.price_amount > 0 ? `${cohort.price_currency || 'INR'} ${Number(cohort.price_amount).toLocaleString()}` : 'Free'}
                                            </Text>
                                        </Flex>
                                    </VStack>
                                </Box>
                            )}

                            {/* Navigation */}
                            <HStack justify="space-between" pt={4}>
                                {step > 0 ? (
                                    <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                                ) : (
                                    <Link href={route('login')}>
                                        <Text fontSize="sm" color="blue.500">Already have an account?</Text>
                                    </Link>
                                )}

                                {step < steps.length - 1 ? (
                                    <Button colorPalette="blue" onClick={() => setStep(step + 1)} disabled={!canNext()}>
                                        Continue
                                    </Button>
                                ) : (
                                    <Button type="submit" colorPalette="blue" loading={processing} w="200px">
                                        {cohort.price_amount > 0 ? 'Register & Pay' : 'Register & Enroll'}
                                    </Button>
                                )}
                            </HStack>
                        </VStack>
                    </form>
                </Box>
            </Flex>
        </Flex>
    );
}

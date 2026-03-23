import { Head, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Button,
    Input,
    Select,
    Textarea,
    SimpleGrid,
    Text,
    VStack,
    HStack,
} from '@chakra-ui/react';

export default function Edit({ cohort }) {
    const { data, setData, put, processing, errors } = useForm({
        title: cohort.title ?? '',
        description: cohort.description ?? '',
        type: cohort.type ?? 'learning',
        price_amount: cohort.price_amount ?? '',
        price_currency: cohort.price_currency ?? 'INR',
        registration_opens_at: cohort.registration_opens_at
            ? cohort.registration_opens_at.substring(0, 16)
            : '',
        starts_at: cohort.starts_at ? cohort.starts_at.substring(0, 16) : '',
        task_ordering: cohort.task_ordering ?? 'sequential',
        completion_threshold: cohort.completion_threshold ?? 70,
        has_free_audit: cohort.has_free_audit ?? false,
        has_waitlist: cohort.has_waitlist ?? false,
        has_leaderboard: cohort.has_leaderboard ?? false,
        max_students: cohort.max_students ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('instructor.cohorts.update', cohort.id));
    };

    return (
        <InstructorLayout title="Edit Cohort">
            <Head title={`Edit: ${cohort.title}`} />
            <FlashMessage />

            <Box maxW="3xl" mx="auto">
                <Text fontSize="2xl" fontWeight="bold" mb={6}>Edit Cohort</Text>

                <Box as="form" onSubmit={handleSubmit} bg="white" p={8} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <VStack gap={6} align="stretch">
                        {/* Basic Info */}
                        <Text fontWeight="semibold" fontSize="lg" color="blue.600">Basic Information</Text>

                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Title</Text>
                            <Input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <Text fontSize="sm" color="red.500" mt={1}>{errors.title}</Text>}
                        </Box>

                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Description</Text>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                            />
                            {errors.description && <Text fontSize="sm" color="red.500" mt={1}>{errors.description}</Text>}
                        </Box>

                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Type</Text>
                            <Select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="learning">Learning</option>
                                <option value="internship">Internship</option>
                            </Select>
                            {errors.type && <Text fontSize="sm" color="red.500" mt={1}>{errors.type}</Text>}
                        </Box>

                        <Box borderBottomWidth="1px" borderColor="gray.200" />

                        {/* Pricing */}
                        <Text fontWeight="semibold" fontSize="lg" color="blue.600">Pricing</Text>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Price Amount</Text>
                                <Input
                                    type="number"
                                    value={data.price_amount}
                                    onChange={(e) => setData('price_amount', e.target.value)}
                                    placeholder="Leave blank for free"
                                    min="0"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1}>Leave blank for free cohort</Text>
                                {errors.price_amount && <Text fontSize="sm" color="red.500" mt={1}>{errors.price_amount}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Currency</Text>
                                <Select
                                    value={data.price_currency}
                                    onChange={(e) => setData('price_currency', e.target.value)}
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </Select>
                                {errors.price_currency && <Text fontSize="sm" color="red.500" mt={1}>{errors.price_currency}</Text>}
                            </Box>
                        </SimpleGrid>

                        <Box borderBottomWidth="1px" borderColor="gray.200" />

                        {/* Schedule */}
                        <Text fontWeight="semibold" fontSize="lg" color="blue.600">Schedule</Text>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Registration Opens At</Text>
                                <Input
                                    type="datetime-local"
                                    value={data.registration_opens_at}
                                    onChange={(e) => setData('registration_opens_at', e.target.value)}
                                />
                                {errors.registration_opens_at && <Text fontSize="sm" color="red.500" mt={1}>{errors.registration_opens_at}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Starts At</Text>
                                <Input
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                />
                                {errors.starts_at && <Text fontSize="sm" color="red.500" mt={1}>{errors.starts_at}</Text>}
                            </Box>
                        </SimpleGrid>

                        <Box borderBottomWidth="1px" borderColor="gray.200" />

                        {/* Settings */}
                        <Text fontWeight="semibold" fontSize="lg" color="blue.600">Settings</Text>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Task Ordering</Text>
                                <Select
                                    value={data.task_ordering}
                                    onChange={(e) => setData('task_ordering', e.target.value)}
                                >
                                    <option value="sequential">Sequential</option>
                                    <option value="shuffled">Shuffled</option>
                                </Select>
                                {errors.task_ordering && <Text fontSize="sm" color="red.500" mt={1}>{errors.task_ordering}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Completion Threshold (%)</Text>
                                <Input
                                    type="number"
                                    value={data.completion_threshold}
                                    onChange={(e) => setData('completion_threshold', Number(e.target.value))}
                                    min="0"
                                    max="100"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1}>Minimum % to earn certificate</Text>
                                {errors.completion_threshold && <Text fontSize="sm" color="red.500" mt={1}>{errors.completion_threshold}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Max Students</Text>
                                <Input
                                    type="number"
                                    value={data.max_students}
                                    onChange={(e) => setData('max_students', e.target.value)}
                                    placeholder="Leave blank for unlimited"
                                    min="1"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1}>Leave blank for unlimited</Text>
                                {errors.max_students && <Text fontSize="sm" color="red.500" mt={1}>{errors.max_students}</Text>}
                            </Box>
                        </SimpleGrid>

                        {/* Feature Toggles */}
                        <VStack gap={3} align="start">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={data.has_free_audit}
                                    onChange={(e) => setData('has_free_audit', e.target.checked)}
                                />
                                Enable Free Audit
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={data.has_waitlist}
                                    onChange={(e) => setData('has_waitlist', e.target.checked)}
                                />
                                Enable Waitlist
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={data.has_leaderboard}
                                    onChange={(e) => setData('has_leaderboard', e.target.checked)}
                                />
                                Enable Leaderboard
                            </label>
                        </VStack>

                        {/* Actions */}
                        <HStack justify="flex-end" gap={3} pt={2}>
                            <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={processing}
                                loadingText="Saving..."
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </InstructorLayout>
    );
}

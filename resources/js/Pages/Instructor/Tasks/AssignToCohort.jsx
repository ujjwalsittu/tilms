import { Head, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import { useState } from 'react';
import {
    Box,
    Button,
    Input,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Badge,
    Alert,
} from '@chakra-ui/react';

const sel = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px', background: 'white' };

export default function AssignToCohort({ task, cohorts = [] }) {
    const [selectedCohort, setSelectedCohort] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        task_id: task.id,
        order_index: 1,
        opens_at: '',
        due_at: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCohort) return;
        post(route('instructor.cohort-tasks.store', selectedCohort));
    };

    const typeColor = { individual: 'purple', project: 'teal' };
    const difficultyColor = { beginner: 'green', intermediate: 'blue', advanced: 'red' };

    return (
        <InstructorLayout title="Assign Task to Cohort">
            <Head title={`Assign: ${task.title}`} />
            <FlashMessage />

            <Box maxW="2xl" mx="auto">
                <Text fontSize="2xl" fontWeight="bold" mb={6}>Assign Task to Cohort</Text>

                <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb={2}>
                        Selected Task
                    </Text>
                    <Text fontWeight="semibold" fontSize="lg">{task.title}</Text>
                    <HStack gap={2} mt={2}>
                        <Badge colorPalette={typeColor[task.type] ?? 'gray'}>{task.type}</Badge>
                        <Badge colorPalette={difficultyColor[task.difficulty] ?? 'gray'}>{task.difficulty}</Badge>
                        {task.programming_language && (
                            <Badge variant="outline">{task.programming_language}</Badge>
                        )}
                        {task.estimated_minutes && (
                            <Text fontSize="sm" color="gray.500">~{task.estimated_minutes} min</Text>
                        )}
                    </HStack>
                    {task.description && (
                        <Text fontSize="sm" color="gray.600" mt={2}>{task.description}</Text>
                    )}
                </Box>

                {cohorts.length === 0 ? (
                    <Alert.Root status="warning" borderRadius="lg">
                        <Alert.Indicator />
                        <Alert.Description>
                            You have no active cohorts. Create a cohort first before assigning tasks.
                        </Alert.Description>
                    </Alert.Root>
                ) : (
                    <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                        <VStack gap={5} align="stretch">
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Select Cohort</Text>
                                <select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)} style={sel}>
                                    <option value="">Choose a cohort...</option>
                                    {cohorts.map((cohort) => (
                                        <option key={cohort.id} value={cohort.id}>
                                            {cohort.title} ({cohort.status})
                                        </option>
                                    ))}
                                </select>
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Order / Position</Text>
                                <Input type="number" value={data.order_index} onChange={(e) => setData('order_index', Number(e.target.value))} min="1" />
                                <Text fontSize="sm" color="gray.500" mt={1}>Position of this task in the cohort sequence</Text>
                                {errors.order_index && <Text fontSize="sm" color="red.500" mt={1}>{errors.order_index}</Text>}
                            </Box>

                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Opens At</Text>
                                    <Input type="datetime-local" value={data.opens_at} onChange={(e) => setData('opens_at', e.target.value)} />
                                    <Text fontSize="sm" color="gray.500" mt={1}>When students can start this task</Text>
                                    {errors.opens_at && <Text fontSize="sm" color="red.500" mt={1}>{errors.opens_at}</Text>}
                                </Box>
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Due At</Text>
                                    <Input type="datetime-local" value={data.due_at} onChange={(e) => setData('due_at', e.target.value)} />
                                    <Text fontSize="sm" color="gray.500" mt={1}>Submission deadline</Text>
                                    {errors.due_at && <Text fontSize="sm" color="red.500" mt={1}>{errors.due_at}</Text>}
                                </Box>
                            </SimpleGrid>

                            <HStack justify="flex-end" gap={3} pt={2}>
                                <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                                <Button
                                    type="submit"
                                    colorPalette="blue"
                                    loading={processing}
                                    disabled={!selectedCohort}
                                    loadingText="Assigning..."
                                >
                                    Assign to Cohort
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                )}
            </Box>
        </InstructorLayout>
    );
}

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

export default function Edit({ task }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title ?? '',
        description: task.description ?? '',
        type: task.type ?? 'individual',
        difficulty: task.difficulty ?? 'beginner',
        programming_language: task.programming_language ?? '',
        estimated_minutes: task.estimated_minutes ?? 60,
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : (task.tags ?? ''),
        starter_code: task.starter_code ?? '',
        test_cases: task.test_cases
            ? (typeof task.test_cases === 'string' ? task.test_cases : JSON.stringify(task.test_cases, null, 2))
            : '',
        project_requirements: task.project_requirements ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('instructor.tasks.update', task.id));
    };

    return (
        <InstructorLayout title="Edit Task">
            <Head title={`Edit: ${task.title}`} />
            <FlashMessage />

            <Box maxW="3xl" mx="auto">
                <Text fontSize="2xl" fontWeight="bold" mb={6}>Edit Task</Text>

                <Box as="form" onSubmit={handleSubmit} bg="white" p={8} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <VStack gap={6} align="stretch">
                        <Text fontWeight="semibold" fontSize="lg" color="blue.600">Task Details</Text>

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
                                rows={5}
                            />
                            {errors.description && <Text fontSize="sm" color="red.500" mt={1}>{errors.description}</Text>}
                        </Box>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Task Type</Text>
                                <Select value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                    <option value="individual">Individual</option>
                                    <option value="project">Project</option>
                                </Select>
                                {errors.type && <Text fontSize="sm" color="red.500" mt={1}>{errors.type}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Difficulty</Text>
                                <Select value={data.difficulty} onChange={(e) => setData('difficulty', e.target.value)}>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </Select>
                                {errors.difficulty && <Text fontSize="sm" color="red.500" mt={1}>{errors.difficulty}</Text>}
                            </Box>
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Programming Language</Text>
                                <Select value={data.programming_language} onChange={(e) => setData('programming_language', e.target.value)}>
                                    <option value="">None / General</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="php">PHP</option>
                                    <option value="sql">SQL</option>
                                    <option value="html_css">HTML/CSS</option>
                                    <option value="java">Java</option>
                                    <option value="go">Go</option>
                                    <option value="rust">Rust</option>
                                </Select>
                                {errors.programming_language && <Text fontSize="sm" color="red.500" mt={1}>{errors.programming_language}</Text>}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Estimated Time (minutes)</Text>
                                <Input
                                    type="number"
                                    value={data.estimated_minutes}
                                    onChange={(e) => setData('estimated_minutes', Number(e.target.value))}
                                    min="1"
                                />
                                {errors.estimated_minutes && <Text fontSize="sm" color="red.500" mt={1}>{errors.estimated_minutes}</Text>}
                            </Box>
                        </SimpleGrid>

                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Tags</Text>
                            <Input
                                value={data.tags}
                                onChange={(e) => setData('tags', e.target.value)}
                                placeholder="react, api, authentication (comma-separated)"
                            />
                            <Text fontSize="sm" color="gray.500" mt={1}>Comma-separated tags</Text>
                            {errors.tags && <Text fontSize="sm" color="red.500" mt={1}>{errors.tags}</Text>}
                        </Box>

                        <Box borderBottomWidth="1px" borderColor="gray.200" />

                        {data.type === 'individual' && (
                            <>
                                <Text fontWeight="semibold" fontSize="lg" color="blue.600">Individual Task Settings</Text>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Starter Code</Text>
                                    <Textarea
                                        value={data.starter_code}
                                        onChange={(e) => setData('starter_code', e.target.value)}
                                        rows={8}
                                        fontFamily="mono"
                                        fontSize="sm"
                                        bg="gray.50"
                                    />
                                    {errors.starter_code && <Text fontSize="sm" color="red.500" mt={1}>{errors.starter_code}</Text>}
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Test Cases (JSON)</Text>
                                    <Textarea
                                        value={data.test_cases}
                                        onChange={(e) => setData('test_cases', e.target.value)}
                                        rows={6}
                                        fontFamily="mono"
                                        fontSize="sm"
                                        bg="gray.50"
                                    />
                                    {errors.test_cases && <Text fontSize="sm" color="red.500" mt={1}>{errors.test_cases}</Text>}
                                </Box>
                            </>
                        )}

                        {data.type === 'project' && (
                            <>
                                <Text fontWeight="semibold" fontSize="lg" color="blue.600">Project Settings</Text>

                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>Project Requirements</Text>
                                    <Textarea
                                        value={data.project_requirements}
                                        onChange={(e) => setData('project_requirements', e.target.value)}
                                        rows={10}
                                    />
                                    {errors.project_requirements && <Text fontSize="sm" color="red.500" mt={1}>{errors.project_requirements}</Text>}
                                </Box>
                            </>
                        )}

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

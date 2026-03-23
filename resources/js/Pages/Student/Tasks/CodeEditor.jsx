import { Head, Link, useForm } from '@inertiajs/react';
import MonacoEditor from '@/Components/CodeEditor/MonacoEditor';
import LanguageSelector from '@/Components/CodeEditor/LanguageSelector';
import {
    Box,
    Flex,
    Button,
    Text,
    HStack,
    VStack,
    Badge,
} from '@chakra-ui/react';

export default function CodeEditor({ submission, task, cohort }) {
    const { data, setData, post, put, processing } = useForm({
        code_content: submission?.code_content ?? task?.starter_code ?? '',
        code_language: submission?.code_language ?? task?.programming_language ?? 'javascript',
    });

    const handleSubmit = () => {
        if (submission && submission.status === 'draft') {
            put(route('student.tasks.code-save', submission.id), {
                onSuccess: () => {
                    post(route('student.tasks.code-submit', submission.cohort_task_id));
                },
            });
        } else {
            post(route('student.tasks.code-submit', submission?.cohort_task_id ?? task?.pivot?.id));
        }
    };

    const handleSaveDraft = () => {
        if (submission?.id) {
            put(route('student.tasks.code-save', submission.id));
        }
    };

    return (
        <Box minH="100vh" bg="gray.900">
            <Head title={`Editor – ${task?.title}`} />

            {/* ── Top bar ── */}
            <Flex
                h="50px"
                bg="gray.800"
                px={4}
                align="center"
                justify="space-between"
                borderBottomWidth="1px"
                borderColor="gray.700"
            >
                <HStack gap={3}>
                    <Link href={route('student.cohorts.show', cohort?.id)}>
                        <Button size="sm" variant="ghost" color="gray.400">← Back</Button>
                    </Link>
                    <Text color="white" fontWeight="medium" fontSize="sm">{task?.title}</Text>
                    {task?.difficulty && (
                        <Badge colorPalette="blue" variant="subtle" textTransform="capitalize">
                            {task.difficulty}
                        </Badge>
                    )}
                </HStack>

                <HStack gap={3}>
                    <LanguageSelector
                        value={data.code_language}
                        onChange={(v) => setData('code_language', v)}
                    />
                    {submission?.status === 'draft' && (
                        <Button
                            size="sm"
                            variant="outline"
                            color="gray.300"
                            onClick={handleSaveDraft}
                            loading={processing}
                            type="button"
                        >
                            Save Draft
                        </Button>
                    )}
                    <Button
                        size="sm"
                        colorPalette="green"
                        onClick={handleSubmit}
                        loading={processing}
                        type="button"
                    >
                        Submit Code
                    </Button>
                </HStack>
            </Flex>

            {/* ── Body: editor + side panel ── */}
            <Flex h="calc(100vh - 50px)">
                {/* Editor */}
                <Box flex={1} overflow="hidden">
                    <MonacoEditor
                        value={data.code_content}
                        onChange={(v) => setData('code_content', v)}
                        language={data.code_language}
                        height="calc(100vh - 50px)"
                    />
                </Box>

                {/* Side panel */}
                <Box
                    w="350px"
                    bg="gray.800"
                    borderLeftWidth="1px"
                    borderColor="gray.700"
                    overflowY="auto"
                    maxH="calc(100vh - 50px)"
                    flexShrink={0}
                >
                    <Box p={4}>
                        <Text color="gray.300" fontSize="sm" fontWeight="bold" mb={2}>
                            Task Description
                        </Text>
                        <Text color="gray.400" fontSize="sm" whiteSpace="pre-wrap">
                            {task?.description}
                        </Text>

                        {/* Learning objectives */}
                        {task?.learning_objectives && (
                            <Box mt={4}>
                                <Text color="gray.300" fontSize="sm" fontWeight="bold" mb={2}>
                                    Learning Objectives
                                </Text>
                                <Text color="gray.400" fontSize="sm" whiteSpace="pre-wrap">
                                    {task.learning_objectives}
                                </Text>
                            </Box>
                        )}

                        {/* Test cases */}
                        {task?.test_cases && (
                            <Box mt={4}>
                                <Text color="gray.300" fontSize="sm" fontWeight="bold" mb={2}>
                                    Test Cases
                                </Text>
                                <Box
                                    bg="gray.900"
                                    p={3}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontFamily="mono"
                                    color="gray.400"
                                    overflowX="auto"
                                >
                                    <pre>{JSON.stringify(task.test_cases, null, 2)}</pre>
                                </Box>
                            </Box>
                        )}

                        {/* Submission info */}
                        {submission && (
                            <Box mt={4}>
                                <Box borderBottomWidth="1px" borderColor="gray.700" mb={2} pb={1}>
                                    <Text color="gray.300" fontSize="sm" fontWeight="bold">
                                        Submission
                                    </Text>
                                </Box>
                                <VStack gap={1} align="stretch">
                                    <Flex justify="space-between">
                                        <Text fontSize="xs" color="gray.500">Status</Text>
                                        <Text fontSize="xs" color="gray.300" textTransform="capitalize">
                                            {submission.status}
                                        </Text>
                                    </Flex>
                                    {submission.submitted_at && (
                                        <Flex justify="space-between">
                                            <Text fontSize="xs" color="gray.500">Submitted</Text>
                                            <Text fontSize="xs" color="gray.300">
                                                {new Date(submission.submitted_at).toLocaleString()}
                                            </Text>
                                        </Flex>
                                    )}
                                    {submission.ai_score !== null && submission.ai_score !== undefined && (
                                        <Flex justify="space-between">
                                            <Text fontSize="xs" color="gray.500">AI Score</Text>
                                            <Text fontSize="xs" color="green.400" fontWeight="bold">
                                                {submission.ai_score} / 100
                                            </Text>
                                        </Flex>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        {/* Task metadata */}
                        <Box mt={4}>
                            <Box borderBottomWidth="1px" borderColor="gray.700" mb={2} pb={1}>
                                <Text color="gray.300" fontSize="sm" fontWeight="bold">Details</Text>
                            </Box>
                            <VStack gap={1} align="stretch">
                                {task?.programming_language && (
                                    <Flex justify="space-between">
                                        <Text fontSize="xs" color="gray.500">Language</Text>
                                        <Text fontSize="xs" color="gray.300">{task.programming_language}</Text>
                                    </Flex>
                                )}
                                {task?.estimated_time && (
                                    <Flex justify="space-between">
                                        <Text fontSize="xs" color="gray.500">Est. Time</Text>
                                        <Text fontSize="xs" color="gray.300">{task.estimated_time} min</Text>
                                    </Flex>
                                )}
                            </VStack>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}

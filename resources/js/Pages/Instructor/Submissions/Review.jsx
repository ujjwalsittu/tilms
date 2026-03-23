import { Head, useForm, Link } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import {
    Box,
    Button,
    Flex,
    Input,
    Textarea,
    Text,
    Badge,
    HStack,
    VStack,
    SimpleGrid,
    Alert,
} from '@chakra-ui/react';
import { FiExternalLink, FiUser, FiBook, FiCpu, FiAlertTriangle } from 'react-icons/fi';

function InfoRow({ label, value }) {
    return (
        <Flex justify="space-between" align="center" py={1}>
            <Text fontSize="sm" color="gray.500">{label}</Text>
            <Text fontSize="sm" fontWeight="medium">{value}</Text>
        </Flex>
    );
}

export default function Review({ submission }) {
    const task = submission.cohort_task?.task ?? {};
    const cohort = submission.cohort_task?.cohort ?? {};
    const student = submission.student ?? {};
    const aiReport = submission.ai_evaluation_report ?? null;

    const { data, setData, put, processing, errors } = useForm({
        instructor_score: submission.instructor_score ?? '',
        instructor_feedback: submission.instructor_feedback ?? '',
        decision: submission.decision ?? 'approve',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('instructor.submissions.grade', submission.id));
    };

    return (
        <InstructorLayout title="Review Submission">
            <Head title={`Review: ${student.name}`} />
            <FlashMessage />

            {/* Header */}
            <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                    <Box>
                        <HStack gap={2} mb={1}>
                            <StatusBadge status={submission.status} />
                            <Badge variant="outline">{cohort.title}</Badge>
                        </HStack>
                        <Text fontSize="xl" fontWeight="bold">{task.title}</Text>
                        <HStack gap={2} mt={1} color="gray.500" fontSize="sm">
                            <Text>Student: {student.name}</Text>
                            <Text>·</Text>
                            <Text>Submitted: {new Date(submission.submitted_at ?? submission.created_at).toLocaleString()}</Text>
                        </HStack>
                    </Box>
                    <Link href={route('instructor.submissions.index')}>
                        <Button size="sm" variant="outline">Back to Queue</Button>
                    </Link>
                </Flex>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={6}>
                {/* Left Panel: Task + Submission */}
                <VStack gap={4} align="stretch">
                    {/* Task Description */}
                    <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                        <Flex align="center" gap={2} mb={3}>
                            <FiBook />
                            <Text fontWeight="semibold">Task Description</Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                            {task.description ?? 'No description available.'}
                        </Text>
                        {task.project_requirements && (
                            <>
                                <Box borderBottomWidth="1px" borderColor="gray.200" my={3} />
                                <Text fontWeight="medium" fontSize="sm" mb={2}>Project Requirements</Text>
                                <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                                    {task.project_requirements}
                                </Text>
                            </>
                        )}
                        {task.starter_code && (
                            <>
                                <Box borderBottomWidth="1px" borderColor="gray.200" my={3} />
                                <Text fontWeight="medium" fontSize="sm" mb={2}>Starter Code</Text>
                                <Box bg="gray.900" color="green.300" p={3} borderRadius="md" fontFamily="mono" fontSize="xs" overflowX="auto">
                                    <pre>{task.starter_code}</pre>
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Student Submission */}
                    <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                        <Flex align="center" gap={2} mb={3}>
                            <FiUser />
                            <Text fontWeight="semibold">Student Submission</Text>
                        </Flex>

                        {submission.github_url ? (
                            <Box>
                                <Text fontSize="sm" color="gray.500" mb={2}>GitHub Repository:</Text>
                                <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" colorScheme="gray" leftIcon={<FiExternalLink />}>
                                        Open Repository
                                    </Button>
                                </a>
                            </Box>
                        ) : submission.submitted_code ? (
                            <Box bg="gray.900" color="green.300" p={4} borderRadius="md" fontFamily="mono" fontSize="xs" overflowX="auto" maxH="300px">
                                <pre>{submission.submitted_code}</pre>
                            </Box>
                        ) : (
                            <Text color="gray.500" fontSize="sm">No code submitted.</Text>
                        )}

                        {submission.submission_notes && (
                            <>
                                <Box borderBottomWidth="1px" borderColor="gray.200" my={3} />
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Student Notes</Text>
                                <Text fontSize="sm" color="gray.700">{submission.submission_notes}</Text>
                            </>
                        )}
                    </Box>
                </VStack>

                {/* Right Panel: AI Evaluation */}
                <VStack gap={4} align="stretch">
                    {aiReport ? (
                        <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                            <Flex align="center" gap={2} mb={4}>
                                <FiCpu />
                                <Text fontWeight="semibold">AI Evaluation Report</Text>
                                <Badge colorScheme="cyan" ml="auto">AI</Badge>
                            </Flex>

                            <SimpleGrid columns={2} gap={3} mb={4}>
                                <Box bg="blue.50" p={3} borderRadius="md" textAlign="center">
                                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                        {submission.ai_score ?? '—'}
                                    </Text>
                                    <Text fontSize="xs" color="blue.600">AI Score</Text>
                                </Box>
                                <Box
                                    bg={submission.plagiarism_score > 50 ? 'red.50' : 'green.50'}
                                    p={3}
                                    borderRadius="md"
                                    textAlign="center"
                                >
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={submission.plagiarism_score > 50 ? 'red.600' : 'green.600'}
                                    >
                                        {submission.plagiarism_score ?? '—'}%
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        color={submission.plagiarism_score > 50 ? 'red.600' : 'green.600'}
                                    >
                                        Plagiarism
                                    </Text>
                                </Box>
                            </SimpleGrid>

                            {submission.ai_generated_score != null && (
                                <Box
                                    bg={submission.ai_generated_score > 70 ? 'orange.50' : 'gray.50'}
                                    p={3}
                                    borderRadius="md"
                                    mb={4}
                                >
                                    <Flex align="center" gap={2}>
                                        <FiAlertTriangle color={submission.ai_generated_score > 70 ? 'orange' : 'gray'} />
                                        <Text fontSize="sm" fontWeight="medium">
                                            AI-Generated Detection: {submission.ai_generated_score}%
                                        </Text>
                                    </Flex>
                                </Box>
                            )}

                            {aiReport.feedback && (
                                <>
                                    <Text fontWeight="medium" fontSize="sm" mb={2}>AI Feedback</Text>
                                    <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                                        {aiReport.feedback}
                                    </Text>
                                </>
                            )}

                            {aiReport.strengths && (
                                <>
                                    <Box borderBottomWidth="1px" borderColor="gray.200" my={3} />
                                    <Text fontWeight="medium" fontSize="sm" mb={1} color="green.600">Strengths</Text>
                                    <VStack align="start" gap={1}>
                                        {(Array.isArray(aiReport.strengths) ? aiReport.strengths : [aiReport.strengths]).map((s, i) => (
                                            <Text key={i} fontSize="sm" color="gray.700">• {s}</Text>
                                        ))}
                                    </VStack>
                                </>
                            )}

                            {aiReport.improvements && (
                                <>
                                    <Box borderBottomWidth="1px" borderColor="gray.200" my={3} />
                                    <Text fontWeight="medium" fontSize="sm" mb={1} color="orange.600">Areas to Improve</Text>
                                    <VStack align="start" gap={1}>
                                        {(Array.isArray(aiReport.improvements) ? aiReport.improvements : [aiReport.improvements]).map((s, i) => (
                                            <Text key={i} fontSize="sm" color="gray.700">• {s}</Text>
                                        ))}
                                    </VStack>
                                </>
                            )}
                        </Box>
                    ) : (
                        <Box bg="gray.50" p={5} borderRadius="lg" borderWidth="1px" borderStyle="dashed" textAlign="center">
                            <FiCpu size={24} style={{ margin: '0 auto 8px' }} />
                            <Text color="gray.500" fontSize="sm">No AI evaluation report yet.</Text>
                        </Box>
                    )}
                </VStack>
            </SimpleGrid>

            {/* Grading Form */}
            <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                <Text fontWeight="semibold" fontSize="lg" mb={5}>Instructor Grading</Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Score (0–100)</Text>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={data.instructor_score || 0}
                                    onChange={(e) => setData('instructor_score', Number(e.target.value))}
                                    style={{ width: '100%', accentColor: '#3182CE' }}
                                />
                            </Box>
                            <Input
                                type="number"
                                value={data.instructor_score}
                                onChange={(e) => setData('instructor_score', Number(e.target.value))}
                                min="0"
                                max="100"
                                w="80px"
                            />
                        </HStack>
                        {errors.instructor_score && <Text fontSize="sm" color="red.500" mt={1}>{errors.instructor_score}</Text>}
                    </Box>

                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>Decision</Text>
                        <VStack align="start" gap={2}>
                            {['approve', 'reject', 'return'].map((opt) => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="decision"
                                        value={opt}
                                        checked={data.decision === opt}
                                        onChange={() => setData('decision', opt)}
                                    />
                                    <Text fontSize="sm" textTransform="capitalize">{opt}</Text>
                                </label>
                            ))}
                        </VStack>
                        {errors.decision && <Text fontSize="sm" color="red.500" mt={1}>{errors.decision}</Text>}
                    </Box>
                </SimpleGrid>

                <Box mt={5}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Instructor Feedback</Text>
                    <Textarea
                        value={data.instructor_feedback}
                        onChange={(e) => setData('instructor_feedback', e.target.value)}
                        rows={5}
                        placeholder="Provide constructive feedback to the student..."
                    />
                    {errors.instructor_feedback && <Text fontSize="sm" color="red.500" mt={1}>{errors.instructor_feedback}</Text>}
                </Box>

                <HStack justify="flex-end" gap={3} mt={5}>
                    <Link href={route('instructor.submissions.index')}>
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={processing}
                        loadingText="Submitting grade..."
                    >
                        Submit Grade
                    </Button>
                </HStack>
            </Box>
        </InstructorLayout>
    );
}

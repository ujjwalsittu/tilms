import { Head, Link, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import MonacoEditor from '@/Components/CodeEditor/MonacoEditor';
import {
    Box,
    Button,
    Badge,
    Text,
    Flex,
    HStack,
    VStack,
} from '@chakra-ui/react';

// ─── Score gauge ──────────────────────────────────────────────────────────────
function ScoreDisplay({ label, score, max = 100, colorScheme = 'blue' }) {
    const pct = Math.round((score / max) * 100);
    const barColor = pct >= 70 ? 'green.400' : pct >= 50 ? 'yellow.400' : 'red.400';

    return (
        <Box>
            <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">{label}</Text>
                <Text fontSize="sm" fontWeight="bold">{score} / {max}</Text>
            </Flex>
            <Box bg="gray.200" borderRadius="full" h="8px" overflow="hidden">
                <Box bg={barColor} h="100%" w={`${pct}%`} borderRadius="full" transition="width 0.4s" />
            </Box>
        </Box>
    );
}

// ─── Section heading with divider ─────────────────────────────────────────────
function SectionHeading({ children, color = 'gray.700' }) {
    return (
        <Box borderBottomWidth="1px" pb={2} mb={4}>
            <Text fontWeight="semibold" fontSize="md" color={color}>{children}</Text>
        </Box>
    );
}

export default function SubmissionResult({ submission, task, cohort }) {
    const hasAiEval = submission?.ai_score !== null && submission?.ai_score !== undefined;
    const hasInstructorReview =
        submission?.instructor_score !== null && submission?.instructor_score !== undefined;
    const isReturned = submission?.status === 'returned';
    const isDraft = submission?.status === 'draft';

    const handleRetry = () => {
        router.get(route('student.tasks.show', submission.cohort_task_id));
    };

    return (
        <StudentLayout title={`Result – ${task?.title ?? 'Task'}`}>
            <Head title={`Result – ${task?.title ?? 'Task'}`} />
            <FlashMessage />

            <Box maxW="900px" mx="auto" px={4} py={6}>
                {/* ── Header ── */}
                <Flex mb={6} align="flex-start" justify="space-between" flexWrap="wrap" gap={3}>
                    <Box>
                        <HStack mb={1} gap={2}>
                            <Link href={route('student.cohorts.show', cohort?.id)}>
                                <Text fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                    ← Back to Cohort
                                </Text>
                            </Link>
                        </HStack>
                        <Text as="h1" fontSize="2xl" fontWeight="bold">{task?.title}</Text>
                        {task?.description && (
                            <Text color="gray.600" mt={1} noOfLines={2}>{task.description}</Text>
                        )}
                    </Box>
                    <StatusBadge status={submission?.status} />
                </Flex>

                <VStack gap={6} align="stretch">
                    {/* ── Submission metadata ── */}
                    <Box borderWidth="1px" borderRadius="md" p={4}>
                        <SectionHeading>Submission Info</SectionHeading>
                        <Flex gap={8} flexWrap="wrap">
                            <Box>
                                <Text fontSize="xs" color="gray.500" mb={0.5}>Status</Text>
                                <StatusBadge status={submission?.status} />
                            </Box>
                            {submission?.submitted_at && (
                                <Box>
                                    <Text fontSize="xs" color="gray.500" mb={0.5}>Submitted</Text>
                                    <Text fontSize="sm">{new Date(submission.submitted_at).toLocaleString()}</Text>
                                </Box>
                            )}
                            {submission?.code_language && (
                                <Box>
                                    <Text fontSize="xs" color="gray.500" mb={0.5}>Language</Text>
                                    <Badge colorPalette="blue" variant="subtle">{submission.code_language}</Badge>
                                </Box>
                            )}
                            {submission?.attempt_number && (
                                <Box>
                                    <Text fontSize="xs" color="gray.500" mb={0.5}>Attempt</Text>
                                    <Text fontSize="sm">#{submission.attempt_number}</Text>
                                </Box>
                            )}
                        </Flex>
                    </Box>

                    {/* ── AI Evaluation ── */}
                    {hasAiEval && (
                        <Box borderWidth="1px" borderRadius="md" p={4} borderColor="blue.200">
                            <SectionHeading color="blue.700">AI Evaluation</SectionHeading>

                            <VStack gap={3} align="stretch" mb={4}>
                                <ScoreDisplay label="Overall Score" score={submission.ai_score} />

                                {submission.ai_plagiarism_score !== null &&
                                    submission.ai_plagiarism_score !== undefined && (
                                        <Box>
                                            <Flex justify="space-between" mb={1}>
                                                <Text fontSize="sm" color="gray.600">Plagiarism Risk</Text>
                                                <Badge
                                                    colorPalette={
                                                        submission.ai_plagiarism_score > 50
                                                            ? 'red'
                                                            : submission.ai_plagiarism_score > 20
                                                            ? 'yellow'
                                                            : 'green'
                                                    }
                                                    variant="subtle"
                                                >
                                                    {submission.ai_plagiarism_score}%
                                                </Badge>
                                            </Flex>
                                        </Box>
                                    )}

                                {submission.ai_generated_code_score !== null &&
                                    submission.ai_generated_code_score !== undefined && (
                                        <Box>
                                            <Flex justify="space-between" mb={1}>
                                                <Text fontSize="sm" color="gray.600">AI-Generated Code</Text>
                                                <Badge
                                                    colorPalette={
                                                        submission.ai_generated_code_score > 70
                                                            ? 'red'
                                                            : submission.ai_generated_code_score > 40
                                                            ? 'yellow'
                                                            : 'green'
                                                    }
                                                    variant="subtle"
                                                >
                                                    {submission.ai_generated_code_score}%
                                                </Badge>
                                            </Flex>
                                        </Box>
                                    )}
                            </VStack>

                            {submission.ai_feedback && (
                                <Box bg="blue.50" p={4} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.400">
                                    <Text fontSize="sm" fontWeight="semibold" color="blue.700" mb={2}>
                                        Feedback
                                    </Text>
                                    <Text fontSize="sm" color="blue.800" whiteSpace="pre-wrap">
                                        {submission.ai_feedback}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* ── Instructor Review ── */}
                    {hasInstructorReview && (
                        <Box borderWidth="1px" borderRadius="md" p={4} borderColor="green.200">
                            <SectionHeading color="green.700">Instructor Review</SectionHeading>

                            <VStack gap={3} align="stretch" mb={4}>
                                <ScoreDisplay
                                    label="Final Score"
                                    score={submission.instructor_score}
                                    colorScheme="green"
                                />
                            </VStack>

                            {submission.instructor_feedback && (
                                <Box bg="green.50" p={4} borderRadius="md" borderLeftWidth="3px" borderLeftColor="green.400">
                                    <Text fontSize="sm" fontWeight="semibold" color="green.700" mb={2}>
                                        Instructor Feedback
                                    </Text>
                                    <Text fontSize="sm" color="green.800" whiteSpace="pre-wrap">
                                        {submission.instructor_feedback}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* ── Returned — retry prompt ── */}
                    {isReturned && (
                        <Box
                            borderWidth="1px"
                            borderRadius="md"
                            p={4}
                            borderColor="orange.200"
                            bg="orange.50"
                        >
                            <SectionHeading color="orange.700">Revision Required</SectionHeading>
                            <Text fontSize="sm" color="orange.800" mb={4}>
                                Your submission has been returned for revision. Please review the instructor feedback above,
                                make the necessary changes, and resubmit.
                            </Text>
                            <Button colorPalette="orange" size="sm" onClick={handleRetry}>
                                Revise and Resubmit
                            </Button>
                        </Box>
                    )}

                    {/* ── Submitted Code ── */}
                    {submission?.code_content && (
                        <Box>
                            <SectionHeading>Submitted Code</SectionHeading>
                            <MonacoEditor
                                value={submission.code_content}
                                language={submission.code_language ?? 'javascript'}
                                height="350px"
                                readOnly
                            />
                        </Box>
                    )}

                    {/* ── GitHub submission ── */}
                    {submission?.github_repo_url && (
                        <Box borderWidth="1px" borderRadius="md" p={4}>
                            <SectionHeading>Submitted Repository</SectionHeading>
                            <VStack gap={2} align="stretch">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="sm" color="gray.500">Repository URL</Text>
                                    <a
                                        href={submission.github_repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Text fontSize="sm" color="blue.500" textDecoration="underline">
                                            {submission.github_repo_url}
                                        </Text>
                                    </a>
                                </Flex>
                                {submission.github_commit_sha && (
                                    <Flex justify="space-between" align="center">
                                        <Text fontSize="sm" color="gray.500">Commit SHA</Text>
                                        <Text fontSize="sm" fontFamily="mono" color="gray.700">
                                            {submission.github_commit_sha}
                                        </Text>
                                    </Flex>
                                )}
                            </VStack>
                        </Box>
                    )}

                    {/* ── Actions ── */}
                    <HStack gap={3} justify="flex-end" pt={2}>
                        <Link href={route('student.tasks.show', submission?.cohort_task_id)}>
                            <Button variant="outline" size="sm">View Task</Button>
                        </Link>
                        <Link href={route('student.cohorts.show', cohort?.id)}>
                            <Button variant="ghost" size="sm">Back to Cohort</Button>
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </StudentLayout>
    );
}

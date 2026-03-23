import { Head, Link, useForm, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import StatusBadge from '@/Components/Shared/StatusBadge';
import MonacoEditor from '@/Components/CodeEditor/MonacoEditor';
import LanguageSelector from '@/Components/CodeEditor/LanguageSelector';
import {
    Box,
    Button,
    Badge,
    Text,
    Flex,
    Grid,
    GridItem,
    HStack,
    VStack,
    Textarea,
    Input,
} from '@chakra-ui/react';

// ─── Difficulty badge colour helper ──────────────────────────────────────────
function difficultyColor(level) {
    const map = { beginner: 'green', intermediate: 'yellow', advanced: 'red', expert: 'purple' };
    return map[level?.toLowerCase()] ?? 'gray';
}

// ─── Code submission sub-form ─────────────────────────────────────────────────
function CodeSubmissionForm({ cohortTask, submission, task }) {
    const { data, setData, post, put, processing, errors } = useForm({
        code_content: submission?.code_content ?? task?.starter_code ?? '',
        code_language: submission?.code_language ?? task?.programming_language ?? 'javascript',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.tasks.code-submit', cohortTask.id));
    };

    const handleSaveDraft = (e) => {
        e.preventDefault();
        if (submission?.id) {
            put(route('student.tasks.code-save', submission.id));
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <HStack mb={3} justify="space-between">
                <LanguageSelector
                    value={data.code_language}
                    onChange={(v) => setData('code_language', v)}
                />
                <HStack gap={2}>
                    {submission?.id && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSaveDraft}
                            loading={processing}
                            type="button"
                        >
                            Save Draft
                        </Button>
                    )}
                    <Button size="sm" colorPalette="blue" type="submit" loading={processing}>
                        Submit Code
                    </Button>
                </HStack>
            </HStack>

            <MonacoEditor
                value={data.code_content}
                onChange={(v) => setData('code_content', v)}
                language={data.code_language}
                height="350px"
            />

            {errors.code_content && (
                <Text color="red.500" fontSize="sm" mt={1}>{errors.code_content}</Text>
            )}
        </Box>
    );
}

// ─── GitHub submission sub-form ───────────────────────────────────────────────
function GitHubSubmissionForm({ cohortTask, submission }) {
    const { data, setData, post, processing, errors } = useForm({
        github_repo_url: submission?.github_repo_url ?? '',
        github_commit_sha: submission?.github_commit_sha ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.tasks.github-submit', cohortTask.id));
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
                <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>GitHub Repository URL *</Text>
                    <Input
                        value={data.github_repo_url}
                        onChange={(e) => setData('github_repo_url', e.target.value)}
                        placeholder="https://github.com/username/repository"
                        borderColor={errors.github_repo_url ? 'red.400' : undefined}
                    />
                    {errors.github_repo_url && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.github_repo_url}</Text>
                    )}
                </Box>

                <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Commit SHA{' '}
                        <Text as="span" color="gray.500" fontWeight="normal">(optional)</Text>
                    </Text>
                    <Input
                        value={data.github_commit_sha}
                        onChange={(e) => setData('github_commit_sha', e.target.value)}
                        placeholder="abc1234"
                        fontFamily="mono"
                        borderColor={errors.github_commit_sha ? 'red.400' : undefined}
                    />
                    {errors.github_commit_sha && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.github_commit_sha}</Text>
                    )}
                </Box>

                <Button colorPalette="blue" type="submit" loading={processing} alignSelf="flex-start">
                    Submit Project
                </Button>
            </VStack>
        </Box>
    );
}

// ─── Submission result panel ──────────────────────────────────────────────────
function SubmissionResult({ submission, cohortTask }) {
    const isGraded = ['graded', 'ai_reviewed'].includes(submission.status);
    const isReturned = submission.status === 'returned';

    return (
        <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
            <HStack mb={3} justify="space-between">
                <Text fontWeight="semibold">Submission Status</Text>
                <StatusBadge status={submission.status} />
            </HStack>

            {/* AI evaluation */}
            {(submission.ai_score !== null && submission.ai_score !== undefined) && (
                <Box mb={4}>
                    <Box borderBottomWidth="1px" mb={3} pb={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="blue.600">AI Evaluation</Text>
                    </Box>
                    <HStack gap={6} mb={2}>
                        <Box>
                            <Text fontSize="xs" color="gray.500">Score</Text>
                            <Text fontWeight="bold" fontSize="lg">{submission.ai_score} / 100</Text>
                        </Box>
                        {submission.ai_plagiarism_score !== null && submission.ai_plagiarism_score !== undefined && (
                            <Box>
                                <Text fontSize="xs" color="gray.500">Plagiarism</Text>
                                <Text fontWeight="bold" fontSize="lg">{submission.ai_plagiarism_score}%</Text>
                            </Box>
                        )}
                        {submission.ai_generated_code_score !== null && submission.ai_generated_code_score !== undefined && (
                            <Box>
                                <Text fontSize="xs" color="gray.500">AI-Generated</Text>
                                <Text fontWeight="bold" fontSize="lg">{submission.ai_generated_code_score}%</Text>
                            </Box>
                        )}
                    </HStack>
                    {submission.ai_feedback && (
                        <Box bg="blue.50" p={3} borderRadius="md">
                            <Text fontSize="sm" color="blue.800" whiteSpace="pre-wrap">
                                {submission.ai_feedback}
                            </Text>
                        </Box>
                    )}
                </Box>
            )}

            {/* Instructor review */}
            {submission.instructor_score !== null && submission.instructor_score !== undefined && (
                <Box mb={4}>
                    <Box borderBottomWidth="1px" mb={3} pb={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="green.600">Instructor Review</Text>
                    </Box>
                    <Box mb={2}>
                        <Text fontSize="xs" color="gray.500">Final Score</Text>
                        <Text fontWeight="bold" fontSize="lg">{submission.instructor_score} / 100</Text>
                    </Box>
                    {submission.instructor_feedback && (
                        <Box bg="green.50" p={3} borderRadius="md">
                            <Text fontSize="sm" color="green.800" whiteSpace="pre-wrap">
                                {submission.instructor_feedback}
                            </Text>
                        </Box>
                    )}
                </Box>
            )}

            {/* Returned — allow retry */}
            {isReturned && (
                <Box mt={3}>
                    <Box bg="orange.50" p={3} borderRadius="md" mb={3}>
                        <Text fontSize="sm" color="orange.800">
                            Your submission has been returned for revision. Please review the feedback and resubmit.
                        </Text>
                    </Box>
                    <Button
                        size="sm"
                        colorPalette="orange"
                        onClick={() => router.post(route('student.tasks.code-submit', cohortTask.id))}
                    >
                        Resubmit
                    </Button>
                </Box>
            )}
        </Box>
    );
}

// ─── Discussion thread ────────────────────────────────────────────────────────
function DiscussionThread({ cohortTask, discussions }) {
    const { data, setData, post, processing, reset, errors } = useForm({ body: '', parent_id: null });
    const [replyTo, setReplyTo] = React.useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.discussions.store', cohortTask.id), {
            onSuccess: () => { reset(); setReplyTo(null); },
        });
    };

    const handleReply = (discussion) => {
        setReplyTo(discussion.id);
        setData('parent_id', discussion.id);
    };

    const topLevel = discussions.filter((d) => !d.parent_id);

    const renderMessage = (discussion, depth = 0) => {
        const replies = discussions.filter((d) => d.parent_id === discussion.id);
        return (
            <Box key={discussion.id} ml={depth * 6} mt={3}>
                <Box borderWidth="1px" borderRadius="md" p={3} bg={depth > 0 ? 'gray.50' : 'white'}>
                    <HStack mb={1} justify="space-between">
                        <HStack gap={2}>
                            <Box
                                w="28px" h="28px" borderRadius="full" bg="blue.500"
                                display="flex" alignItems="center" justifyContent="center"
                            >
                                <Text fontSize="xs" color="white" fontWeight="bold">
                                    {discussion.user?.name?.[0]?.toUpperCase() ?? '?'}
                                </Text>
                            </Box>
                            <Text fontSize="sm" fontWeight="semibold">{discussion.user?.name ?? 'Unknown'}</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.400">
                            {new Date(discussion.created_at).toLocaleString()}
                        </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" mt={1}>{discussion.body}</Text>
                    <Button
                        size="xs"
                        variant="ghost"
                        mt={2}
                        onClick={() => handleReply(discussion)}
                        color="blue.500"
                    >
                        Reply
                    </Button>
                </Box>

                {/* Inline reply form */}
                {replyTo === discussion.id && (
                    <Box ml={6} mt={2} as="form" onSubmit={handleSubmit}>
                        <Textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Write a reply..."
                            size="sm"
                            rows={2}
                            mb={2}
                            borderColor={errors.body ? 'red.400' : undefined}
                        />
                        {errors.body && <Text color="red.500" fontSize="xs" mb={1}>{errors.body}</Text>}
                        <HStack gap={2}>
                            <Button size="xs" colorPalette="blue" type="submit" loading={processing}>Post Reply</Button>
                            <Button
                                size="xs"
                                variant="ghost"
                                type="button"
                                onClick={() => { setReplyTo(null); setData('parent_id', null); }}
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </Box>
                )}

                {replies.map((r) => renderMessage(r, depth + 1))}
            </Box>
        );
    };

    return (
        <Box>
            <Text fontWeight="semibold" mb={3}>Discussion</Text>

            {topLevel.length === 0 ? (
                <Text fontSize="sm" color="gray.500" mb={4}>No messages yet. Be the first to start a discussion!</Text>
            ) : (
                <Box mb={4}>{topLevel.map((d) => renderMessage(d))}</Box>
            )}

            {/* New top-level message form */}
            {!replyTo && (
                <Box as="form" onSubmit={handleSubmit} mt={4}>
                    <Box borderBottomWidth="1px" mb={3} pb={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">Add a message</Text>
                    </Box>
                    <Textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Ask a question or share an insight..."
                        rows={3}
                        mb={2}
                        borderColor={errors.body ? 'red.400' : undefined}
                    />
                    {errors.body && <Text color="red.500" fontSize="sm" mb={1}>{errors.body}</Text>}
                    <Button colorPalette="blue" size="sm" type="submit" loading={processing}>Post Message</Button>
                </Box>
            )}
        </Box>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
import React, { useState } from 'react';

export default function Show({ cohort, cohortTask, task, submission, discussions }) {
    return (
        <StudentLayout title={task?.title ?? 'Task'}>
            <Head title={task?.title ?? 'Task'} />
            <FlashMessage />

            <Box maxW="1200px" mx="auto" px={4} py={6}>
                <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                    {/* ── Left column ── */}
                    <GridItem>
                        {/* Task header */}
                        <Box mb={5}>
                            <HStack mb={2} gap={3} flexWrap="wrap">
                                <Badge colorPalette={difficultyColor(task?.difficulty)} variant="subtle" textTransform="capitalize">
                                    {task?.difficulty}
                                </Badge>
                                <Badge variant="outline" textTransform="capitalize">
                                    {task?.type === 'individual' ? 'Individual Task' : 'Project'}
                                </Badge>
                                {task?.programming_language && (
                                    <Badge colorPalette="blue" variant="subtle">{task.programming_language}</Badge>
                                )}
                            </HStack>
                            <Text as="h1" fontSize="2xl" fontWeight="bold" mb={2}>{task?.title}</Text>
                            <Text color="gray.600">{task?.description}</Text>
                        </Box>

                        {/* Learning objectives */}
                        {task?.learning_objectives && (
                            <Box mb={5} p={4} bg="blue.50" borderRadius="md" borderLeftWidth="4px" borderLeftColor="blue.400">
                                <Text fontWeight="semibold" mb={2} color="blue.700">Learning Objectives</Text>
                                <Text fontSize="sm" color="blue.800" whiteSpace="pre-wrap">
                                    {task.learning_objectives}
                                </Text>
                            </Box>
                        )}

                        {/* Submission form */}
                        {(!submission || submission.status === 'draft' || submission.status === 'returned') && (
                            <Box mb={6}>
                                <Box borderBottomWidth="1px" mb={4} pb={2}>
                                    <Text fontWeight="semibold" fontSize="lg">
                                        {task?.type === 'project' ? 'Submit Your Project' : 'Submit Your Code'}
                                    </Text>
                                </Box>

                                {task?.type === 'project' ? (
                                    <GitHubSubmissionForm cohortTask={cohortTask} submission={submission} />
                                ) : (
                                    <CodeSubmissionForm
                                        cohortTask={cohortTask}
                                        submission={submission}
                                        task={task}
                                    />
                                )}
                            </Box>
                        )}

                        {/* Submission result */}
                        {submission && submission.status !== 'draft' && (
                            <Box mb={6}>
                                <SubmissionResult submission={submission} cohortTask={cohortTask} />
                            </Box>
                        )}

                        {/* Submitted code / repo preview */}
                        {submission?.code_content && (
                            <Box mb={6}>
                                <Box borderBottomWidth="1px" mb={3} pb={1}>
                                    <Text fontWeight="semibold">Submitted Code</Text>
                                </Box>
                                <MonacoEditor
                                    value={submission.code_content}
                                    language={submission.code_language ?? 'javascript'}
                                    height="250px"
                                    readOnly
                                />
                            </Box>
                        )}

                        {submission?.github_repo_url && (
                            <Box mb={6} p={3} borderWidth="1px" borderRadius="md">
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Submitted Repository</Text>
                                <a href={submission.github_repo_url} target="_blank" rel="noopener noreferrer">
                                    <Text fontSize="sm" color="blue.500" textDecoration="underline">
                                        {submission.github_repo_url}
                                    </Text>
                                </a>
                                {submission.github_commit_sha && (
                                    <Text fontSize="xs" color="gray.500" fontFamily="mono" mt={1}>
                                        SHA: {submission.github_commit_sha}
                                    </Text>
                                )}
                            </Box>
                        )}

                        {/* Discussion */}
                        <Box borderTopWidth="1px" pt={5} mt={2}>
                            <DiscussionThread cohortTask={cohortTask} discussions={discussions ?? []} />
                        </Box>
                    </GridItem>

                    {/* ── Right column ── */}
                    <GridItem>
                        <VStack gap={4} align="stretch">
                            {/* Task info card */}
                            <Box borderWidth="1px" borderRadius="md" p={4}>
                                <Text fontWeight="semibold" mb={3}>Task Details</Text>
                                <VStack gap={3} align="stretch">
                                    <Flex justify="space-between">
                                        <Text fontSize="sm" color="gray.500">Difficulty</Text>
                                        <Badge colorPalette={difficultyColor(task?.difficulty)} variant="subtle" textTransform="capitalize">
                                            {task?.difficulty}
                                        </Badge>
                                    </Flex>
                                    {task?.programming_language && (
                                        <Flex justify="space-between">
                                            <Text fontSize="sm" color="gray.500">Language</Text>
                                            <Text fontSize="sm" fontWeight="medium">{task.programming_language}</Text>
                                        </Flex>
                                    )}
                                    {task?.estimated_time && (
                                        <Flex justify="space-between">
                                            <Text fontSize="sm" color="gray.500">Est. Time</Text>
                                            <Text fontSize="sm" fontWeight="medium">{task.estimated_time} min</Text>
                                        </Flex>
                                    )}
                                    {cohortTask?.due_date && (
                                        <Flex justify="space-between">
                                            <Text fontSize="sm" color="gray.500">Due Date</Text>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {new Date(cohortTask.due_date).toLocaleDateString()}
                                            </Text>
                                        </Flex>
                                    )}
                                    {cohortTask?.max_attempts && (
                                        <Flex justify="space-between">
                                            <Text fontSize="sm" color="gray.500">Max Attempts</Text>
                                            <Text fontSize="sm" fontWeight="medium">{cohortTask.max_attempts}</Text>
                                        </Flex>
                                    )}
                                    {cohortTask?.passing_score !== undefined && cohortTask?.passing_score !== null && (
                                        <Flex justify="space-between">
                                            <Text fontSize="sm" color="gray.500">Passing Score</Text>
                                            <Text fontSize="sm" fontWeight="medium">{cohortTask.passing_score}%</Text>
                                        </Flex>
                                    )}
                                </VStack>
                            </Box>

                            {/* Current submission status */}
                            {submission && (
                                <Box borderWidth="1px" borderRadius="md" p={4}>
                                    <Text fontWeight="semibold" mb={3}>Your Submission</Text>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontSize="sm" color="gray.500">Status</Text>
                                        <StatusBadge status={submission.status} />
                                    </Flex>
                                    {submission.submitted_at && (
                                        <Flex justify="space-between" mb={2}>
                                            <Text fontSize="sm" color="gray.500">Submitted</Text>
                                            <Text fontSize="sm">{new Date(submission.submitted_at).toLocaleString()}</Text>
                                        </Flex>
                                    )}
                                    {(submission.ai_score !== null && submission.ai_score !== undefined) && (
                                        <Flex justify="space-between" mb={2}>
                                            <Text fontSize="sm" color="gray.500">AI Score</Text>
                                            <Text fontSize="sm" fontWeight="bold">{submission.ai_score} / 100</Text>
                                        </Flex>
                                    )}
                                    {(submission.instructor_score !== null && submission.instructor_score !== undefined) && (
                                        <Flex justify="space-between">
                                            <Text fontSize="sm" color="gray.500">Final Score</Text>
                                            <Text fontSize="sm" fontWeight="bold" color="green.600">
                                                {submission.instructor_score} / 100
                                            </Text>
                                        </Flex>
                                    )}
                                </Box>
                            )}

                            {/* Full-screen editor link for individual tasks */}
                            {task?.type === 'individual' && (
                                <Link href={route('student.tasks.code-editor', cohortTask.id)}>
                                    <Button w="full" variant="outline" colorPalette="blue" size="sm">
                                        Open Full-Screen Editor
                                    </Button>
                                </Link>
                            )}

                            {/* Back to cohort */}
                            <Link href={route('student.cohorts.show', cohort?.id)}>
                                <Button w="full" variant="ghost" size="sm">
                                    ← Back to Cohort
                                </Button>
                            </Link>
                        </VStack>
                    </GridItem>
                </Grid>
            </Box>
        </StudentLayout>
    );
}

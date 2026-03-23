import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    Box,
    Flex,
    Text,
    Button,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { FiBriefcase, FiPlay, FiChevronRight, FiCpu } from 'react-icons/fi';

const DOMAINS = [
    { value: 'web_development', label: 'Web Development' },
    { value: 'mern_stack', label: 'MERN Stack' },
    { value: 'data_science', label: 'Data Science' },
    { value: 'ai_engineering', label: 'AI Engineering' },
    { value: 'data_analytics', label: 'Data Analytics' },
    { value: 'php', label: 'PHP' },
    { value: 'cloud_architecture', label: 'Cloud Architecture' },
];

const DIFFICULTIES = [
    { value: 'beginner', label: 'Beginner', color: 'green' },
    { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
    { value: 'advanced', label: 'Advanced', color: 'red' },
];

const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    background: 'white',
    color: '#4a5568',
};

export default function InterviewSimulator({ interviews }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        domain: '',
        difficulty: 'intermediate',
    });

    const handleStart = (e) => {
        e.preventDefault();
        post(route('student.ai.interview.start'));
    };

    const getDifficultyColor = (difficulty) => {
        const found = DIFFICULTIES.find((d) => d.value === difficulty);
        return found ? found.color : 'gray';
    };

    const getDomainLabel = (value) => {
        const found = DOMAINS.find((d) => d.value === value);
        return found ? found.label : value;
    };

    return (
        <StudentLayout title="AI Interview Simulator">
            <Head title="AI Interview Simulator" />

            <Box maxW="4xl" mx="auto" px={4} py={6}>
                {/* Header */}
                <Flex justify="space-between" align="flex-start" mb={6}>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            AI Interview Simulator
                        </Text>
                        <Text color="gray.500" mt={1} fontSize="sm">
                            Practice technical interviews with an AI interviewer. Choose your domain and difficulty to get started.
                        </Text>
                    </Box>
                    <Button
                        colorPalette="blue"
                        onClick={() => setShowForm(!showForm)}
                        size="sm"
                    >
                        <FiPlay style={{ marginRight: '6px' }} />
                        Start Interview
                    </Button>
                </Flex>

                {/* Start interview form */}
                {showForm && (
                    <Box
                        bg="white"
                        borderWidth="1px"
                        borderColor="blue.200"
                        borderRadius="lg"
                        p={5}
                        mb={6}
                        boxShadow="sm"
                    >
                        <Flex align="center" gap={2} mb={4}>
                            <Box color="blue.500">
                                <FiCpu size={18} />
                            </Box>
                            <Text fontWeight="semibold" color="gray.700">
                                Configure Your Interview
                            </Text>
                        </Flex>

                        <form onSubmit={handleStart}>
                            <VStack gap={4} align="stretch">
                                <Flex gap={4} wrap="wrap">
                                    <Box flex={1} minW="200px">
                                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                                            Domain <Box as="span" color="red.500">*</Box>
                                        </Text>
                                        <select
                                            value={data.domain}
                                            onChange={(e) => setData('domain', e.target.value)}
                                            style={selectStyle}
                                            required
                                        >
                                            <option value="">Select domain...</option>
                                            {DOMAINS.map((d) => (
                                                <option key={d.value} value={d.value}>
                                                    {d.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.domain && (
                                            <Text fontSize="xs" color="red.500" mt={1}>
                                                {errors.domain}
                                            </Text>
                                        )}
                                    </Box>

                                    <Box flex={1} minW="200px">
                                        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                                            Difficulty
                                        </Text>
                                        <select
                                            value={data.difficulty}
                                            onChange={(e) => setData('difficulty', e.target.value)}
                                            style={selectStyle}
                                        >
                                            {DIFFICULTIES.map((d) => (
                                                <option key={d.value} value={d.value}>
                                                    {d.label}
                                                </option>
                                            ))}
                                        </select>
                                    </Box>
                                </Flex>

                                {/* Difficulty info */}
                                <Box
                                    bg="blue.50"
                                    borderRadius="md"
                                    p={3}
                                    borderWidth="1px"
                                    borderColor="blue.100"
                                >
                                    <Text fontSize="xs" color="blue.700">
                                        The AI interviewer will ask you questions relevant to your selected domain and adjust
                                        the complexity based on difficulty level. Answer naturally as you would in a real interview.
                                    </Text>
                                </Box>

                                <Flex justify="flex-end" gap={3}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        colorPalette="blue"
                                        type="submit"
                                        size="sm"
                                        loading={processing}
                                        disabled={!data.domain}
                                    >
                                        <FiPlay style={{ marginRight: '6px' }} />
                                        Start Interview
                                    </Button>
                                </Flex>
                            </VStack>
                        </form>
                    </Box>
                )}

                {/* Past interviews */}
                <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={3}>
                        Past Interviews
                    </Text>

                    {interviews.data.length === 0 ? (
                        <Box
                            textAlign="center"
                            py={12}
                            bg="white"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="gray.200"
                        >
                            <Box color="gray.300" mb={3} fontSize="3xl">
                                <FiBriefcase style={{ margin: '0 auto' }} />
                            </Box>
                            <Text color="gray.500" fontSize="sm">
                                No interviews yet. Start your first mock interview!
                            </Text>
                        </Box>
                    ) : (
                        <VStack gap={3} align="stretch">
                            {interviews.data.map((interview) => (
                                <Link
                                    key={interview.id}
                                    href={route('student.ai.interview.show', interview.id)}
                                >
                                    <Box
                                        bg="white"
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        borderRadius="lg"
                                        p={4}
                                        _hover={{ borderColor: 'blue.300', boxShadow: 'sm' }}
                                        transition="all 0.15s"
                                        cursor="pointer"
                                    >
                                        <Flex justify="space-between" align="flex-start">
                                            <Box flex={1} mr={3}>
                                                <HStack gap={2} mb={1} wrap="wrap">
                                                    <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                                                        {interview.title || getDomainLabel(interview.context_data?.domain) || 'Interview Session'}
                                                    </Text>
                                                    {interview.context_data?.domain && (
                                                        <Badge colorPalette="blue" fontSize="xs">
                                                            {getDomainLabel(interview.context_data.domain)}
                                                        </Badge>
                                                    )}
                                                    {interview.context_data?.difficulty && (
                                                        <Badge
                                                            colorPalette={getDifficultyColor(interview.context_data.difficulty)}
                                                            fontSize="xs"
                                                        >
                                                            {interview.context_data.difficulty}
                                                        </Badge>
                                                    )}
                                                </HStack>
                                                {interview.total_tokens_used != null && (
                                                    <Text fontSize="xs" color="gray.500">
                                                        {interview.total_tokens_used.toLocaleString()} tokens used
                                                    </Text>
                                                )}
                                            </Box>
                                            <Flex direction="column" align="flex-end" shrink={0} gap={1}>
                                                <Text fontSize="xs" color="gray.400">
                                                    {interview.created_at
                                                        ? new Date(interview.created_at).toLocaleDateString()
                                                        : ''}
                                                </Text>
                                                <Box color="gray.400">
                                                    <FiChevronRight size={14} />
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Link>
                            ))}
                        </VStack>
                    )}

                    {/* Pagination */}
                    {interviews.last_page > 1 && (
                        <Flex justify="center" gap={2} mt={5}>
                            {interviews.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'}>
                                    <Button
                                        size="xs"
                                        variant={link.active ? 'solid' : 'outline'}
                                        colorPalette={link.active ? 'blue' : 'gray'}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </Link>
                            ))}
                        </Flex>
                    )}
                </Box>
            </Box>
        </StudentLayout>
    );
}

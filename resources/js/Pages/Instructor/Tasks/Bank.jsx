import { Head, Link, router } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import Pagination from '@/Components/Shared/Pagination';
import { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Table,
    Text,
    Badge,
    HStack,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiSend, FiSearch, FiCpu } from 'react-icons/fi';

const difficultyColor = {
    beginner: 'green',
    intermediate: 'blue',
    advanced: 'red',
};

const typeColor = {
    individual: 'purple',
    project: 'teal',
};

export default function Bank({ tasks }) {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [difficulty, setDifficulty] = useState('');

    const handleFilter = () => {
        router.get(route('instructor.tasks.bank'), { search, type, difficulty }, { preserveState: true });
    };

    return (
        <InstructorLayout title="Task Bank">
            <Head title="Task Bank" />
            <FlashMessage />

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">Task Bank</Text>
                <Link href={route('instructor.tasks.create')}>
                    <Button colorScheme="blue" leftIcon={<FiPlus />}>Create Task</Button>
                </Link>
            </Flex>

            {/* Filters */}
            <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" borderWidth="1px" mb={6}>
                <HStack gap={3} flexWrap="wrap">
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        maxW="280px"
                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                    />
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        maxW="180px"
                    >
                        <option value="">All Types</option>
                        <option value="individual">Individual</option>
                        <option value="project">Project</option>
                    </Select>
                    <Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        maxW="180px"
                    >
                        <option value="">All Difficulties</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </Select>
                    <Button onClick={handleFilter} leftIcon={<FiSearch />} colorScheme="blue" variant="outline">
                        Search
                    </Button>
                </HStack>
            </Box>

            {/* Table */}
            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" overflow="hidden">
                <Box overflowX="auto">
                    <Table.Root variant="line">
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader>Title</Table.ColumnHeader>
                                <Table.ColumnHeader>Type</Table.ColumnHeader>
                                <Table.ColumnHeader>Difficulty</Table.ColumnHeader>
                                <Table.ColumnHeader>Language</Table.ColumnHeader>
                                <Table.ColumnHeader>AI Generated</Table.ColumnHeader>
                                <Table.ColumnHeader>Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tasks.data?.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={6} textAlign="center" py={8} color="gray.500">
                                        No tasks found. Create your first task!
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {tasks.data?.map((task) => (
                                <Table.Row key={task.id} _hover={{ bg: 'gray.50' }}>
                                    <Table.Cell>
                                        <Text fontWeight="medium">{task.title}</Text>
                                        {task.tags && (
                                            <HStack gap={1} mt={1} flexWrap="wrap">
                                                {(typeof task.tags === 'string' ? task.tags.split(',') : task.tags)
                                                    .slice(0, 3)
                                                    .map((tag, i) => (
                                                        <Badge key={i} size="sm" variant="subtle" colorScheme="gray">
                                                            {tag.trim()}
                                                        </Badge>
                                                    ))}
                                            </HStack>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge colorScheme={typeColor[task.type] ?? 'gray'}>{task.type}</Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge colorScheme={difficultyColor[task.difficulty] ?? 'gray'}>
                                            {task.difficulty}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontSize="sm" color="gray.600">{task.programming_language ?? '—'}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {task.is_ai_generated ? (
                                            <Badge colorScheme="cyan" leftIcon={<FiCpu />}>AI</Badge>
                                        ) : (
                                            <Text fontSize="sm" color="gray.400">Manual</Text>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack gap={1}>
                                            <Link href={route('instructor.tasks.edit', task.id)}>
                                                <Button size="sm" variant="ghost" colorScheme="gray" aria-label="Edit">
                                                    <FiEdit2 />
                                                </Button>
                                            </Link>
                                            <Link href={route('instructor.tasks.assign', task.id)}>
                                                <Button size="sm" variant="ghost" colorScheme="blue" aria-label="Assign to Cohort">
                                                    <FiSend />
                                                </Button>
                                            </Link>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
                <Box p={4} borderTopWidth="1px">
                    <Pagination links={tasks.links} meta={tasks.meta} />
                </Box>
            </Box>
        </InstructorLayout>
    );
}

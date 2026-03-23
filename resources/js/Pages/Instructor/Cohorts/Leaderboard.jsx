import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Badge,
    Button,
    Flex,
    Text,
    Table,
} from '@chakra-ui/react';
import { FiArrowLeft, FiTrendingUp } from 'react-icons/fi';

/* Rank medal colours */
const RANK_STYLES = {
    1: { bg: '#FEF9C3', border: '#EAB308', label: '#92400E', text: '🥇' },
    2: { bg: '#F3F4F6', border: '#9CA3AF', label: '#374151', text: '🥈' },
    3: { bg: '#FEF3C7', border: '#D97706', label: '#92400E', text: '🥉' },
};

function RankCell({ rank }) {
    const style = RANK_STYLES[rank];
    if (style) {
        return (
            <Table.Cell>
                <Flex
                    w={8}
                    h={8}
                    bg={style.bg}
                    borderRadius="full"
                    borderWidth="2px"
                    borderColor={style.border}
                    align="center"
                    justify="center"
                    fontSize="lg"
                    title={`Rank ${rank}`}
                >
                    {style.text}
                </Flex>
            </Table.Cell>
        );
    }
    return (
        <Table.Cell>
            <Text fontWeight="semibold" color="gray.600" fontSize="sm">
                #{rank}
            </Text>
        </Table.Cell>
    );
}

function rowBg(rank) {
    if (rank === 1) return '#FEFCE8';   /* gold tint   */
    if (rank === 2) return '#F9FAFB';   /* silver tint */
    if (rank === 3) return '#FFFBEB';   /* bronze tint */
    return undefined;
}

export default function Leaderboard({ cohort = {}, leaderboard = [] }) {
    return (
        <InstructorLayout title="Leaderboard">
            <Head title={`Leaderboard — ${cohort.title ?? 'Cohort'}`} />
            <FlashMessage />

            {/* Header */}
            <Flex align="center" gap={4} mb={6} flexWrap="wrap">
                <Link href={route('instructor.cohorts.show', cohort.id)}>
                    <Button size="sm" variant="ghost" colorScheme="gray">
                        <FiArrowLeft size={14} style={{ marginRight: 4 }} />
                        Back
                    </Button>
                </Link>
                <Box flex={1}>
                    <Flex align="center" gap={2}>
                        <FiTrendingUp size={20} color="#2563EB" />
                        <Text fontSize="2xl" fontWeight="bold">Leaderboard</Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.500" mt={0.5}>
                        {cohort.title}
                        {cohort.type && (
                            <Badge
                                ml={2}
                                colorScheme={cohort.type === 'internship' ? 'purple' : 'blue'}
                                variant="subtle"
                                fontSize="xs"
                            >
                                {cohort.type}
                            </Badge>
                        )}
                    </Text>
                </Box>
                <Text fontSize="sm" color="gray.400">
                    {leaderboard.length} student{leaderboard.length !== 1 ? 's' : ''}
                </Text>
            </Flex>

            {/* Table */}
            <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" overflow="hidden">
                {leaderboard.length === 0 ? (
                    <Box p={14} textAlign="center">
                        <Flex justify="center" mb={4}>
                            <Flex
                                w={16}
                                h={16}
                                bg="blue.50"
                                borderRadius="full"
                                align="center"
                                justify="center"
                            >
                                <FiTrendingUp size={28} color="#2563EB" opacity={0.4} />
                            </Flex>
                        </Flex>
                        <Text fontWeight="semibold" color="gray.600" fontSize="lg" mb={1}>
                            No leaderboard data yet
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                            Leaderboard snapshots are generated as students complete tasks and submit work.
                        </Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table.Root variant="line">
                            <Table.Header>
                                <Table.Row bg="gray.50">
                                    <Table.ColumnHeader w="60px">Rank</Table.ColumnHeader>
                                    <Table.ColumnHeader>Student</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Score</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Tasks Completed</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Avg Grade</Table.ColumnHeader>
                                    <Table.ColumnHeader isNumeric>Streak Days</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {leaderboard.map((entry, index) => {
                                    const rank = entry.rank ?? index + 1;
                                    const student = entry.student ?? entry.user ?? {};
                                    const bg = rowBg(rank);
                                    const isTop3 = rank <= 3;

                                    return (
                                        <Table.Row
                                            key={entry.id ?? index}
                                            bg={bg}
                                            _hover={{ filter: 'brightness(0.97)' }}
                                            transition="filter 0.15s"
                                            fontWeight={isTop3 ? 'semibold' : 'normal'}
                                        >
                                            <RankCell rank={rank} />
                                            <Table.Cell>
                                                <Flex align="center" gap={3}>
                                                    <Flex
                                                        w={8}
                                                        h={8}
                                                        bg={isTop3 ? 'blue.100' : 'gray.100'}
                                                        borderRadius="full"
                                                        align="center"
                                                        justify="center"
                                                        flexShrink={0}
                                                    >
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="sm"
                                                            color={isTop3 ? 'blue.600' : 'gray.500'}
                                                            lineHeight="1"
                                                        >
                                                            {(student.name ?? '?')[0].toUpperCase()}
                                                        </Text>
                                                    </Flex>
                                                    <Box>
                                                        <Text fontSize="sm">{student.name ?? '—'}</Text>
                                                        {student.email && (
                                                            <Text fontSize="xs" color="gray.400">{student.email}</Text>
                                                        )}
                                                    </Box>
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell isNumeric>
                                                <Text
                                                    fontWeight="bold"
                                                    color={isTop3 ? 'blue.600' : 'gray.700'}
                                                    fontSize="sm"
                                                >
                                                    {entry.score ?? entry.total_score ?? '—'}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell isNumeric>
                                                <Text fontSize="sm">
                                                    {entry.tasks_completed ?? '—'}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell isNumeric>
                                                {entry.avg_grade != null ? (
                                                    <Badge
                                                        colorScheme={
                                                            entry.avg_grade >= 80 ? 'green' :
                                                            entry.avg_grade >= 60 ? 'blue' : 'orange'
                                                        }
                                                        variant="subtle"
                                                        fontSize="xs"
                                                    >
                                                        {Number(entry.avg_grade).toFixed(1)}%
                                                    </Badge>
                                                ) : (
                                                    <Text fontSize="sm" color="gray.400">—</Text>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell isNumeric>
                                                <Flex align="center" justify="flex-end" gap={1}>
                                                    {(entry.streak_days ?? 0) > 0 && (
                                                        <Text fontSize="xs">🔥</Text>
                                                    )}
                                                    <Text fontSize="sm">
                                                        {entry.streak_days ?? 0}
                                                    </Text>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                )}
            </Box>
        </InstructorLayout>
    );
}

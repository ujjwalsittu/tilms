import { Head, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Button,
    Flex,
    Input,
    Textarea,
    Text,
    VStack,
    HStack,
    Alert,
    Badge,
} from '@chakra-ui/react';
import { FiSend, FiUsers, FiMail } from 'react-icons/fi';

export default function Compose({ cohort, studentCount = 0 }) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        body: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!confirm(`Send this newsletter to ${studentCount} students in "${cohort.title}"?`)) return;
        post(route('instructor.newsletter.send', cohort.id));
    };

    return (
        <InstructorLayout title="Send Newsletter">
            <Head title={`Newsletter: ${cohort.title}`} />
            <FlashMessage />

            <Box maxW="3xl" mx="auto">
                <Flex align="center" gap={3} mb={6}>
                    <FiMail size={24} />
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold">Compose Newsletter</Text>
                        <Text color="gray.500" fontSize="sm">{cohort.title}</Text>
                    </Box>
                </Flex>

                {/* Recipients Banner */}
                <Alert.Root status="info" borderRadius="lg" mb={6}>
                    <Alert.Indicator>
                        <FiUsers />
                    </Alert.Indicator>
                    <Alert.Description>
                        <HStack gap={2}>
                            <Text>Sending to</Text>
                            <Badge colorPalette="blue" fontSize="sm">{studentCount}</Badge>
                            <Text>
                                enrolled {studentCount === 1 ? 'student' : 'students'} in
                                <Text as="span" fontWeight="semibold"> {cohort.title}</Text>
                            </Text>
                        </HStack>
                    </Alert.Description>
                </Alert.Root>

                <Box as="form" onSubmit={handleSubmit} bg="white" p={8} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                    <VStack gap={6} align="stretch">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Subject</Text>
                            <Input
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="e.g. Important update about this week's tasks"
                            />
                            {errors.subject && <Text fontSize="sm" color="red.500" mt={1}>{errors.subject}</Text>}
                        </Box>

                        <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={1}>Body</Text>
                            <Textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows={14}
                                placeholder="Write your newsletter content here. Markdown is supported."
                            />
                            {errors.body && <Text fontSize="sm" color="red.500" mt={1}>{errors.body}</Text>}
                        </Box>

                        {/* Preview info */}
                        <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px" borderColor="gray.200">
                            <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>
                                Email Preview Details
                            </Text>
                            <VStack align="start" gap={1} fontSize="sm" color="gray.500">
                                <Text>From: {cohort.instructor?.name ?? 'Instructor'} via TILMS</Text>
                                <Text>Subject: {data.subject || '(no subject)'}</Text>
                                <Text>Recipients: {studentCount} enrolled students</Text>
                            </VStack>
                        </Box>

                        <HStack justify="flex-end" gap={3}>
                            <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                            <Button
                                type="submit"
                                colorPalette="blue"
                                loading={processing}
                                loadingText="Sending..."
                                disabled={studentCount === 0}
                            ><FiSend size={14} />
                                Send to {studentCount} {studentCount === 1 ? 'Student' : 'Students'}
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </InstructorLayout>
    );
}

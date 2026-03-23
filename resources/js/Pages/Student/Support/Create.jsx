import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Input, Textarea, VStack, Text, Flex, Field, NativeSelect,
} from '@chakra-ui/react';

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export default function SupportCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        priority: 'medium',
        body: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.support.store'));
    };

    return (
        <StudentLayout title="Support">
            <Head title="Create Support Ticket" />
            <FlashMessage />

            <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} maxW="2xl">
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="xl" fontWeight="bold">Create Support Ticket</Text>
                    <Link href={route('student.support.index')}>
                        <Button variant="outline" size="sm">Back to Tickets</Button>
                    </Link>
                </Flex>

                <form onSubmit={handleSubmit}>
                    <VStack gap={5} align="stretch">
                        <Field.Root invalid={!!errors.subject}>
                            <Field.Label>Subject</Field.Label>
                            <Input
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Briefly describe your issue"
                            />
                            {errors.subject && <Field.ErrorText>{errors.subject}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.priority}>
                            <Field.Label>Priority</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                >
                                    {PRIORITY_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            {errors.priority && <Field.ErrorText>{errors.priority}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={!!errors.body}>
                            <Field.Label>Description</Field.Label>
                            <Textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                placeholder="Describe your issue in detail..."
                                rows={6}
                            />
                            {errors.body && <Field.ErrorText>{errors.body}</Field.ErrorText>}
                        </Field.Root>

                        <Flex gap={3} pt={2}>
                            <Button type="submit" colorPalette="blue" loading={processing}>
                                Submit Ticket
                            </Button>
                            <Link href={route('student.support.index')}>
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </StudentLayout>
    );
}

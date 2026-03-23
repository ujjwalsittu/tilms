import { Head, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box,
    Button,
    Textarea,
    Text,
    HStack,
    VStack,
    Alert,
    Link as ChakraLink,
    Badge,
    Flex,
} from '@chakra-ui/react';
import { FiExternalLink, FiSave, FiEye } from 'react-icons/fi';

export default function LandingPageEditor({ cohort }) {
    const { data, setData, put, processing, errors } = useForm({
        landing_page_content: cohort.landing_page_content ?? '',
        landing_page_published: cohort.landing_page_published ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('instructor.cohorts.landing-page', cohort.id));
    };

    const previewUrl = route('cohort.landing', cohort.slug ?? cohort.id);

    return (
        <InstructorLayout title="Landing Page Editor">
            <Head title={`Landing Page: ${cohort.title}`} />
            <FlashMessage />

            <Box maxW="4xl" mx="auto">
                <Flex justify="space-between" align="center" mb={6}>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold">Landing Page Editor</Text>
                        <Text color="gray.500" fontSize="sm" mt={1}>{cohort.title}</Text>
                    </Box>
                    <ChakraLink href={previewUrl} isExternal>
                        <Button size="sm" leftIcon={<FiExternalLink />} variant="outline">
                            Preview Page
                        </Button>
                    </ChakraLink>
                </Flex>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack gap={6} align="stretch">
                        {/* Status Banner */}
                        <Alert.Root status={data.landing_page_published ? 'success' : 'warning'} borderRadius="lg">
                            <Alert.Indicator />
                            <Alert.Title>
                                {data.landing_page_published
                                    ? 'Landing page is published and visible to the public.'
                                    : 'Landing page is currently unpublished (draft mode).'}
                            </Alert.Title>
                        </Alert.Root>

                        {/* Content Editor */}
                        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                            <Text fontWeight="semibold" mb={1}>Page Content</Text>
                            <Text fontSize="sm" color="gray.500" mb={4}>
                                Enter JSON content or rich text for the landing page. This powers the public-facing cohort page.
                            </Text>

                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>Content (JSON / Markdown)</Text>
                                <Textarea
                                    value={data.landing_page_content}
                                    onChange={(e) => setData('landing_page_content', e.target.value)}
                                    rows={20}
                                    fontFamily="mono"
                                    fontSize="sm"
                                    placeholder={JSON.stringify({
                                        hero: {
                                            headline: "Learn to build modern web apps",
                                            subheadline: "A hands-on internship program",
                                        },
                                        highlights: ["Real projects", "Mentor support", "Certificate"],
                                        faq: [
                                            { q: "Who is this for?", a: "Beginners and intermediate developers" }
                                        ]
                                    }, null, 2)}
                                />
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Supports JSON structure with sections: hero, highlights, curriculum, faq, testimonials
                                </Text>
                                {errors.landing_page_content && <Text fontSize="sm" color="red.500" mt={1}>{errors.landing_page_content}</Text>}
                            </Box>
                        </Box>

                        {/* Publish Toggle */}
                        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px">
                            <Text fontWeight="semibold" mb={3}>Visibility</Text>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={data.landing_page_published}
                                    onChange={(e) => setData('landing_page_published', e.target.checked)}
                                    style={{ marginTop: 3 }}
                                />
                                <Box>
                                    <Text fontWeight="medium">Publish landing page</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Make this page visible to prospective students
                                    </Text>
                                </Box>
                            </label>
                            {errors.landing_page_published && <Text fontSize="sm" color="red.500" mt={1}>{errors.landing_page_published}</Text>}
                        </Box>

                        {/* Actions */}
                        <HStack justify="flex-end" gap={3}>
                            <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                leftIcon={<FiSave />}
                                isLoading={processing}
                                loadingText="Saving..."
                            >
                                Save Landing Page
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </InstructorLayout>
    );
}

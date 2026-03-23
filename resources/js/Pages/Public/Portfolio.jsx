import { Head } from '@inertiajs/react';
import { Box, Heading, Text, Container } from '@chakra-ui/react';

export default function Portfolio({ slug }) {
    return (
        <Container maxW="4xl" py={16}>
            <Head title="Portfolio" />
            <Box textAlign="center">
                <Heading size="xl" mb={4}>Student Portfolio</Heading>
                <Text color="gray.500">Portfolio: {slug}</Text>
                <Text color="gray.400" mt={2}>Portfolio details will be displayed here.</Text>
            </Box>
        </Container>
    );
}

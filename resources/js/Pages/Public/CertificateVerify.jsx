import { Head } from '@inertiajs/react';
import { Box, Heading, Text, Container } from '@chakra-ui/react';

export default function CertificateVerify({ uuid }) {
    return (
        <Container maxW="2xl" py={16}>
            <Head title="Verify Certificate" />
            <Box textAlign="center">
                <Heading size="xl" mb={4}>Certificate Verification</Heading>
                <Text color="gray.500">Certificate ID: {uuid}</Text>
                <Text color="gray.400" mt={2}>Certificate details will be displayed here.</Text>
            </Box>
        </Container>
    );
}

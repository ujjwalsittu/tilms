import { Link } from '@inertiajs/react';
import { Flex, Box, Heading } from '@chakra-ui/react';

export default function GuestLayout({ children }) {
    return (
        <Flex minH="100vh" direction="column" align="center" justify="center" bg="gray.50">
            <Box mb={6}>
                <Link href="/">
                    <Heading size="xl" color="blue.600">TILMS</Heading>
                </Link>
            </Box>

            <Box w="full" maxW="md" bg="white" p={6} borderRadius="lg" boxShadow="md">
                {children}
            </Box>
        </Flex>
    );
}

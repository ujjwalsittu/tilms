import { usePage } from '@inertiajs/react';
import { Box, Text } from '@chakra-ui/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    return (
        <>
            {flash?.success && (
                <Box bg="green.50" border="1px" borderColor="green.200" borderRadius="md" p={3} mb={4}>
                    <Text color="green.700" fontSize="sm">{flash.success}</Text>
                </Box>
            )}
            {flash?.warning && (
                <Box bg="orange.50" border="1px" borderColor="orange.200" borderRadius="md" p={3} mb={4}>
                    <Text color="orange.700" fontSize="sm">{flash.warning}</Text>
                </Box>
            )}
            {flash?.error && (
                <Box bg="red.50" border="1px" borderColor="red.200" borderRadius="md" p={3} mb={4}>
                    <Text color="red.700" fontSize="sm">{flash.error}</Text>
                </Box>
            )}
        </>
    );
}

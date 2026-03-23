import { Box, HStack, Text, Badge, Textarea } from '@chakra-ui/react';

export default function MonacoEditor({
    value,
    onChange,
    language = 'javascript',
    height = '400px',
    readOnly = false,
}) {
    return (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
            <HStack px={3} py={2} bg="gray.800" justify="space-between">
                <Text fontSize="xs" color="gray.400">Code Editor</Text>
                <Badge colorPalette="blue" variant="subtle" fontSize="xs">{language}</Badge>
            </HStack>
            <Textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                fontFamily="mono"
                fontSize="sm"
                bg="gray.900"
                color="green.300"
                border="none"
                borderRadius="none"
                minH={height}
                p={4}
                resize="vertical"
                readOnly={readOnly}
                placeholder="// Write your code here..."
                _placeholder={{ color: 'gray.600' }}
                spellCheck={false}
            />
        </Box>
    );
}

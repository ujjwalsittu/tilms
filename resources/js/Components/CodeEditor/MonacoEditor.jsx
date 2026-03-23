import Editor from '@monaco-editor/react';
import { Box, HStack, Text, Badge } from '@chakra-ui/react';

const LANGUAGE_MAP = {
    javascript: 'javascript',
    python: 'python',
    php: 'php',
    sql: 'sql',
    html: 'html',
    html_css: 'html',
    java: 'java',
    go: 'go',
    rust: 'rust',
    typescript: 'typescript',
    css: 'css',
    json: 'json',
};

export default function MonacoEditor({ value, onChange, language = 'javascript', height = '400px', readOnly = false }) {
    const monacoLang = LANGUAGE_MAP[language] || language;

    return (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
            <HStack px={3} py={2} bg="gray.800" justify="space-between">
                <Text fontSize="xs" color="gray.400">Code Editor</Text>
                <Badge colorPalette="blue" variant="subtle" fontSize="xs">{language}</Badge>
            </HStack>
            <Editor
                height={height}
                language={monacoLang}
                value={value || ''}
                onChange={(val) => onChange?.(val || '')}
                theme="vs-dark"
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 12 },
                }}
            />
        </Box>
    );
}

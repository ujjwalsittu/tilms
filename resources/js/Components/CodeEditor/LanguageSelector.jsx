import { HStack, Text } from '@chakra-ui/react';

const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
];

export default function LanguageSelector({ value, onChange }) {
    return (
        <HStack gap={2} align="center">
            <Text fontSize="sm" fontWeight="medium">Language:</Text>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    background: 'white',
                }}
            >
                {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
            </select>
        </HStack>
    );
}

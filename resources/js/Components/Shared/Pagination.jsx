import { Link } from '@inertiajs/react';
import { HStack, Button, Text } from '@chakra-ui/react';

export default function Pagination({ links, currentPage, lastPage }) {
    if (lastPage <= 1) return null;

    return (
        <HStack justify="center" gap={2} mt={4}>
            {links?.map((link, i) => {
                if (!link.url) {
                    return (
                        <Button
                            key={i}
                            size="sm"
                            variant="ghost"
                            disabled
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link key={i} href={link.url} preserveState>
                        <Button
                            size="sm"
                            variant={link.active ? 'solid' : 'outline'}
                            colorPalette={link.active ? 'blue' : 'gray'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </Link>
                );
            })}

            <Text fontSize="sm" color="gray.500" ml={2}>
                Page {currentPage} of {lastPage}
            </Text>
        </HStack>
    );
}

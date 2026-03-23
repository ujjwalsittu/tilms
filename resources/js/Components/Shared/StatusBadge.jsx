import { Badge } from '@chakra-ui/react';

const colorMap = {
    // General
    active: 'green',
    inactive: 'red',
    // Cohort status
    draft: 'gray',
    registration_open: 'blue',
    in_progress: 'green',
    closed: 'red',
    archived: 'gray',
    // Submission status
    submitted: 'blue',
    ai_reviewing: 'yellow',
    ai_reviewed: 'orange',
    instructor_reviewing: 'purple',
    graded: 'green',
    returned: 'red',
    // Payment status
    created: 'gray',
    authorized: 'yellow',
    captured: 'green',
    failed: 'red',
    refunded: 'orange',
    // Ticket status
    open: 'blue',
    resolved: 'green',
    // Priority
    low: 'gray',
    medium: 'yellow',
    high: 'red',
    // Verification
    not_submitted: 'gray',
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    // Enrollment
    waitlisted: 'yellow',
    enrolled: 'blue',
    audit: 'purple',
    completed: 'green',
    dropped: 'red',
};

export default function StatusBadge({ status, label }) {
    const displayLabel = label || status?.replace(/_/g, ' ');
    const colorPalette = colorMap[status] || 'gray';

    return (
        <Badge colorPalette={colorPalette} variant="subtle" textTransform="capitalize">
            {displayLabel}
        </Badge>
    );
}

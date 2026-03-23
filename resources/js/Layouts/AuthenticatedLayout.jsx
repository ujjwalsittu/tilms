import { usePage } from '@inertiajs/react';
import AdminLayout from './AdminLayout';
import InstructorLayout from './InstructorLayout';
import StudentLayout from './StudentLayout';

export default function AuthenticatedLayout({ children, header }) {
    const { auth } = usePage().props;
    const role = auth?.user?.role;

    const title = typeof header === 'string' ? header : '';

    switch (role) {
        case 'admin':
            return <AdminLayout title={title}>{children}</AdminLayout>;
        case 'instructor':
            return <InstructorLayout title={title}>{children}</InstructorLayout>;
        case 'student':
            return <StudentLayout title={title}>{children}</StudentLayout>;
        default:
            return <div>{children}</div>;
    }
}

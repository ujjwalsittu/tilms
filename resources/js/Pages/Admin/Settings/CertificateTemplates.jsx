import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/Shared/FlashMessage';
import {
    Box, Button, Input, Text, Flex, VStack, HStack, Badge,
    SimpleGrid, Heading, Textarea,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiSave, FiEye, FiEdit2, FiX } from 'react-icons/fi';
import { useState } from 'react';

// ─── Template variables reference ────────────────────────────────────────────
const TEMPLATE_VARIABLES = [
    { token: '{{student_name}}',       label: "Student's full name" },
    { token: '{{cohort_name}}',        label: 'Cohort title' },
    { token: '{{domain}}',             label: 'Training domain (e.g. "Web Development")' },
    { token: '{{completion_percent}}', label: 'Completion percentage' },
    { token: '{{completion_date}}',    label: 'Date of completion' },
    { token: '{{certificate_number}}', label: 'Unique certificate number' },
    { token: '{{verification_url}}',   label: 'Certificate verification URL' },
    { token: '{{signatory_name}}',     label: 'Admin signatory name' },
    { token: '{{signatory_position}}', label: 'Admin signatory position' },
    { token: '{{instructor_name}}',    label: "Instructor's name" },
    { token: '{{qr_code}}',            label: 'QR code placeholder' },
];

// ─── Default design settings ─────────────────────────────────────────────────
const DEFAULT_DESIGN = {
    backgroundColor: '#ffffff',
    borderColor: '#b8860b',
    borderStyle: 'double',
    accentColor: '#b8860b',
    titleText: 'Certificate of Completion',
    titleFontSize: 32,
    bodyFontSize: 15,
};

// ─── Highlighted variable token ───────────────────────────────────────────────
function VarToken({ text }) {
    return (
        <Box
            as="span"
            bg="yellow.100"
            color="yellow.800"
            px="2px"
            borderRadius="sm"
            fontSize="inherit"
            fontStyle="italic"
        >
            {text}
        </Box>
    );
}

// ─── Certificate Preview ──────────────────────────────────────────────────────
function CertificatePreview({ design, bgImageUrl }) {
    const {
        backgroundColor,
        borderColor,
        borderStyle,
        accentColor,
        titleText,
        titleFontSize,
        bodyFontSize,
    } = design;

    // Compute border CSS
    const borderMap = {
        none: 'none',
        solid: `6px solid ${borderColor}`,
        double: `6px double ${borderColor}`,
        ornate: `8px ridge ${borderColor}`,
    };
    const borderValue = borderMap[borderStyle] ?? borderMap.solid;

    const canvasStyle = {
        width: '100%',
        aspectRatio: '800 / 560',
        backgroundColor,
        border: borderValue,
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Georgia", serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        boxSizing: 'border-box',
    };

    const dividerStyle = {
        width: '60%',
        height: '1px',
        backgroundColor: accentColor,
        margin: '0 auto',
    };

    const sigLineStyle = {
        width: '120px',
        height: '1px',
        backgroundColor: '#555',
    };

    const fs = (base) => `${(base / 16).toFixed(3)}em`;

    return (
        <Box style={canvasStyle}>
            {/* Inner ornate border overlay for "ornate" style */}
            {borderStyle === 'ornate' && (
                <Box
                    position="absolute"
                    inset="10px"
                    border={`3px solid ${borderColor}`}
                    pointerEvents="none"
                    zIndex={1}
                />
            )}

            {/* Header: logo/platform name */}
            <Box textAlign="center" zIndex={2}>
                <Text
                    fontSize={fs(bodyFontSize * 0.85)}
                    color={accentColor}
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    fontWeight="bold"
                >
                    TILMS · Training Platform
                </Text>
            </Box>

            {/* Title */}
            <Box textAlign="center" zIndex={2}>
                <Text
                    fontSize={fs(titleFontSize)}
                    fontWeight="bold"
                    color={accentColor}
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                    lineHeight="1.2"
                >
                    {titleText || 'Certificate of Completion'}
                </Text>
            </Box>

            {/* Divider */}
            <Box style={dividerStyle} zIndex={2} />

            {/* Body text */}
            <Box textAlign="center" zIndex={2}>
                <Text fontSize={fs(bodyFontSize)} color="#444" mb="4px">
                    This is to certify that
                </Text>
                <Text
                    fontSize={fs(titleFontSize * 0.72)}
                    fontWeight="bold"
                    color="#1a1a1a"
                    mt="2px"
                    mb="2px"
                >
                    <VarToken text="{{student_name}}" />
                </Text>
                <Text fontSize={fs(bodyFontSize)} color="#444" mt="4px">
                    has successfully completed the
                </Text>
                <Text
                    fontSize={fs(bodyFontSize * 1.15)}
                    fontWeight="semibold"
                    color="#1a1a1a"
                    mt="3px"
                >
                    <VarToken text="{{cohort_name}}" />
                </Text>
                <Text fontSize={fs(bodyFontSize)} color="#444" mt="4px">
                    <VarToken text="{{domain}}" /> program with{' '}
                    <VarToken text="{{completion_percent}}" />% completion
                </Text>
                <Text fontSize={fs(bodyFontSize)} color="#444">
                    on <VarToken text="{{completion_date}}" />
                </Text>
            </Box>

            {/* Divider */}
            <Box style={dividerStyle} zIndex={2} />

            {/* Signatories */}
            <Flex
                width="100%"
                justifyContent="space-around"
                alignItems="flex-end"
                zIndex={2}
                px={4}
            >
                <Box textAlign="center">
                    <Box style={sigLineStyle} mx="auto" mb="3px" />
                    <Text fontSize={fs(bodyFontSize * 0.9)} fontWeight="medium" color="#222">
                        <VarToken text="{{signatory_name}}" />
                    </Text>
                    <Text fontSize={fs(bodyFontSize * 0.8)} color="#666">
                        <VarToken text="{{signatory_position}}" />
                    </Text>
                </Box>
                <Box textAlign="center">
                    <Box style={sigLineStyle} mx="auto" mb="3px" />
                    <Text fontSize={fs(bodyFontSize * 0.9)} fontWeight="medium" color="#222">
                        <VarToken text="{{instructor_name}}" />
                    </Text>
                    <Text fontSize={fs(bodyFontSize * 0.8)} color="#666">Instructor</Text>
                </Box>
            </Flex>

            {/* Footer: cert number, verify URL, QR */}
            <Box
                width="100%"
                zIndex={2}
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                px={2}
            >
                <Box>
                    <Text fontSize={fs(bodyFontSize * 0.75)} color="#888">
                        Certificate No: <VarToken text="{{certificate_number}}" />
                    </Text>
                    <Text fontSize={fs(bodyFontSize * 0.75)} color="#888">
                        Verify: <VarToken text="{{verification_url}}" />
                    </Text>
                </Box>
                {/* QR placeholder */}
                <Box
                    width="48px"
                    height="48px"
                    border="1px solid #ccc"
                    borderRadius="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="#f5f5f5"
                >
                    <Text fontSize="7px" color="#aaa" textAlign="center" lineHeight="1.2">
                        QR
                        <br />
                        CODE
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel({ design, onChange, name, onNameChange, isDefault, onIsDefaultChange }) {
    const field = (label, key, type = 'text', extra = {}) => (
        <Box mb={3}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                {label}
            </Text>
            <Input
                type={type}
                size="sm"
                value={design[key] ?? ''}
                onChange={(e) => onChange(key, e.target.value)}
                {...extra}
            />
        </Box>
    );

    return (
        <VStack align="stretch" gap={0}>
            {/* Template name */}
            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                    Template Name <Box as="span" color="red.500">*</Box>
                </Text>
                <Input
                    size="sm"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. Default Certificate"
                />
            </Box>

            <Box borderTopWidth="1px" borderColor="gray.200" pt={3} mb={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Colors
                </Text>
            </Box>

            {/* Color pickers */}
            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Background Color</Text>
                <HStack gap={2}>
                    <Input
                        type="color"
                        size="sm"
                        w="44px"
                        h="32px"
                        p="2px"
                        value={design.backgroundColor}
                        onChange={(e) => onChange('backgroundColor', e.target.value)}
                        cursor="pointer"
                    />
                    <Input
                        size="sm"
                        value={design.backgroundColor}
                        onChange={(e) => onChange('backgroundColor', e.target.value)}
                        fontFamily="mono"
                        fontSize="xs"
                        flex={1}
                    />
                </HStack>
            </Box>

            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Border Color</Text>
                <HStack gap={2}>
                    <Input
                        type="color"
                        size="sm"
                        w="44px"
                        h="32px"
                        p="2px"
                        value={design.borderColor}
                        onChange={(e) => onChange('borderColor', e.target.value)}
                        cursor="pointer"
                    />
                    <Input
                        size="sm"
                        value={design.borderColor}
                        onChange={(e) => onChange('borderColor', e.target.value)}
                        fontFamily="mono"
                        fontSize="xs"
                        flex={1}
                    />
                </HStack>
            </Box>

            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Accent Color</Text>
                <HStack gap={2}>
                    <Input
                        type="color"
                        size="sm"
                        w="44px"
                        h="32px"
                        p="2px"
                        value={design.accentColor}
                        onChange={(e) => onChange('accentColor', e.target.value)}
                        cursor="pointer"
                    />
                    <Input
                        size="sm"
                        value={design.accentColor}
                        onChange={(e) => onChange('accentColor', e.target.value)}
                        fontFamily="mono"
                        fontSize="xs"
                        flex={1}
                    />
                </HStack>
            </Box>

            <Box borderTopWidth="1px" borderColor="gray.200" pt={3} mb={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Border
                </Text>
            </Box>

            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Border Style</Text>
                <select
                    value={design.borderStyle}
                    onChange={(e) => onChange('borderStyle', e.target.value)}
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                    }}
                >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="double">Double</option>
                    <option value="ornate">Ornate (Ridge)</option>
                </select>
            </Box>

            <Box borderTopWidth="1px" borderColor="gray.200" pt={3} mb={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Typography
                </Text>
            </Box>

            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Title Text</Text>
                <Input
                    size="sm"
                    value={design.titleText}
                    onChange={(e) => onChange('titleText', e.target.value)}
                    placeholder="Certificate of Completion"
                />
            </Box>

            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                    Title Font Size: <Box as="span" color="blue.600">{design.titleFontSize}px</Box>
                </Text>
                <input
                    type="range"
                    min={20}
                    max={48}
                    value={design.titleFontSize}
                    onChange={(e) => onChange('titleFontSize', Number(e.target.value))}
                    style={{ width: '100%' }}
                />
            </Box>

            <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                    Body Font Size: <Box as="span" color="blue.600">{design.bodyFontSize}px</Box>
                </Text>
                <input
                    type="range"
                    min={12}
                    max={20}
                    value={design.bodyFontSize}
                    onChange={(e) => onChange('bodyFontSize', Number(e.target.value))}
                    style={{ width: '100%' }}
                />
            </Box>

            <Box borderTopWidth="1px" borderColor="gray.200" pt={3} mb={1}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Images
                </Text>
            </Box>

            {/* Set as Default */}
            <Box mt={2} mb={3}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => onIsDefaultChange(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <Text as="span" fontSize="sm" fontWeight="medium" color="gray.700">
                        Set as Default Template
                    </Text>
                </label>
            </Box>
        </VStack>
    );
}

// ─── Variables Reference Panel ────────────────────────────────────────────────
function VariablesReference() {
    return (
        <Box bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200" p={4} mt={4}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Available Template Variables
            </Text>
            <VStack align="stretch" gap={1}>
                {TEMPLATE_VARIABLES.map(({ token, label }) => (
                    <Flex key={token} align="baseline" gap={2}>
                        <Box
                            as="span"
                            fontSize="11px"
                            fontFamily="mono"
                            bg="yellow.100"
                            color="yellow.800"
                            px={1}
                            borderRadius="sm"
                            whiteSpace="nowrap"
                            flexShrink={0}
                        >
                            {token}
                        </Box>
                        <Text fontSize="11px" color="gray.500">{label}</Text>
                    </Flex>
                ))}
            </VStack>
        </Box>
    );
}

// ─── Certificate Designer (create / edit) ─────────────────────────────────────
function CertificateDesigner({ initialTemplate = null, onCancel, onSaved }) {
    const isEditing = !!initialTemplate;

    // Parse existing layout JSON if editing
    const parsedLayout = (() => {
        if (!initialTemplate?.layout_json) return null;
        try {
            return typeof initialTemplate.layout_json === 'string'
                ? JSON.parse(initialTemplate.layout_json)
                : initialTemplate.layout_json;
        } catch {
            return null;
        }
    })();

    const [design, setDesign] = useState({
        ...DEFAULT_DESIGN,
        ...(parsedLayout ?? {}),
    });

    const [name, setName] = useState(initialTemplate?.name ?? '');
    const [isDefault, setIsDefault] = useState(initialTemplate?.is_default ?? false);
    const [bgImageFile, setBgImageFile] = useState(null);
    const [sigImageFile, setSigImageFile] = useState(null);
    const [bgImagePreview, setBgImagePreview] = useState(
        initialTemplate?.background_image_url ?? null
    );

    const { post, put, processing, errors } = useForm();

    const handleDesignChange = (key, value) => {
        setDesign((prev) => ({ ...prev, [key]: value }));
    };

    const handleBgImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setBgImageFile(file);
        setBgImagePreview(URL.createObjectURL(file));
    };

    const handleSigImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSigImageFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('layout', JSON.stringify(design));
        formData.append('is_default', isDefault ? '1' : '0');
        if (bgImageFile) formData.append('background_image', bgImageFile);
        if (sigImageFile) formData.append('signature_image', sigImageFile);

        if (isEditing) {
            // Laravel requires _method spoofing for PUT with FormData
            formData.append('_method', 'PUT');
            router.post(
                route('admin.certificate-templates.update', initialTemplate.id),
                formData,
                { forceFormData: true, onSuccess: onSaved }
            );
        } else {
            router.post(
                route('admin.certificate-templates.store'),
                formData,
                { forceFormData: true, onSuccess: onSaved }
            );
        }
    };

    return (
        <Box bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="blue.200" mb={6} overflow="hidden">
            {/* Designer header */}
            <Flex
                bg="blue.600"
                color="white"
                px={5}
                py={3}
                align="center"
                justify="space-between"
            >
                <HStack gap={2}>
                    <FiEye size={18} />
                    <Text fontWeight="semibold" fontSize="md">
                        {isEditing ? `Editing: ${initialTemplate.name}` : 'New Certificate Template Designer'}
                    </Text>
                </HStack>
                <Button
                    size="xs"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    onClick={onCancel}
                >
                    <FiX size={16} />
                    <Box as="span" ml={1}>Close</Box>
                </Button>
            </Flex>

            <form onSubmit={handleSubmit}>
                <Flex gap={0} align="stretch">
                    {/* Left: Certificate Preview */}
                    <Box flex={1} p={5} bg="gray.100" minW={0}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                            Live Preview
                        </Text>
                        <Box
                            bg="white"
                            borderRadius="md"
                            boxShadow="sm"
                            overflow="hidden"
                        >
                            <CertificatePreview design={design} bgImageUrl={bgImagePreview} />
                        </Box>

                        {/* Image uploads below preview */}
                        <SimpleGrid columns={2} gap={3} mt={4}>
                            <Box>
                                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                                    Background Image
                                </Text>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    size="sm"
                                    p={1}
                                    bg="white"
                                    onChange={handleBgImageChange}
                                />
                                {errors.background_image && (
                                    <Text fontSize="xs" color="red.500" mt={1}>{errors.background_image}</Text>
                                )}
                            </Box>
                            <Box>
                                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                                    Signature Image
                                </Text>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    size="sm"
                                    p={1}
                                    bg="white"
                                    onChange={handleSigImageChange}
                                />
                                {errors.signature_image && (
                                    <Text fontSize="xs" color="red.500" mt={1}>{errors.signature_image}</Text>
                                )}
                            </Box>
                        </SimpleGrid>

                        <VariablesReference />
                    </Box>

                    {/* Right: Settings Panel */}
                    <Box
                        w="260px"
                        flexShrink={0}
                        borderLeftWidth="1px"
                        borderColor="gray.200"
                        p={4}
                        bg="white"
                        overflowY="auto"
                        maxH="780px"
                    >
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                            Settings
                        </Text>

                        <SettingsPanel
                            design={design}
                            onChange={handleDesignChange}
                            name={name}
                            onNameChange={setName}
                            isDefault={isDefault}
                            onIsDefaultChange={setIsDefault}
                        />

                        {errors.name && (
                            <Text fontSize="xs" color="red.500" mt={1}>{errors.name}</Text>
                        )}

                        <Box borderTopWidth="1px" borderColor="gray.200" pt={4} mt={2}>
                            <Button
                                type="submit"
                                colorPalette="blue"
                                size="sm"
                                width="100%"
                                loading={processing}
                            >
                                <FiSave size={14} />
                                <Box as="span" ml={1}>
                                    {isEditing ? 'Save Changes' : 'Create Template'}
                                </Box>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                width="100%"
                                mt={2}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Flex>
            </form>
        </Box>
    );
}

// ─── Template List Item ───────────────────────────────────────────────────────
function TemplateListItem({ template, onEdit, onDelete, onSetDefault }) {
    return (
        <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            bg="white"
            _hover={{ borderColor: 'blue.300', boxShadow: 'sm' }}
            transition="all 0.15s"
        >
            <Flex justify="space-between" align="center">
                <HStack gap={3}>
                    {/* Mini color swatch */}
                    {template.layout_json && (() => {
                        try {
                            const layout = typeof template.layout_json === 'string'
                                ? JSON.parse(template.layout_json)
                                : template.layout_json;
                            return (
                                <Box
                                    w="28px"
                                    h="20px"
                                    borderRadius="sm"
                                    borderWidth="2px"
                                    borderColor={layout.borderColor ?? '#b8860b'}
                                    bg={layout.backgroundColor ?? '#ffffff'}
                                    flexShrink={0}
                                />
                            );
                        } catch {
                            return null;
                        }
                    })()}
                    <Box>
                        <Text fontWeight="medium" fontSize="sm">{template.name}</Text>
                        {template.background_image_path && (
                            <Text fontSize="xs" color="gray.400" mt="1px">
                                Has background image
                            </Text>
                        )}
                    </Box>
                    {template.is_default && (
                        <Badge colorPalette="green" size="sm">Default</Badge>
                    )}
                </HStack>
                <HStack gap={2}>
                    {!template.is_default && (
                        <Button
                            size="xs"
                            variant="outline"
                            colorPalette="green"
                            onClick={() => onSetDefault(template)}
                        >
                            Set Default
                        </Button>
                    )}
                    <Button
                        size="xs"
                        variant="outline"
                        colorPalette="blue"
                        onClick={() => onEdit(template)}
                    >
                        <FiEdit2 size={12} />
                        <Box as="span" ml={1}>Edit</Box>
                    </Button>
                    <Button
                        size="xs"
                        variant="outline"
                        colorPalette="red"
                        onClick={() => onDelete(template)}
                        disabled={template.is_default}
                        title={template.is_default ? 'Cannot delete the default template' : 'Delete template'}
                    >
                        <FiTrash2 size={12} />
                        <Box as="span" ml={1}>Delete</Box>
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CertificateTemplates({ templates }) {
    // 'list' | 'create' | { id, template } for editing
    const [mode, setMode] = useState('list');

    const handleEdit = (template) => {
        setMode({ id: template.id, template });
    };

    const handleDelete = (template) => {
        if (confirm(`Delete template "${template.name}"? This cannot be undone.`)) {
            router.delete(route('admin.certificate-templates.destroy', template.id));
        }
    };

    const handleSetDefault = (template) => {
        router.patch(route('admin.certificate-templates.update', template.id), { is_default: true });
    };

    const handleDesignerClose = () => setMode('list');
    const handleDesignerSaved = () => setMode('list');

    const isEditing = mode !== 'list' && mode !== 'create';

    return (
        <AdminLayout title="Certificate Templates">
            <Head title="Certificate Templates - Admin" />
            <FlashMessage />

            {/* ── Template list ── */}
            <Box bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={6} mb={6}>
                <Flex justify="space-between" align="center" mb={4}>
                    <Box>
                        <Heading size="md" color="gray.800">Certificate Templates</Heading>
                        <Text fontSize="sm" color="gray.500" mt={0.5}>
                            {templates.length} template{templates.length !== 1 ? 's' : ''} configured
                        </Text>
                    </Box>
                    <Button
                        colorPalette="blue"
                        size="sm"
                        onClick={() => setMode('create')}
                        disabled={mode === 'create'}
                    >
                        <FiPlus size={14} />
                        <Box as="span" ml={1}>Create New Template</Box>
                    </Button>
                </Flex>

                {templates.length === 0 ? (
                    <Box
                        textAlign="center"
                        py={10}
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor="gray.200"
                        borderRadius="lg"
                        color="gray.400"
                    >
                        <Text fontSize="sm">No certificate templates yet.</Text>
                        <Text fontSize="xs" mt={1}>Click "Create New Template" to design your first one.</Text>
                    </Box>
                ) : (
                    <VStack gap={3} align="stretch">
                        {templates.map((template) => (
                            <TemplateListItem
                                key={template.id}
                                template={template}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        ))}
                    </VStack>
                )}
            </Box>

            {/* ── Designer panel (create) ── */}
            {mode === 'create' && (
                <CertificateDesigner
                    initialTemplate={null}
                    onCancel={handleDesignerClose}
                    onSaved={handleDesignerSaved}
                />
            )}

            {/* ── Designer panel (edit) ── */}
            {isEditing && (
                <CertificateDesigner
                    key={mode.id}
                    initialTemplate={mode.template}
                    onCancel={handleDesignerClose}
                    onSaved={handleDesignerSaved}
                />
            )}
        </AdminLayout>
    );
}

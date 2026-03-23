<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CertificateTemplateController extends Controller
{
    public function index()
    {
        $templates = CertificateTemplate::all();

        return Inertia::render('Admin/Settings/CertificateTemplates', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'layout' => ['required', 'array'],
            'background_image' => ['nullable', 'image', 'max:4096'],
            'signature_image' => ['nullable', 'image', 'max:2048'],
            'is_default' => ['boolean'],
        ]);

        $backgroundImagePath = null;
        if ($request->hasFile('background_image')) {
            $backgroundImagePath = $request->file('background_image')
                ->store('public/certificate-templates/backgrounds');
            $backgroundImagePath = Storage::url($backgroundImagePath);
        }

        $signatureImagePath = null;
        if ($request->hasFile('signature_image')) {
            $signatureImagePath = $request->file('signature_image')
                ->store('public/certificate-templates/signatures');
            $signatureImagePath = Storage::url($signatureImagePath);
        }

        if (! empty($validated['is_default'])) {
            CertificateTemplate::where('is_default', true)->update(['is_default' => false]);
        }

        CertificateTemplate::create([
            'name' => $validated['name'],
            'layout' => $validated['layout'],
            'background_image_path' => $backgroundImagePath,
            'signature_image_path' => $signatureImagePath,
            'is_default' => $validated['is_default'] ?? false,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('admin.certificate-templates.index')
            ->with('success', 'Certificate template created successfully.');
    }

    public function update(Request $request, CertificateTemplate $certificateTemplate)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'layout' => ['required', 'array'],
            'background_image' => ['nullable', 'image', 'max:4096'],
            'signature_image' => ['nullable', 'image', 'max:2048'],
            'is_default' => ['boolean'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'layout' => $validated['layout'],
            'is_default' => $validated['is_default'] ?? false,
        ];

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')
                ->store('public/certificate-templates/backgrounds');
            $updateData['background_image_path'] = Storage::url($path);
        }

        if ($request->hasFile('signature_image')) {
            $path = $request->file('signature_image')
                ->store('public/certificate-templates/signatures');
            $updateData['signature_image_path'] = Storage::url($path);
        }

        if (! empty($validated['is_default'])) {
            CertificateTemplate::where('is_default', true)
                ->where('id', '!=', $certificateTemplate->id)
                ->update(['is_default' => false]);
        }

        $certificateTemplate->update($updateData);

        return redirect()->route('admin.certificate-templates.index')
            ->with('success', 'Certificate template updated successfully.');
    }

    public function destroy(CertificateTemplate $certificateTemplate)
    {
        $certificateTemplate->delete();

        return redirect()->route('admin.certificate-templates.index')
            ->with('success', 'Certificate template deleted successfully.');
    }
}

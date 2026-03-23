<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentPortfolio;
use App\Services\PortfolioService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function edit(PortfolioService $portfolioService)
    {
        $data = $portfolioService->getPortfolioData(auth()->user());

        return Inertia::render('Student/Portfolio/Edit', $data);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'headline' => 'nullable|string|max:255',
            'about' => 'nullable|string|max:5000',
            'skills' => 'nullable|array',
            'is_public' => 'boolean',
        ]);

        $portfolio = StudentPortfolio::where('user_id', auth()->id())->firstOrFail();
        $portfolio->update($validated);

        return back()->with('success', 'Portfolio updated.');
    }
}

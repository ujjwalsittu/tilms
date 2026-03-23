<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\StudentPortfolio;
use App\Services\PortfolioService;
use Inertia\Inertia;

class PortfolioViewController extends Controller
{
    public function show(string $slug, PortfolioService $portfolioService)
    {
        $portfolio = StudentPortfolio::where('slug', $slug)->where('is_public', true)->firstOrFail();
        $data = $portfolioService->getPortfolioData($portfolio->user);

        return Inertia::render('Public/Portfolio', $data);
    }
}

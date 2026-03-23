<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Instructor;
use App\Http\Controllers\Student;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return redirect()->route('login');
});

// Role-based dashboard redirect
Route::get('/dashboard', function () {
    $user = auth()->user();

    return match ($user->role->value) {
        'admin' => redirect()->route('admin.dashboard'),
        'instructor' => redirect()->route('instructor.dashboard'),
        'student' => redirect()->route('student.dashboard'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile management (all authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Instructors
        Route::resource('instructors', Admin\InstructorController::class);
        Route::put('instructors/{user}/toggle-active', [Admin\InstructorController::class, 'toggleActive'])->name('instructors.toggle-active');

        // Students
        Route::get('students', [Admin\StudentController::class, 'index'])->name('students.index');
        Route::get('students/{user}', [Admin\StudentController::class, 'show'])->name('students.show');
        Route::put('students/{user}/toggle-active', [Admin\StudentController::class, 'toggleActive'])->name('students.toggle-active');
        Route::delete('students/{user}', [Admin\StudentController::class, 'destroy'])->name('students.destroy');

        // Settings
        Route::get('settings/platform', [Admin\PlatformSettingsController::class, 'edit'])->name('settings.platform');
        Route::put('settings/platform', [Admin\PlatformSettingsController::class, 'update'])->name('settings.platform.update');

        // API Keys
        Route::get('settings/api-keys', [Admin\ApiKeyController::class, 'index'])->name('settings.api-keys');
        Route::put('settings/api-keys/{apiKey}', [Admin\ApiKeyController::class, 'update'])->name('settings.api-keys.update');

        // Certificate Templates
        Route::resource('certificate-templates', Admin\CertificateTemplateController::class)->except(['create', 'edit', 'show']);

        // Finance
        Route::get('finance', [Admin\FinancialReportController::class, 'index'])->name('finance.index');
        Route::get('finance/transactions', [Admin\FinancialReportController::class, 'transactions'])->name('finance.transactions');

        // AI Usage
        Route::get('ai-usage', [Admin\AiUsageController::class, 'index'])->name('ai-usage.index');

        // Audit Logs
        Route::get('audit-logs', [Admin\AuditLogController::class, 'index'])->name('audit-logs.index');

        // Support Tickets
        Route::get('support-tickets', [Admin\SupportTicketController::class, 'index'])->name('support.index');
        Route::get('support-tickets/{ticket}', [Admin\SupportTicketController::class, 'show'])->name('support.show');
        Route::put('support-tickets/{ticket}', [Admin\SupportTicketController::class, 'update'])->name('support.update');
        Route::post('support-tickets/{ticket}/reply', [Admin\SupportTicketController::class, 'reply'])->name('support.reply');

        // ID Verification
        Route::get('id-verification', [Admin\IdVerificationQueueController::class, 'index'])->name('id-verification.index');
        Route::put('id-verification/{user}', [Admin\IdVerificationQueueController::class, 'update'])->name('id-verification.update');

        // Institutional Partners
        Route::resource('partners', Admin\PartnerController::class)->except(['edit']);
        Route::post('partners/{partner}/bulk-enroll', [Admin\PartnerController::class, 'bulkEnroll'])->name('partners.bulk-enroll');

        // Coupons (platform-wide view)
        Route::get('coupons', [Admin\CouponController::class, 'index'])->name('coupons.index');
    });

// Instructor routes
Route::middleware(['auth', 'verified', 'role:instructor'])
    ->prefix('instructor')
    ->name('instructor.')
    ->group(function () {
        Route::get('/dashboard', [Instructor\DashboardController::class, 'index'])->name('dashboard');

        // Cohorts
        Route::resource('cohorts', Instructor\CohortController::class);
        Route::post('cohorts/{cohort}/clone', [Instructor\CohortController::class, 'clone'])->name('cohorts.clone');
        Route::put('cohorts/{cohort}/close', [Instructor\CohortController::class, 'close'])->name('cohorts.close');
        Route::get('cohorts/{cohort}/health', [Instructor\CohortController::class, 'health'])->name('cohorts.health');
        Route::get('cohorts/{cohort}/leaderboard', [Instructor\CohortController::class, 'leaderboard'])->name('cohorts.leaderboard');
        Route::put('cohorts/{cohort}/landing-page', [Instructor\CohortController::class, 'updateLandingPage'])->name('cohorts.landing-page');

        // Cohort Tasks
        Route::post('cohorts/{cohort}/tasks', [Instructor\CohortTaskController::class, 'store'])->name('cohort-tasks.store');
        Route::put('cohorts/{cohort}/tasks/{task}/order', [Instructor\CohortTaskController::class, 'reorder'])->name('cohort-tasks.reorder');
        Route::delete('cohorts/{cohort}/tasks/{task}', [Instructor\CohortTaskController::class, 'destroy'])->name('cohort-tasks.destroy');

        // Task Bank
        Route::resource('tasks', Instructor\TaskBankController::class);
        Route::post('tasks/ai-generate', [Instructor\TaskBankController::class, 'aiGenerate'])->name('tasks.ai-generate')->middleware('throttle:ai');

        // Submissions
        Route::get('submissions', [Instructor\SubmissionReviewController::class, 'index'])->name('submissions.index');
        Route::get('submissions/{submission}', [Instructor\SubmissionReviewController::class, 'show'])->name('submissions.show');
        Route::put('submissions/{submission}/grade', [Instructor\SubmissionReviewController::class, 'grade'])->name('submissions.grade');

        // Office Hours
        Route::resource('office-hours', Instructor\OfficeHoursController::class)->except(['create', 'edit', 'show']);

        // Announcements
        Route::get('cohorts/{cohort}/announcements', [Instructor\AnnouncementController::class, 'index'])->name('announcements.index');
        Route::post('cohorts/{cohort}/announcements', [Instructor\AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('announcements/{announcement}', [Instructor\AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('announcements/{announcement}', [Instructor\AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        // Newsletter
        Route::get('cohorts/{cohort}/newsletter', [Instructor\NewsletterController::class, 'compose'])->name('newsletter.compose');
        Route::post('cohorts/{cohort}/newsletter', [Instructor\NewsletterController::class, 'send'])->name('newsletter.send');

        // Finance
        Route::get('finance', [Instructor\FinanceController::class, 'index'])->name('finance.index');

        // Student Roster
        Route::get('cohorts/{cohort}/students', [Instructor\StudentRosterController::class, 'index'])->name('roster.index');
        Route::get('cohorts/{cohort}/students/{user}', [Instructor\StudentRosterController::class, 'show'])->name('roster.show');

        // Certification
        Route::post('cohorts/{cohort}/certify', [Instructor\CertificationController::class, 'generate'])->name('cohorts.certify');
    });

// Student routes
Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/dashboard', [Student\DashboardController::class, 'index'])->name('dashboard');
        Route::get('cohorts', [Student\CohortController::class, 'index'])->name('cohorts.index');
        Route::get('cohorts/{cohort}', [Student\CohortController::class, 'show'])->name('cohorts.show');
        Route::post('cohorts/{cohort}/enroll', [Student\CohortController::class, 'enroll'])->name('cohorts.enroll');

        // Tasks
        Route::get('cohorts/{cohort}/tasks/{cohortTask}', [Student\TaskController::class, 'show'])->name('tasks.show');

        // Code Editor (individual tasks)
        Route::get('tasks/{submission}/editor', [Student\CodeEditorController::class, 'show'])->name('tasks.editor');
        Route::post('tasks/{cohortTask}/code-submit', [Student\CodeEditorController::class, 'submit'])->name('tasks.code-submit');
        Route::put('tasks/{submission}/code-save', [Student\CodeEditorController::class, 'saveDraft'])->name('tasks.code-save');

        // GitHub Submissions (project tasks)
        Route::post('tasks/{cohortTask}/github-submit', [Student\GitHubSubmissionController::class, 'submit'])->name('tasks.github-submit');

        // Task Discussions
        Route::post('tasks/{cohortTask}/discussions', [Student\TaskDiscussionController::class, 'store'])->name('discussions.store');
        Route::delete('discussions/{discussion}', [Student\TaskDiscussionController::class, 'destroy'])->name('discussions.destroy');

        // AI Doubt Assistant
        Route::get('ai/doubt', [Student\AiDoubtAssistantController::class, 'index'])->name('ai.doubt.index');
        Route::get('ai/doubt/{conversation}', [Student\AiDoubtAssistantController::class, 'show'])->name('ai.doubt.show');
        Route::post('ai/doubt', [Student\AiDoubtAssistantController::class, 'ask'])->name('ai.doubt.ask')->middleware('throttle:ai');

        // AI Interview Simulator
        Route::get('ai/interview', [Student\AiInterviewSimController::class, 'index'])->name('ai.interview.index');
        Route::post('ai/interview/start', [Student\AiInterviewSimController::class, 'start'])->name('ai.interview.start');
        Route::get('ai/interview/{conversation}', [Student\AiInterviewSimController::class, 'show'])->name('ai.interview.show');
        Route::post('ai/interview/{conversation}/respond', [Student\AiInterviewSimController::class, 'respond'])->name('ai.interview.respond')->middleware('throttle:ai');

        // Progress Reports
        Route::get('progress-reports', [Student\ProgressReportController::class, 'index'])->name('progress-reports.index');
        Route::get('progress-reports/{report}', [Student\ProgressReportController::class, 'show'])->name('progress-reports.show');

        // Payments
        Route::get('checkout/{cohort}', [Student\PaymentController::class, 'checkout'])->name('checkout');
        Route::post('checkout/{cohort}/create-order', [Student\PaymentController::class, 'createOrder'])->name('checkout.create-order');
        Route::post('checkout/verify', [Student\PaymentController::class, 'verify'])->name('checkout.verify');

        // Billing
        Route::get('billing', [Student\BillingController::class, 'index'])->name('billing.index');
        Route::get('billing/invoices/{invoice}', [Student\BillingController::class, 'downloadInvoice'])->name('billing.invoice');

        // Referrals
        Route::get('referrals', [Student\ReferralController::class, 'index'])->name('referrals.index');

        // Certificates
        Route::get('certificates', [Student\CertificateController::class, 'index'])->name('certificates.index');
        Route::get('certificates/{certificate}/download', [Student\CertificateController::class, 'download'])->name('certificates.download');

        // Portfolio
        Route::get('portfolio/edit', [Student\PortfolioController::class, 'edit'])->name('portfolio.edit');
        Route::put('portfolio', [Student\PortfolioController::class, 'update'])->name('portfolio.update');

        // Badges
        Route::get('badges', [Student\BadgeController::class, 'index'])->name('badges.index');

        // Support
        Route::get('support', [Student\SupportController::class, 'index'])->name('support.index');
        Route::get('support/create', [Student\SupportController::class, 'create'])->name('support.create');
        Route::post('support', [Student\SupportController::class, 'store'])->name('support.store');
        Route::get('support/{ticket}', [Student\SupportController::class, 'show'])->name('support.show');
        Route::post('support/{ticket}/reply', [Student\SupportController::class, 'reply'])->name('support.reply');

        // Office Hours (student booking)
        Route::get('office-hours', [Student\OfficeHoursController::class, 'index'])->name('office-hours.index');
        Route::post('office-hours/{slot}/book', [Student\OfficeHoursController::class, 'book'])->name('office-hours.book');

        // Notifications
        Route::get('notifications', [Student\NotificationController::class, 'index'])->name('notifications.index');
        Route::put('notifications/{id}/read', [Student\NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('notifications/mark-all-read', [Student\NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');
    });

// Webhook routes (no auth, no CSRF)
Route::post('/webhooks/razorpay', [App\Http\Controllers\WebhookController::class, 'razorpay'])->name('webhooks.razorpay');

// Public pages (no auth)
Route::get('/ref/{code}', [App\Http\Controllers\Public\AffiliateRedirectController::class, 'redirect'])->name('affiliate.redirect');
Route::get('/cohort/{slug}', [App\Http\Controllers\Public\CohortLandingController::class, 'show'])->name('cohort.landing');

Route::get('/verify/{uuid}', [App\Http\Controllers\Public\CertificateVerificationController::class, 'show'])->name('certificate.verify');
Route::get('/portfolio/{slug}', [App\Http\Controllers\Public\PortfolioViewController::class, 'show'])->name('portfolio.view');

require __DIR__.'/auth.php';

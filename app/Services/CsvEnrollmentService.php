<?php

namespace App\Services;

use App\Models\CohortEnrollment;
use App\Models\PartnerEnrollment;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CsvEnrollmentService
{
    public function processFromPartner(UploadedFile $file, int $cohortId, int $partnerId): array
    {
        $rows = array_map('str_getcsv', file($file->getPathname()));
        $header = array_shift($rows); // Remove header row

        $enrolled = 0;
        $errors = 0;

        foreach ($rows as $row) {
            try {
                $name = $row[0] ?? null;
                $email = $row[1] ?? null;

                if (!$name || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $errors++;
                    continue;
                }

                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'password' => bcrypt(Str::random(12)),
                        'role' => 'student',
                        'uuid' => (string) Str::uuid(),
                        'is_active' => true,
                    ]
                );

                CohortEnrollment::firstOrCreate(
                    ['cohort_id' => $cohortId, 'student_id' => $user->id],
                    ['status' => 'enrolled', 'enrolled_at' => now()]
                );

                PartnerEnrollment::create([
                    'partner_id' => $partnerId,
                    'cohort_id' => $cohortId,
                    'student_id' => $user->id,
                    'enrolled_via' => 'csv_bulk',
                    'created_at' => now(),
                ]);

                $enrolled++;
            } catch (\Exception $e) {
                $errors++;
            }
        }

        return ['enrolled' => $enrolled, 'errors' => $errors];
    }
}

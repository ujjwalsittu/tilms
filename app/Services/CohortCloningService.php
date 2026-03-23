<?php

namespace App\Services;

use App\Models\Cohort;
use App\Models\CohortTask;
use Illuminate\Support\Str;

class CohortCloningService
{
    public function clone(Cohort $source): Cohort
    {
        $clone = $source->replicate([
            'uuid', 'slug', 'invite_code', 'status',
            'created_at', 'updated_at', 'deleted_at',
        ]);

        $clone->title = $source->title . ' (Clone)';
        $clone->slug = Str::slug($clone->title) . '-' . Str::random(6);
        $clone->status = 'draft';
        $clone->cloned_from_id = $source->id;
        $clone->uuid = (string) Str::uuid();
        $clone->save();

        // Clone task assignments
        $source->cohortTasks()->each(function (CohortTask $cohortTask) use ($clone) {
            $clone->cohortTasks()->create([
                'task_id' => $cohortTask->task_id,
                'order_index' => $cohortTask->order_index,
                'is_published' => false,
                'opens_at' => null,
                'due_at' => null,
            ]);
        });

        return $clone;
    }
}

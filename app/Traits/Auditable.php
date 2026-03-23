<?php

namespace App\Traits;

use App\Events\AuditableEvent;

trait Auditable
{
    protected static function bootAuditable(): void
    {
        static::created(function ($model) {
            AuditableEvent::dispatch(
                class_basename($model) . '.created',
                $model,
                null,
                $model->getAttributes(),
            );
        });

        static::updated(function ($model) {
            $dirty = $model->getDirty();
            if (empty($dirty)) {
                return;
            }

            AuditableEvent::dispatch(
                class_basename($model) . '.updated',
                $model,
                array_intersect_key($model->getOriginal(), $dirty),
                $dirty,
            );
        });

        static::deleted(function ($model) {
            AuditableEvent::dispatch(
                class_basename($model) . '.deleted',
                $model,
                $model->getAttributes(),
                null,
            );
        });
    }
}

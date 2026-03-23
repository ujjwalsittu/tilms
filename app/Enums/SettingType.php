<?php

namespace App\Enums;

enum SettingType: string
{
    case String = 'string';
    case Boolean = 'boolean';
    case Integer = 'integer';
    case Json = 'json';
    case File = 'file';

    public function label(): string
    {
        return match ($this) {
            self::String => 'String',
            self::Boolean => 'Boolean',
            self::Integer => 'Integer',
            self::Json => 'JSON',
            self::File => 'File',
        };
    }
}

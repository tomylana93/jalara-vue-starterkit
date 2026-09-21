<?php

declare(strict_types=1);

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.application_name', config('app.name'));
        $this->migrator->add('general.application_description');
        $this->migrator->add('general.contact_email');
        $this->migrator->add('general.default_locale', config('app.locale'));
        $this->migrator->add('general.timezone', config('app.timezone'));
    }
};

<?php

namespace Database\Seeders;
use App\Models\Company;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $company = Company::create([
            'name' => 'Dicoding Indonesia',
            'business_sector' => 'Technology',
            'size' => '50-100 Karyawan',
            'website' => 'https://www.dicoding.com',
        ]);

        Vacancy::factory()->count(15)->for($company)->create();
    }
}

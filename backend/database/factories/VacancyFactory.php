<?php

namespace Database\Factories;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vacancy>
 */
class VacancyFactory extends Factory
{
    public function definition(): array
    {
        $salaryMin = fake()->randomElement([5, 7, 8, 10, 12, 15]) * 1_000_000;

        return [
            'company_id'        => Company::factory(),
            'title'             => fake()->randomElement([
                'Product Engineer',
                'Android Developer',
                'iOS Developer',
                'Code Reviewer',
                'Backend Developer',
                'Frontend Developer',
                'Data Analyst',
                'UI/UX Designer',
            ]),
            'position'          => fake()->randomElement([
                'Software Engineer',
                'Mobile Developer',
                'Data & Analytics',
                'Design',
            ]),
            'employment_type'   => fake()->randomElement(EmploymentType::cases()),
            'candidates_needed' => fake()->numberBetween(1, 5),
            'active_until'      => fake()->dateTimeBetween('+1 week', '+2 months'),
            'location'          => fake()->randomElement(['Bandung', 'Jakarta', 'Surabaya', 'Yogyakarta']),
            'is_remote'         => fake()->boolean(30),
            'description'       => '<h3>Deskripsi Pekerjaan</h3>'
                . '<p>' . fake()->paragraph() . '</p>'
                . '<h3>Tanggung Jawab</h3>'
                . '<ul><li>' . fake()->sentence() . '</li><li>' . fake()->sentence() . '</li></ul>'
                . '<h3>Persyaratan</h3>'
                . '<ul><li>' . fake()->sentence() . '</li><li>' . fake()->sentence() . '</li></ul>',
            'salary_min'        => $salaryMin,
            'salary_max'        => fake()->boolean(80)
                ? $salaryMin + fake()->randomElement([3, 5, 7]) * 1_000_000
                : null,
            'show_salary'       => fake()->boolean(60),
            'min_experience'    => fake()->randomElement(ExperienceLevel::cases()),
        ];
    }
}
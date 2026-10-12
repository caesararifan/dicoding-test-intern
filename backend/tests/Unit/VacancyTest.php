<?php

namespace Tests\Unit;

use App\Enums\EmploymentType;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class VacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_scope_is_case_insensitive(): void
    {
        Vacancy::factory()->create(['title' => 'Android Developer']);
        Vacancy::factory()->create(['title' => 'Code Reviewer']);

        $titles = Vacancy::search('developer')->pluck('title');

        $this->assertCount(1, $titles);
        $this->assertSame('Android Developer', $titles->first());
    }

    public function test_search_scope_without_term_returns_all(): void
    {
        Vacancy::factory()->count(2)->create();

        $this->assertSame(2, Vacancy::search(null)->count());
    }

    public function test_active_scope_excludes_expired_vacancies(): void
    {
        Vacancy::factory()->create(['active_until' => now()->subDay()]);
        Vacancy::factory()->create(['active_until' => now()->addDay()]);

        $this->assertSame(1, Vacancy::active()->count());
    }

    public function test_attributes_are_cast(): void
    {
        $vacancy = Vacancy::factory()
            ->create(['employment_type' => EmploymentType::Intern])
            ->refresh();

        $this->assertSame(EmploymentType::Intern, $vacancy->employment_type);
        $this->assertInstanceOf(Carbon::class, $vacancy->active_until);
    }
}
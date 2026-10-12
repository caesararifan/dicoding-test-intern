<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyApiTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $override = []): array
    {
        return array_merge([
            'title'             => 'Backend Engineer',
            'position'          => 'Software Engineer',
            'employment_type'   => 'full_time',
            'candidates_needed' => 2,
            'active_until'      => now()->addMonth()->toDateString(),
            'location'          => 'Bandung',
            'is_remote'         => false,
            'description'       => '<p>Deskripsi</p>',
            'salary_min'        => 8000000,
            'salary_max'        => 12000000,
            'show_salary'       => true,
            'min_experience'    => '1_3',
        ], $override);
    }

    public function test_it_lists_vacancies(): void
    {
        Vacancy::factory()->count(3)->create();

        $this->getJson('/api/vacancies')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'title', 'employment_type', 'location', 'company' => ['name']]],
                'links',
                'meta',
            ]);
    }

    public function test_it_searches_vacancies_by_title(): void
    {
        Vacancy::factory()->create(['title' => 'Android Developer']);
        Vacancy::factory()->create(['title' => 'iOS Developer']);
        Vacancy::factory()->create(['title' => 'Code Reviewer']);

        $this->getJson('/api/vacancies?search=developer')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_search_with_no_match_returns_empty_list(): void
    {
        Vacancy::factory()->create(['title' => 'Code Reviewer']);

        $this->getJson('/api/vacancies?search=zzz')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_it_shows_a_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create(['title' => 'Product Engineer']);

        $this->getJson("/api/vacancies/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $vacancy->id)
            ->assertJsonPath('data.title', 'Product Engineer');
    }

    public function test_it_returns_404_for_unknown_vacancy(): void
    {
        $this->getJson('/api/vacancies/9999')->assertNotFound();
    }

    public function test_salary_is_hidden_when_show_salary_is_false(): void
    {
        $vacancy = Vacancy::factory()->create(['show_salary' => false]);

        $this->getJson("/api/vacancies/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('data.salary_min', null)
            ->assertJsonPath('data.salary_max', null);
    }

    public function test_it_creates_a_vacancy(): void
    {
        Company::factory()->create();

        $this->postJson('/api/vacancies', $this->payload())
            ->assertCreated()
            ->assertJsonPath('data.title', 'Backend Engineer');

        $this->assertDatabaseHas('vacancies', ['title' => 'Backend Engineer']);
    }

    public function test_create_fails_validation_with_empty_body(): void
    {
        Company::factory()->create();

        $this->postJson('/api/vacancies', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'position', 'employment_type', 'min_experience']);
    }

    public function test_it_updates_a_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create(['title' => 'Old Title']);

        $this->patchJson("/api/vacancies/{$vacancy->id}", ['title' => 'New Title'])
            ->assertOk()
            ->assertJsonPath('data.title', 'New Title');

        $this->assertDatabaseHas('vacancies', ['id' => $vacancy->id, 'title' => 'New Title']);
    }

    public function test_it_deletes_a_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->deleteJson("/api/vacancies/{$vacancy->id}")->assertNoContent();

        $this->assertDatabaseMissing('vacancies', ['id' => $vacancy->id]);
    }
}
<?php

namespace Tests\Unit;

use App\Http\Requests\StoreVacancyRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class StoreVacancyRequestTest extends TestCase
{
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

    private function validate(array $data)
    {
        return Validator::make($data, (new StoreVacancyRequest())->rules());
    }

    public function test_valid_payload_passes(): void
    {
        $this->assertTrue($this->validate($this->payload())->passes());
    }

    public function test_required_fields_are_enforced(): void
    {
        $errors = $this->validate([])->errors()->keys();

        foreach (['title', 'position', 'employment_type', 'candidates_needed',
                  'active_until', 'location', 'description', 'salary_min', 'min_experience'] as $field) {
            $this->assertContains($field, $errors);
        }
    }

    public function test_salary_max_is_optional(): void
    {
        $this->assertTrue($this->validate($this->payload(['salary_max' => null]))->passes());
    }

    public function test_salary_max_must_not_be_below_min(): void
    {
        $v = $this->validate($this->payload(['salary_min' => 10000000, 'salary_max' => 5000000]));

        $this->assertContains('salary_max', $v->errors()->keys());
    }

    public function test_invalid_enum_values_fail(): void
    {
        $v = $this->validate($this->payload(['employment_type' => 'freelance', 'min_experience' => 'x']));

        $this->assertContains('employment_type', $v->errors()->keys());
        $this->assertContains('min_experience', $v->errors()->keys());
    }

    public function test_active_until_cannot_be_in_the_past(): void
    {
        $v = $this->validate($this->payload(['active_until' => now()->subDay()->toDateString()]));

        $this->assertContains('active_until', $v->errors()->keys());
    }
}
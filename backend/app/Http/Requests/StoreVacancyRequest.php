<?php

namespace App\Http\Requests;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'             => ['required', 'string', 'max:255'],
            'position'          => ['required', 'string', 'max:255'],
            'employment_type'   => ['required', Rule::enum(EmploymentType::class)],
            'candidates_needed' => ['required', 'integer', 'min:1'],
            'active_until'      => ['required', 'date', 'after_or_equal:today'],
            'location'          => ['required', 'string', 'max:255'],
            'is_remote'         => ['boolean'],
            'description'       => ['required', 'string'],
            'salary_min'        => ['required', 'integer', 'min:0'],
            'salary_max'        => ['nullable', 'integer', 'gte:salary_min'],
            'show_salary'       => ['boolean'],
            'min_experience'    => ['required', Rule::enum(ExperienceLevel::class)],
        ];
    }
}
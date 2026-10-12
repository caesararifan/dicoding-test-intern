<?php

namespace App\Http\Requests;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'             => ['sometimes', 'required', 'string', 'max:255'],
            'position'          => ['sometimes', 'required', 'string', 'max:255'],
            'employment_type'   => ['sometimes', 'required', Rule::enum(EmploymentType::class)],
            'candidates_needed' => ['sometimes', 'required', 'integer', 'min:1'],
            'active_until'      => ['sometimes', 'required', 'date'],
            'location'          => ['sometimes', 'required', 'string', 'max:255'],
            'is_remote'         => ['sometimes', 'boolean'],
            'description'       => ['sometimes', 'required', 'string'],
            'salary_min'        => ['sometimes', 'required', 'integer', 'min:0'],
            'salary_max'        => ['sometimes', 'nullable', 'integer', 'gte:salary_min'],
            'show_salary'       => ['sometimes', 'boolean'],
            'min_experience'    => ['sometimes', 'required', Rule::enum(ExperienceLevel::class)],
        ];
    }
}
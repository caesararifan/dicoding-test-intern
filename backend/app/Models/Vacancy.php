<?php

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'position', 'employment_type', 'candidates_needed',
        'active_until', 'location', 'is_remote', 'description',
        'salary_min', 'salary_max', 'show_salary', 'min_experience',
    ];

    protected function casts(): array
    {
        return [
            'employment_type' => EmploymentType::class,
            'min_experience'  => ExperienceLevel::class,
            'active_until'    => 'date',
            'is_remote'       => 'boolean',
            'show_salary'     => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        return $query->when($term, fn ($q) =>
            $q->where('title', 'ILIKE', '%' . $term . '%')
        );
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereDate('active_until', '>=', now());
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'logo_url'        => $this->logo_url,
            'business_sector' => $this->business_sector,
            'size'            => $this->size,
            'website'         => $this->website,
        ];
    }
}
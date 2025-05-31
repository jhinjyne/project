<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicantComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment',
        'category_id',
        'applicant_id',
    ];

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

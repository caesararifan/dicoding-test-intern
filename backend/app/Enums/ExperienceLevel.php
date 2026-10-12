<?php

namespace App\Enums;

enum ExperienceLevel: string
{
    case LessThanOne = 'lt_1';
    case OneToThree  = '1_3';
    case FourToFive  = '4_5';
    case SixToTen    = '6_10';
    case MoreThanTen = 'gt_10';
}
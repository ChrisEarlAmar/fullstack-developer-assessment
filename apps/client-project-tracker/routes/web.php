<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function (Request $request) {
    abort_if($request->is('api', 'api/*'), 404);

    return view('app');
})->where('any', '.*');

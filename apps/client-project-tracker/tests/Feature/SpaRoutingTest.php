<?php

namespace Tests\Feature;

use Tests\TestCase;

class SpaRoutingTest extends TestCase
{
    public function test_client_routes_are_served_by_the_spa_shell(): void
    {
        foreach (['/', '/analytics', '/projects', '/a-client-route-that-does-not-exist'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('<div id="app"></div>', false);
        }
    }

    public function test_unknown_api_routes_return_a_json_not_found_response(): void
    {
        $this->getJson('/api/does-not-exist')
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Applicant;
use App\Models\ApplicantComment;
use App\Models\Category;
use App\Models\User;

class ApplicantControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Category::create(['name' => 'Default']);

        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    public function testShowReturnsApplicantsWithComments()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $category = Category::create(['name' => 'Test Category']);
        $applicant = Applicant::factory()->create();

        ApplicantComment::factory()->create([
            'applicant_id' => $applicant->id,
            'category_id' => $category->id,
        ]);

        $response = $this->getJson('/api/applicants');

        $response->assertStatus(200)
                ->assertJsonStructure([['id', 'applicant_comments']]);
    }

    public function testShowApplicantReturnsApplicant()
    {
        $applicant = Applicant::factory()->create();

        $response = $this->getJson("/api/applicants/{$applicant->id}");
        $response->assertStatus(200)
                 ->assertJson(['id' => $applicant->id]);
    }

    public function testShowApplicantReturns404WhenNotFound()
    {
        $response = $this->getJson("/api/applicants/99999");
        $response->assertStatus(404)
                 ->assertJson(['message' => 'Applicant not found']);
    }

    public function testAddCreatesApplicantWithComments()
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '123456789',
            'address' => '123 Street',
            'comments' => [
                ['text' => 'Test comment', 'category_id' => 1]
            ],
        ];

        $response = $this->postJson('/api/applicants', $payload);
        $response->assertStatus(201)
                 ->assertJsonFragment(['email' => 'john@example.com']);
    }

    public function testAddReturns422OnDuplicateEmail()
    {
        Applicant::factory()->create(['email' => 'duplicate@example.com']);

        $payload = [
            'name' => 'Jane',
            'email' => 'duplicate@example.com',
            'phone' => '123',
            'address' => 'Addr',
            'comments' => [],
        ];

        $response = $this->postJson('/api/applicants', $payload);
        $response->assertStatus(422)
                 ->assertJson(['error' => 'Email already taken.']);
    }

    public function testUpdateApplicantSuccess()
    {
        $applicant = Applicant::factory()->create();

        $payload = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '999999',
            'address' => 'Updated address',
        ];

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
                        ->putJson("/api/applicants/get/{$applicant->id}", $payload);

        $response->assertStatus(200)
                ->assertJsonFragment(['message' => 'Applicant updated successfully']);
    }


    public function testUpdateApplicantReturns404()
    {
        $response = $this->putJson('/api/applicants/get/9999', [
            'name' => 'Name',
            'email' => 'email@example.com',
        ]);

        $response->assertStatus(404);
    }

    public function testDestroyDeletesApplicant()
    {
        $applicant = Applicant::factory()->create();
        $response = $this->deleteJson("/api/applicants/{$applicant->id}");
        $response->assertStatus(200)
                 ->assertJson(['message' => 'Deleted successfully']);
    }

    public function testAddComment()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $applicant = Applicant::factory()->create();

        $payload = [
            'applicant_id' => $applicant->id,
            'comment' => 'New comment',
            'category_id' => 1,
        ];

        $response = $this->postJson('/api/addComments', $payload);
        $response->assertStatus(200)
                ->assertJsonFragment(['comment' => 'New comment']);
    }

    public function testUpdateComment()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $comment = ApplicantComment::factory()->create(['category_id' => 1]);

        $payload = ['comment' => 'Updated', 'category_id' => 1];
        $response = $this->putJson("/api/comments/{$comment->id}", $payload);

        $response->assertStatus(200)
                ->assertJsonFragment(['message' => 'Comment updated successfully']);
    }

    public function testDestroyComment()
    {
        $comment = ApplicantComment::factory()->create();

        $response = $this->deleteJson("/api/comments/{$comment->id}");

        $response->assertStatus(200)
                ->assertJson(['message' => 'Comment deleted successfully']);
    }

    public function testDestroyCommentReturns404()
    {
        $response = $this->deleteJson('/api/applicant-comments/9999');
        $response->assertStatus(404);
    }
}

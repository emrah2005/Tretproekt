<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['brand', 'influencer']);
            $table->text('bio')->nullable();
            $table->string('avatar_url')->nullable();
            $table->json('dna_vector')->nullable();
            $table->json('metrics')->nullable();
            $table->integer('followers')->default(0);
            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->string('niche')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};

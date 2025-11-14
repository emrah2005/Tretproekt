<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create users table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('user_type', ['brand', 'influencer'])->default('brand');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Create profiles table - for influencer profiles
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('profile_picture')->nullable();
            $table->text('bio')->nullable();
            $table->string('niche')->nullable();
            $table->json('categories')->nullable();
            $table->integer('followers_count')->default(0);
            $table->string('website')->nullable();
            $table->json('social_media_links')->nullable();
            $table->decimal('engagement_rate', 5, 2)->nullable();
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });

        // Create campaigns table
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->text('objectives')->nullable();
            $table->json('target_niches')->nullable();
            $table->decimal('budget', 12, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('influencer_slots')->default(1);
            $table->enum('status', ['draft', 'active', 'paused', 'completed'])->default('draft');
            $table->string('deliverables')->nullable();
            $table->timestamps();
        });

        // Create applications table - influencers apply to campaigns
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('influencer_id')->constrained('users')->onDelete('cascade');
            $table->text('cover_letter')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed'])->default('pending');
            $table->decimal('proposed_rate', 12, 2)->nullable();
            $table->timestamps();
        });

        // Create contracts table - agreement between brand and influencer
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            $table->foreignId('brand_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('influencer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('agreed_rate', 12, 2);
            $table->text('terms_conditions')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        // Create threads table - for messaging between users
        Schema::create('threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_one_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_two_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('last_message_at')->nullable();
            $table->timestamps();
        });

        // Create messages table
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('thread_id')->constrained('threads')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->longText('content');
            $table->json('attachments')->nullable();
            $table->enum('status', ['sent', 'delivered', 'read'])->default('sent');
            $table->timestamps();
        });

        // Create ratings table - for reviewing influencers and campaigns
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rater_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rated_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('contract_id')->nullable()->constrained('contracts')->onDelete('cascade');
            $table->integer('rating')->between(1, 5);
            $table->text('comment')->nullable();
            $table->enum('type', ['influencer', 'brand']); // Type of user being rated
            $table->timestamps();
        });

        // Create payments table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->enum('payment_method', ['credit_card', 'bank_transfer', 'paypal'])->default('credit_card');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // Create deliverables table - track what influencers need to deliver
        Schema::create('deliverables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->date('due_date');
            $table->enum('status', ['pending', 'in_progress', 'submitted', 'approved', 'rejected'])->default('pending');
            $table->json('files')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
        });

        // Create password_reset_tokens table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Create sessions table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Create notifications table
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['application', 'payment', 'contract', 'message', 'rating', 'deliverable'])->default('message');
            $table->json('data')->nullable();
            $table->boolean('read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('deliverables');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('threads');
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('profiles');
        Schema::dropIfExists('users');
    }
};

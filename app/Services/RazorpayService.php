<?php

namespace App\Services;

use App\Models\ApiKey;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class RazorpayService
{
    private function getCredentials(): array
    {
        $env = DB::table('platform_settings')->where('key', 'razorpay_environment')->value('value') ?? 'test';

        $keyId = ApiKey::where('service', 'razorpay')
            ->where('key_name', "razorpay_{$env}_key_id")
            ->where('is_active', true)->first();
        $keySecret = ApiKey::where('service', 'razorpay')
            ->where('key_name', "razorpay_{$env}_key_secret")
            ->where('is_active', true)->first();

        if (!$keyId || !$keySecret) {
            throw new \RuntimeException("Razorpay {$env} credentials not configured.");
        }

        return [
            'key_id' => Crypt::decryptString($keyId->encrypted_value),
            'key_secret' => Crypt::decryptString($keySecret->encrypted_value),
            'environment' => $env,
        ];
    }

    public function createOrder(float $amount, string $currency = 'INR', array $notes = []): array
    {
        $creds = $this->getCredentials();

        $response = \Illuminate\Support\Facades\Http::withBasicAuth($creds['key_id'], $creds['key_secret'])
            ->post('https://api.razorpay.com/v1/orders', [
                'amount' => (int)($amount * 100), // Convert to paise
                'currency' => $currency,
                'notes' => $notes,
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Razorpay order creation failed: ' . $response->body());
        }

        return $response->json();
    }

    public function verifySignature(string $orderId, string $paymentId, string $signature): bool
    {
        $creds = $this->getCredentials();
        $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $creds['key_secret']);
        return hash_equals($expectedSignature, $signature);
    }

    public function capturePayment(string $paymentId, float $amount, string $currency = 'INR'): array
    {
        $creds = $this->getCredentials();

        $response = \Illuminate\Support\Facades\Http::withBasicAuth($creds['key_id'], $creds['key_secret'])
            ->post("https://api.razorpay.com/v1/payments/{$paymentId}/capture", [
                'amount' => (int)($amount * 100),
                'currency' => $currency,
            ]);

        return $response->json();
    }

    public function getKeyId(): string
    {
        $creds = $this->getCredentials();
        return $creds['key_id'];
    }

    public function getEnvironment(): string
    {
        return DB::table('platform_settings')->where('key', 'razorpay_environment')->value('value') ?? 'test';
    }
}

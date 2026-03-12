<?php

declare(strict_types=1);

function get_return_url(): string
{
    $fallback = 'index.html';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';

    if ($referer === '') {
        return $fallback;
    }

    $parts = parse_url($referer);
    if (!is_array($parts) || !isset($parts['path'])) {
        return $fallback;
    }

    $path = basename((string) $parts['path']);
    if ($path === '' || substr($path, -5) !== '.html') {
        return $fallback;
    }

    return $path;
}

function redirect_with_alert(string $message, string $target): void
{
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $safeTarget = htmlspecialchars($target, ENT_QUOTES, 'UTF-8');

    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Subscribe</title></head><body>';
    echo '<script>alert("' . $safeMessage . '");window.location.href="' . $safeTarget . '";</script>';
    echo '</body></html>';
    exit;
}

$returnUrl = get_return_url();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_alert('Invalid request.', $returnUrl);
}

$email = filter_var(trim($_POST['subscriber_email'] ?? ''), FILTER_VALIDATE_EMAIL);

if ($email === false) {
    redirect_with_alert('Please enter a valid email address.', $returnUrl);
}

$to = 'hello@thinkingelephants.com';
$subject = 'New Footer Subscription';
$body = "A new user subscribed from the website footer.\n\n"
    . "Email: {$email}\n"
    . "Source page: {$returnUrl}\n";

$host = preg_replace('/[^a-zA-Z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? 'thinkingelephants.com');
$from = 'noreply@' . ($host !== '' ? $host : 'thinkingelephants.com');

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $from,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    redirect_with_alert('Thank you for subscribing.', $returnUrl);
}

redirect_with_alert('Sorry, subscription failed. Please try again.', $returnUrl);

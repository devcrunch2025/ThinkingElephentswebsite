<?php

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html?status=invalid');
    exit;
}

function clean_input(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

$name = clean_input($_POST['name'] ?? '');
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = clean_input($_POST['phone'] ?? '');
$formSubject = clean_input($_POST['subject'] ?? '');
$messageText = trim($_POST['message'] ?? '');

if ($name === '' || $email === false || $phone === '' || $formSubject === '' || $messageText === '') {
    header('Location: contact.html?status=invalid');
    exit;
}

$to = 'hello@thinkingelephants.com';
$subject = 'New Contact Form: ' . $formSubject;
$body = "You received a new contact form message.\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Subject: {$formSubject}\n\n"
    . "Message:\n{$messageText}\n";

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
    header('Location: contact.html?status=success');
    exit;
}

header('Location: contact.html?status=error');
exit;

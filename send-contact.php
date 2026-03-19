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

$to = 'devcrunch2025@gmail.com';
$subject = 'New Contact Form: ' . $formSubject;

$logoUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://')
        . ($_SERVER['HTTP_HOST'] ?? 'thinkingelephants.com') . '/asset/img/logo.png';
$body = '<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;background:#f8f8f8;padding:0;margin:0;">
<table width="100%" bgcolor="#f8f8f8" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
        <td align="center">
            <table width="520" bgcolor="#fff" cellpadding="0" cellspacing="0" style="border-radius:8px;box-shadow:0 2px 8px #eee;overflow:hidden;">
                <tr>
                    <td align="center" style="padding:24px 0 12px 0;">
                        <img src="' . $logoUrl . '" alt="Thinking Elephants Logo" width="80" style="display:block;margin:0 auto 8px auto;">
                        <h2 style="margin:0;color:#333;font-size:22px;font-weight:600;">New Contact Form Submission</h2>
                    </td>
                </tr>
                <tr><td style="padding:0 32px 24px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:16px;color:#222;">
                        <tr><td style="padding:8px 0;font-weight:bold;width:120px;">Name:</td><td>' . htmlspecialchars($name) . '</td></tr>
                        <tr><td style="padding:8px 0;font-weight:bold;">Email:</td><td>' . htmlspecialchars($email) . '</td></tr>
                        <tr><td style="padding:8px 0;font-weight:bold;">Phone:</td><td>' . htmlspecialchars($phone) . '</td></tr>
                        <tr><td style="padding:8px 0;font-weight:bold;">Subject:</td><td>' . htmlspecialchars($formSubject) . '</td></tr>
                        <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top;">Message:</td><td>' . nl2br(htmlspecialchars($messageText)) . '</td></tr>
                    </table>
                </td></tr>
                <tr><td align="center" style="background:#f2f2f2;padding:16px 0;color:#888;font-size:13px;">This is an automated notification from Thinking Elephants.</td></tr>
            </table>
        </td>
    </tr>
</table>
</body></html>';

$host = preg_replace('/[^a-zA-Z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? 'thinkingelephants.com');
$from = 'noreply@' . ($host !== '' ? $host : 'thinkingelephants.com');

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $from,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
];



require_once __DIR__ . '/asset/php/smtp_mailer.php';
$sent = send_smtp_mail($to, $subject, $body, $from);
if ($sent) {
    header('Location: contact.html?status=success');
    exit;
}
header('Location: contact.html?status=error');
exit;

<?php
// test-smtp-mail.php
require_once __DIR__ . '/asset/php/smtp_mailer.php'; // fallback for local
if (!function_exists('send_smtp_mail')) {
    // Try alternate path for server root
    require_once __DIR__ . '/asset/php/smtp_mailer.php';
    if (!function_exists('send_smtp_mail')) {
        require_once dirname(__FILE__) . '/asset/php/smtp_mailer.php';
    }
}

$to = 'devcrunch2025@gmail.com';
$subject = 'SMTP Test Mail';
$body = '<!DOCTYPE html><html><body><h2 style="color:#2a2a2a;">SMTP Test Email</h2><p>This is a test email sent using the custom SMTP function from smtp_mailer.php.</p></body></html>';
$from = '_mainaccount@thinkingelephants.com';

$result = send_smtp_mail($to, $subject, $body, $from);

if ($result) {
    echo '<h3 style="color:green;">✅ Test mail sent successfully!</h3>';
} else {
    echo '<h3 style="color:red;">❌ Failed to send test mail.</h3>';
}
?>

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);
<?php
// asset/php/smtp_mailer.php

// Set this to 'custom' for your own SMTP, or 'gmail' for Gmail SMTP
$smtp_mode = 'custom'; // 'custom' or 'gmail'


function get_response($fp) {
    $response = '';
    while ($str = fgets($fp, 515)) {
        $response .= $str;
        if (substr($str, 3, 1) == ' ') break;
    }
    return $response;
}

function send_cmd($fp, $cmd) {
    fwrite($fp, $cmd . "\r\n");
    return get_response($fp);
}


function send_smtp_mail($to, $subject, $body, $from = null) {
    global $smtp_mode;
    if ($smtp_mode === 'gmail') {
        // --- Gmail SMTP settings ---
        $host = "smtp.gmail.com";
        $port = 465;
        $username = "devcrunch2025@gmail.com"; // <-- CHANGE THIS
        $password = "dyfabfallhjyomfm";      // <-- CHANGE THIS (App Password, not your main password)
        $smtp_from = $username;
    } else {
        // --- Custom SMTP settings ---
        $host = "mail.thinkingelephants.com";
        $port = 465;
        $username = "_mainaccount@thinkingelephants.com";
        $password = "Elephuser@1233";
        $smtp_from = $username;
    }
    $smtp_to = $to;

    $fp = @fsockopen("ssl://$host", $port, $errno, $errstr, 10);
    if ($fp) {
        get_response($fp);
        send_cmd($fp, "EHLO localhost");
        send_cmd($fp, "AUTH LOGIN");
        send_cmd($fp, base64_encode($username));
        send_cmd($fp, base64_encode($password));
        send_cmd($fp, "MAIL FROM:<$smtp_from>");
        send_cmd($fp, "RCPT TO:<$smtp_to>");
        send_cmd($fp, "DATA");
        $smtp_message = "Subject: ".$subject."\r\n";
        $from_name = 'Thinking Elephants';
        $smtp_message .= "From: =?UTF-8?B?" . base64_encode($from_name) . "?= <$smtp_from>\r\n";
        $smtp_message .= "To: $smtp_to\r\n";
        $smtp_message .= "MIME-Version: 1.0\r\n";
        $smtp_message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $smtp_message .= "\r\n\r\n"; // Ensure two CRLFs between headers and body
        $smtp_message .= $body."\r\n.";
        send_cmd($fp, $smtp_message);
        send_cmd($fp, "QUIT");
        fclose($fp);
        return true;
    }
    return false;
}

<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = "mail.thinkingelephants.com";
$port = 465;
$username = "_mainaccount@thinkingelephants.com";
$password = "Elephuser@1233";

$to = "devcrunch2025@gmail.com";
$from = $username;

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

echo "Connecting...<br>";

$fp = fsockopen("ssl://$host", $port, $errno, $errstr, 10);

if (!$fp) {
    die("❌ Connection failed: $errstr ($errno)");
}

echo "✅ Connected<br>";

// Server greeting
echo get_response($fp);

// EHLO
echo send_cmd($fp, "EHLO localhost");

// AUTH LOGIN
echo send_cmd($fp, "AUTH LOGIN");
echo send_cmd($fp, base64_encode($username));
echo send_cmd($fp, base64_encode($password));

// MAIL FROM
echo send_cmd($fp, "MAIL FROM:<$from>");

// RCPT TO
echo send_cmd($fp, "RCPT TO:<$to>");

// DATA
echo send_cmd($fp, "DATA");

// Email content
$message = "Subject: Test Mail\r\n";
$message .= "From: $from\r\n";
$message .= "To: $to\r\n";
$message .= "\r\n";
$message .= "This is a test email from Core PHP SMTP.\r\n.";

echo send_cmd($fp, $message);

// QUIT
echo send_cmd($fp, "QUIT");

fclose($fp);

echo "<br>✅ Mail process completed";
?>
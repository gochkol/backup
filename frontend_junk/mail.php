<?php
	// EDIT THE 2 LINES BELOW AS REQUIRED
	$email_to = "support@updowntech.com";

	$email_subject = "Contact from Website";

	$first_name = $_POST['first_name']; // required
	$last_name = $_POST['last_name']; // required
	$title = $_POST['title']; // not required
	$company = $_POST['company']; // not required
	$email = $_POST['email']; // not required
	$phone = $_POST['phone']; // not required
	$country = $_POST['country']; // not required
	$comments = $_POST['comments']; // not required

	$email_message = "Form details below.\n\n";
	$email_message .= "First Name: ".$first_name."\n";
	$email_message .= "Last Name: ".$last_name."\n";
	$email_message .= "Title: ".$title."\n";
	$email_message .= "Company: ".$company."\n";
	$email_message .= "Email: ".$email."\n";
	$email_message .= "Telephone: ".$phone."\n";
	$email_message .= "Country: ".$country."\n";
	$email_message .= "Comments: ".$comments."\n";

// create email headers

$headers = "From: ".$email;
@mail("support@updowntech.com", $email_subject, $email_message, $headers);
@mail($email, "Thank you", "We have received your information and will follow up with you shortly", "From: no-reply@updowntech.com");
header('Location:http://www.updowntech.com');
?>

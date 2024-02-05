<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
// Importar clases de PHPMailer al espacio de nombres globales
// Estos deben estar en la parte superior de su script, no dentro de una función
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

if (isset($_GET['mail'])) {

   #Cleaning Html,Script Tags and special characters
   # Limpieza de HTML, etiquetas de script y caracteres especiales
   function postTextClean($text) {
      $text            = trim(addslashes(htmlspecialchars(strip_tags($_POST[$text]))));
      return $text;
   }

   function getTextClean($text) {
      $text            = trim(addslashes(htmlspecialchars(strip_tags($_GET[$text]))));
      $search          = array('Ç','ç','Ğ','ğ','ı','İ','Ö','ö','Ş','ş','Ü','ü');
      $replace         = array('c','c','g','g','i','i','o','o','s','s','u','u');
      $new_text        = str_replace($search,$replace,$text);
      return $new_text;
   }

   $getActionURI       = getTextClean('mail');

   if($getActionURI ==="request") {
      #Let's get the data from the form   
      $contact_name     = postTextClean('contact_name');
      $contact_email    = postTextClean('contact_email');
      $contact_subject  = postTextClean('contact_subject');
      $contact_phone    = postTextClean('contact_phone');
      $contact_message  = postTextClean('contact_message'); 
      $mail_content     = "<h2>De</h2>
                           <p>{$contact_email}</p>
                           <h2>Nombre</h2>
                           <p>{$contact_name}</p>
                           <h2>Teléfono</h2>
                           <p>{$contact_phone}</p>
                           <h2>Asunto</h2>
                           <p>{$contact_subject}</p>
                           <h2>Mensaje</h2>
                           <p>".nl2br($contact_message)."</p>";

      // DATOS SMTP DEL MAIL DE TU HOSTING
      $smtp_host        = 'karlabarrios.com';   // Dominio sin www
      $smtp_port        = 465;   // No cambies el número de puerto
      $smtp_username    = 'hola@karlabarrios.com';   // Cuenta de correo
      $smtp_password    = 'PulmoneZ2rosas!';   // Contraseña del correo



      // Instantiation and passing `true` enables exceptions
      // La instanciación y el paso de `true` habilita excepciones
      $mail = new PHPMailer(true);

      try {
         //Server settings
         $mail->isSMTP();                                                 
         $mail->SMTPAuth   = true;                        
         $mail->Host       = $smtp_host;                     
         $mail->Username   = $smtp_username;                   
         $mail->Password   = $smtp_password;               
         $mail->SMTPSecure = 'ssl';
         $mail->Port       = $smtp_port;                                    
         $mail->CharSet    = "UTF-8";                              
         $mail->setFrom($smtp_username, $contact_subject);
         $mail->addAddress("hola@karlabarrios.com");  // Correo al cual llegarán los mensajes del formulario puede ser gmail o cualquier otro.
         $mail->addReplyTo($contact_email, $contact_name);

         // Content
         $mail->isHTML(true);                                  
         $mail->Subject = $contact_subject;
         $mail->Body    = $mail_content;
         $mail->AltBody = strip_tags($mail_content);
         $mail->send();
         $message       = true;
         echo $message;   
      } catch (Exception $e) {
        $message       = false;
        echo $message;
        echo "Mailer Error: {$mail->ErrorInfo}";
      }
   }
}else {
   /* 
      This is if the incoming get parameter doesn't come by js, 
      this message will greet malicious software developers
   */
   echo "<div class='alert alert-danger'>You entered this area without permission.</div>";
}
?>
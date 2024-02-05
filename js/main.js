/* -------------------------------------------------------------------
 * Plugin Name           : PHP Ajax Contact Form
 * Author Name           : anthoncode
 * Author URI            : https://anthoncode.com
 * File Name             : style.css
------------------------------------------------------------------- */

/* -------------------------------------------------------------------
 [Table of contents]
 * 01.Contact Form
*/
(function($) {
    "use strict";

    // Call all ready functions
    // Llamar a todas las funciones listas
    conformy_contactForm();

})(window.jQuery);

/* ------------------------------------------------------------------- */
/* 02.Contact Form
/* ------------------------------------------------------------------- */
 function conformy_contactForm() {
    "use-strict";
    //  Validate Input Variables
    // Validar variables de entrada
    var contactEmail    = $("#contactEmail");
    var contactPhone    = $("#contactPhone");
    var formControl     = $('.contact-form-group .form-control');
    
    // Added AutoComplete Attribute Turned Off
    // Atributo de Autocompletar agregado desactivado
    formControl.attr("autocomplete","off");

    // Email Validation
    // Validación de correo electrónico
    contactEmail.on("keyup", function() {
        var emailInputValue  = $(this).val().trim();

        if (emailInputValue.length > 0) {
            let validate = $(this).conformyEmailValidate();

            if (!validate === true) {
                $(this).parent().find("span").removeClass("success").addClass("error");
            } else {
                $(this).parent().find("span").removeClass("error").addClass("success");
            }
        }else{
            $(this).parent().find("span").removeAttr("class");  
        }
    });

    // Phone Validation
    // Validación de teléfono
    contactPhone.on("keyup", function() {
        var phoneInputValue  = $(this).val().trim();


        if (phoneInputValue.length > 0) {
            let validate = $(this).conformyPhoneValidate();

            if (!validate === true) {
                $(this).parent().find("span").removeClass("success").addClass("error");
            } else {
                $(this).parent().find("span").removeClass("error").addClass("success");
            }
        }else{
            $(this).parent().find("span").removeAttr("class");
            $(this).parent().find("span").addClass("error");  
        }
    });

    // Form Control Validate
    // Validar control de formulario
    $(".form-control:not('#contactEmail,#contactPhone')").on("keyup", function() {
        var formInputValue  = $(this).val().trim();

        if (formInputValue.length > 0) {
            $(this).parent().find("span").removeClass("error").addClass("success");
        }else {
            $(this).parent().find("span").removeAttr("class");
            $(this).parent().find("span").addClass("error");
        }
    });

    // Popup Variables
    let termsAgree          = $('#termsAgree');

    // Terms Agree
    // Términos de acuerdo
    termsAgree.on("click",function(event){
        $("#termsCheckBox").prop("checked",true);
    });


    //  Captcha Variables    
    let textCaptcha     = $("#txtCaptcha");
    let textCaptchaSpan = $('#txtCaptchaSpan');
    let textInput       = $('#txtInput');

    // Generates the Random number function }
    // Genera la función de número aleatorio
    function randomNumber(){
         
        let a = Math.ceil(Math.random() * 9) + '',
            b = Math.ceil(Math.random() * 9) + '',
            c = Math.ceil(Math.random() * 9) + '',
            d = Math.ceil(Math.random() * 9) + '',
            e = Math.ceil(Math.random() * 9) + '',
            code = a + b + c + d + e;
   
        textCaptcha.val(code);
        textCaptchaSpan.html(code);
    }

    // Called random number function
    // Función llamada número aleatorio
    randomNumber();

    // Validate the Entered input aganist the generated security code function
    // Validar la entrada ingresada junto con la función del código de seguridad generado   
    function validateCaptcha() {
        let str1 = textCaptcha.val();
        let str2 = textInput.val();
        if (str1 == str2) {
            return true;
        } else {
            return false;
        }
    }

    // Form Conttrol Captcha Validate
    // Formulario Conttrol Captcha Validar
    textInput.on("keyup", function() {
        if (validateCaptcha() == true) {
            $(this).parent().find("span").removeClass("error").addClass("success");
        }else {
            $(this).parent().find("span").removeAttr("class");
            $(this).parent().find("span").addClass("error");
        }
    });

    // Contact Form Submit
    // Formulario de contacto Enviar
    $("#contactForm").on("submit", function(event) {
        ///var $this = $(this);

        //  Contact Form Input Value 
        // Valor de entrada del formulario de contacto
        let $this         = $(this);
        let name          = $("#contactName").val().trim();
        let email         = $("#contactEmail").val().trim();
        let phone         = $("#contactPhone").val().trim();
        let subject       = $("#contactSubject").val().trim();
        let message       = $("#contactMessage").val().trim();
        let termsCheckBox = $("#termsCheckBox").prop("checked");
        let validateEmail = $("#contactEmail").conformyEmailValidate();
        let validatePhone = $("#contactPhone").conformyPhoneValidate();
        let selectedNull  = $('#contactSubject').find("option").eq(0).val();

        if (name =='' || email =='' || phone == '' || message == '' || textInput == '') {
            $(this).parent().find("span").addClass("error");
            if($('.empty-form').css("display") == "none"){
                $('.empty-form').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (subject == selectedNull) {
            if($('.subject-alert').css("display") == "none"){
                $('.subject-alert').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (termsCheckBox == false) {
            if($('.terms-alert').css("display") == "none"){
                $('.terms-alert').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (!validatePhone === true) {
            $("#contactPhone").parent().find("span").removeClass("success").addClass("error");
            if($('.phone-invalid').css("display") == "none"){
                $('.phone-invalid').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (!validateEmail === true) {
            $("#contactEmail").parent().find("span").removeClass("success").addClass("error");
            if($('.email-invalid').css("display") == "none"){
                $('.email-invalid').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else if (validateCaptcha() != true){
            $("#textInput").parent().find("span").removeClass("success").addClass("error");
            if($('.security-alert').css("display") == "none"){
                $('.security-alert').stop().slideDown().delay(3000).slideUp();
            }else {
                return false;
            }
        } else {
            $this.find(':submit').append('<span class="fas fa-spinner fa-pulse ms-5"></span>');
            $this.find(':submit').attr('disabled','true');
            $.ajax({
                url: "assets/send_mail.php?mail=request",
                data: {
                    contact_name: name,
                    contact_email: email,
                    contact_phone: phone,
                    contact_subject: subject,
                    contact_message: message
                },
                type: "POST",
                success: function(response) {
                    $(".form-control").parent().find("span").removeAttr("class");
                    $("#contactForm")[0].reset();
                    $(".select-selected").html(selectedNull);
                    if (response == true) {
                        $this.find(':submit').removeAttr('disabled');
                        $this.find(':submit').find("span").fadeOut();
                        $("#formSuccessModal").modal("show");
                        // Called random number function
                        // Función llamada número aleatorio
                        randomNumber();
                    } else {
                        $this.find(':submit').removeAttr('disabled');
                        $this.find(':submit').find("span").fadeOut();
                        $("#formDangerModal").modal("show");
                        $("#formDangerModal #error_message").html(response);
                        // Called random number function
                        // Función llamada número aleatorio
                        randomNumber();
                    }
                }
            });
        }
        event.preventDefault();
    });
}
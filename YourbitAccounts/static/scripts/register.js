var current_page = 0;
var current_container;

var container_function_list = [
    birthdayStage,
    emailStage,
    fnameStage,
    lnameStage,
    unameStage,
    passwordStage1,
    passwordStage2,
    termsStage,
    


];

var invisible_field_list = [
    '#id_dob',
    '#id_email',
    '#id_first_name',
    '#id_last_name',
    '#id_username',
    '#id_password1',
    '#id_password2',
    '#id_terms',
    

];

var field_list = [
    'dob-field',
    'email-field',
    'fname-field',
    'lname-field',
    'uname-field',
    'password1-field',
    'password2-field',
    'terms-field',
    'recaptcha-field',
];

const INVISIBLE_FORM = document.getElementById('invisible-form');
const FORM = document.getElementById('form');
const ERROR_BOX = document.getElementById('error-message');
$(document).ready(function () {
    let current_container = birthdayStage();
    
    FORM.appendChild(current_container);


});








//Function to display birthdate entry stage
function birthdayStage() {
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let dob_field_container = yb_createElement('div', 'dob-field-container', 'paginated-form-field-container');
    let dob_label = yb_createElement('p', 'dob-label', 'paginated-form-label');
    let dob_field = yb_createInput('date', 'field',  'dob-field');
    dob_label.innerHTML = 'Date of Birth';
    dob_field_container.appendChild(dob_label);
    dob_field_container.appendChild(dob_field);
    let line_break = document.createElement('br');
    dob_field_container.appendChild(line_break);
    

    let next_button = yb_createButton('id_dob', 'next-button', 'yb-form-next', 'Next');
    next_button.innerHTML = 'Next';
    next_button.onclick = function () {
        yb_ValidateField();
    };
    dob_field_container.appendChild(next_button);


    return dob_field_container;
}








//Function to display email entry stage
function emailStage() {
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let email_field_container = yb_createElement('div', 'email-field-container', 'paginated-form-field-container');
    let email_label = yb_createElement('p', 'email-label', 'paginated-form-label');
    let email_field = yb_createInput('email', 'field', 'email-field', "ex. 'myemail@yourbit.me'");
    email_label.innerHTML = 'Email';
    email_field_container.appendChild(email_label);
    email_field_container.appendChild(email_field);

    let next_button = yb_createButton('id_email', 'next-button', 'yb-form-next', 'Next');
    
    next_button.onclick = function () {
        yb_ValidateField();
    };

    let line_break = document.createElement('br');
    email_field_container.appendChild(line_break);

    email_field_container.appendChild(next_button);

    return email_field_container;
}

//Function to display first name entry stage
function fnameStage() {
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let fname_field_container = yb_createElement('div', 'fname-field-container', 'paginated-form-field-container');
    let fname_label = yb_createElement('p', 'fname-label', 'paginated-form-label');
    let fname_field = yb_createInput('text', 'field', 'fname-field', "ex. 'John'");
    fname_label.innerHTML = 'First Name';
    fname_field_container.appendChild(fname_label);
    fname_field_container.appendChild(fname_field);

    let line_break = document.createElement('br');
    fname_field_container.appendChild(line_break);

    let next_button = yb_createButton('id_first_name', 'next-button', 'yb-form-next', 'Next');
    
    next_button.onclick = function () {
        yb_ValidateField();
    };
    fname_field_container.appendChild(next_button);

    return fname_field_container;
};

//Function to display last name entry stage
function lnameStage() {
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let lname_field_container = yb_createElement('div', 'lname-field-container', 'paginated-form-field-container');
    let lname_label = yb_createElement('p', 'lname-label', 'paginated-form-label', "ex. 'Doe'");
    let lname_field = yb_createInput('text', 'field', 'lname-field');
    lname_label.innerHTML = 'Last Name';
    lname_field_container.appendChild(lname_label);
    lname_field_container.appendChild(lname_field);

    let next_button = yb_createButton('id_last_name', 'next-button', 'yb-form-next', 'Next');
    
    next_button.onclick = function () {
        yb_ValidateField();
    };

    let line_break = document.createElement('br');
    lname_field_container.appendChild(line_break);

    lname_field_container.appendChild(next_button);

    return lname_field_container;
}

//Function to display username entry stage
function unameStage(){
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let uname_field_container = yb_createElement('div', 'uname-field-container', 'paginated-form-field-container');
    let uname_label = yb_createElement('p', 'uname-label', 'paginated-form-label');
    let uname_field = yb_createInput('text', 'field', 'uname-field', "ex. 'johndoe'");
    uname_label.innerHTML = 'Username';
    uname_field_container.appendChild(uname_label);
    uname_field_container.appendChild(uname_field);

    let next_button = yb_createButton('id_username', 'next-button', 'yb-form-next', 'Next');
    
    next_button.onclick = function () {
        yb_ValidateField();
    };

    let line_break = document.createElement('br');
    uname_field_container.appendChild(line_break);

    uname_field_container.appendChild(next_button);

    return uname_field_container;
}

//Function to display password entry stage
function passwordStage1(){
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let password_field_container = yb_createElement('div', 'password-field-container', 'paginated-form-field-container');
    let password_label = yb_createElement('p', 'password-label', 'paginated-form-label');
    let password_field = yb_createInput('password', 'field', 'password1-field', "ex. 'password123'");
    password_label.innerHTML = 'Password';
    password_field_container.appendChild(password_label);
    password_field_container.appendChild(password_field);

    let line_break = document.createElement('br');
    password_field_container.appendChild(line_break);

    let next_button = yb_createButton('next', 'password1-next', 'yb-form-next', 'Next');
    password_field_container.appendChild(next_button);
    
    next_button.onclick = function () {
        yb_ValidateField();

    };
    

    return password_field_container;
}

//Function to display password confirmation entry stage
function passwordStage2(){
    ERROR_BOX.innerHTML = '';
    $('#password1-next').remove();
    let password_field_container = yb_createElement('div', 'password-field-container', 'paginated-form-field-container');
    let password_label = yb_createElement('p', 'password-label', 'paginated-form-label');
    let password_field = yb_createInput('password', 'field', 'password2-field', "ex. 'password123'");
    password_label.innerHTML = 'Confirm Password';
    password_field_container.appendChild(password_label);
    password_field_container.appendChild(password_field);

    let line_break = document.createElement('br');
    password_field_container.appendChild(line_break);

    let next_button = yb_createButton('next', 'password1-next', 'yb-form-next', 'Next');
    password_field_container.appendChild(next_button);
    
    next_button.onclick = function () {
        let next_stage = termsStage();
        FORM.appendChild(next_stage);
    };

    return password_field_container;
}

//Function to display terms and conditions stage
function termsStage(){
    FORM.innerHTML = '';
    ERROR_BOX.innerHTML = '';
    let base_url = window.location.origin;
    let terms_field_container = yb_createElement('div', 'terms-field-container', 'paginated-form-field-container');
    let terms_window = yb_createElement('iframe', 'terms-window', 'terms-window');
    terms_window.setAttribute('frameborder', '0');
    terms_window.setAttribute('scrolling', 'yes');
    terms_window.setAttribute('width', '98%');
    terms_window.setAttribute('height', '70%');
    terms_window.setAttribute('style', 'margin-bottom: 10px; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 20px; overflow: scroll; filter: drop-shadow(0px 0px 5px #000000); -webkit-filter: drop-shadow(0px 0px 5px #000000);')


    terms_window.setAttribute('src', `${base_url}/accounts/documents/terms/`);

    
    
    terms_field_container.appendChild(terms_window);
    

    let cancel_button = yb_createButton('cancel', 'cancel-button', 'yb-form-next', 'Decline');
    cancel_button.setAttribute('style', 'color:red;');

    let next_button = yb_createButton('next', 'next-button', 'yb-form-next', 'Accept');
    next_button.setAttribute('style', 'color:green;');
    next_button.onclick = function () {
        let this_response = INVISIBLE_FORM.submit();
        console.log(this_response);
    };
    terms_field_container.appendChild(cancel_button);
    terms_field_container.appendChild(next_button);

    return terms_field_container;
}

//Function to validate fields
function yb_ValidateField() {
    let this_field = document.getElementById(field_list[current_page]);
    console.log(field_list[current_page]);
    let base_url = window.location.origin;

    let csrfToken = getCSRF();
    
    let url = `${base_url}/accounts/api/validation/signup/`
    let field = field_list[current_page];
    
    let form_data = new FormData();
    form_data.append('field', field);
    form_data.append('value', this_field.value);

    $.ajax( {
        type: 'POST',
        contentType: false,
        processData: false,
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: form_data,
        success: function(response) {
            if (response.success === true){
                let this_invisible_field = document.querySelector(invisible_field_list[current_page]);
                this_invisible_field.value = this_field.value;
                
                current_page += 1;
                let this_function = container_function_list[current_page];
                
                let next_container = this_function();
                
                FORM.appendChild(next_container);
            } else {
                let error_message = document.getElementById('error-message');
                error_message.innerHTML = response.error;
            } 

        }
    })
    
}



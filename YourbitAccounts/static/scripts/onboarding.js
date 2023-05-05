        //List of pages to iterate through with each yb-pages-next button press
        var page_list = ['#onboard-welcome', '#profile-images', '#profile-setup', '#profile-privacy', '#profile-personalization'];
        
        //No function is first in list because there is no request submitted on the first page of onboarding
        var function_list = ['no-function','updateImages','updateInfo', 'updatePrivacy', 'updateCustom']
        
        var profile_image_loaded;

        var preview_stage = 0;

        var base_url = window.location.origin;

        $('.yb-pages-next').click(function() {
            let step = $(this).attr('data-step');
            let current_page = page_list[parseInt(step)];
            console.log("clicked")
            console.log(step);
            if (step != 0 && step != 4) {
                packageRequest(function_list[parseInt(step)])
            }
            if (step < 4) {
                console.log(current_page)
                let next_page_interval = parseInt(step) + 1;
                let next_page = page_list[next_page_interval];
                let motion = 1;
                nextPage(motion, current_page, next_page);
            }
            if (step === '4'){
                console.log("button identified");
                window.location.href = `${base_url}/profile/customize/`;
            }
        });

        $('.yb-pages-back').click(function() {
            let step = $(this).attr('data-step');
            let current_page = page_list[parseInt(step)];
            let previous_page_interval = parseInt(step) - 1;
            let previous_page = page_list[previous_page_interval];
            let motion = 0;
            nextPage(motion, current_page, previous_page);
        });

        $('#toggle-colors').change(function() {
            $('#color-customizations').show();
            $('#color-customizations').animate({'height': '35vh'}, 'slow');
        });
        
        function nextPage(motion, current_page, next_page) {
            
            $(next_page).show();
            if (motion === 0) {
                $(current_page).animate({'left': '100vw'});
                $(next_page).animate({'left':'0vw'});

            }
            if (motion === 1) {
                $(current_page).animate({'left':'-100vw'});
                $(next_page).animate({'left': '0vw'});
            }
            $(current_page).hide();
        }

        const primary_color_field = document.getElementById('primary-color-select')
        primary_color_field.addEventListener("change", function() {
            let bit_background = document.getElementById('bit-colors-preview');
            bit_background.style.backgroundColor = this.value;
        });

        const accent_color_field = document.getElementById('accent-color-select')
        accent_color_field.addEventListener("change", function() {
            let border1 = document.getElementById('profile-image-preview-image2');
            let border2 = document.getElementById('bit-profile-image');
            border1.style.borderColor = this.value;
            border2.style.borderColor = this.value;
        });

        const feedback_icon_field = document.getElementById('feedback-icon-color-select');
        feedback_icon_field.addEventListener('change', function() {
            let feedback_preview1 = document.getElementById('button1').style.backgroundColor = this.value;
            let feedback_preview2 = document.getElementById('button2').style.backgroundColor = this.value;
            let feedback_preview3 = document.getElementById('button3').style.backgroundColor = this.value;
            let feedback_preview4 = document.getElementById('button4').style.backgroundColor = this.value;
            let feedback_preview5 = document.getElementById('button5').style.backgroundColor = this.value;
            
        });

        
        const icon_field = document.getElementById('icon-color-select');
        icon_field.addEventListener('change', function() {
            let space_icon1 = document.getElementById('icon-image-1').style.fill = this.value;
            let space_icon2 = document.getElementById('icon-image-2').style.fill = this.value;
            let space_icon3 = document.getElementById('icon-image-3').style.fill = this.value;
            let space_icon4 = document.getElementById('icon-image-4').style.fill = this.value;
            let space_icon5 = document.getElementById('icon-image-5').style.fill = this.value;
            let space_icon6 = document.getElementById('icon-image-6').style.fill = this.value;
            let space_icon7 = document.getElementById('icon-image-7').style.fill = this.value;
            let space_icon8 = document.getElementById('icon-image-8').style.fill = this.value;
            
        });

        const text_color_field = document.getElementById('pfont-color-select');
        text_color_field.addEventListener('change', function() {
            let text_color_preview = document.getElementById('preview-paragraph');
            text_color_preview.style.color = this.value;
        });

        const title_color_field = document.getElementById('tfont-color-select');
        title_color_field.addEventListener('change', function() {
            let title_color_preview = document.getElementById('preview-title');
            title_color_preview.style.color = this.value;
        });

        accent_color_field.addEventListener('click', function() {
            if (preview_stage === 1) {
                $('#bit-colors-preview').fadeOut();
                $('#accent-color-preview').fadeIn();
            }
            if (preview_stage === 2) {
                $('#icon-color-preview').fadeOut();
                $('#accent-color-preview').fadeIn();
            }

            preview_stage = 0
        });

        icon_field.addEventListener('click', function() {
            if (preview_stage === 0) {
                $('#accent-color-preview').fadeOut();
                $('#icon-color-preview').fadeIn();
            }
            if (preview_stage === 1) {
                $('#bit-colors-preview').fadeOut();
                $('#icon-color-preview').fadeIn();
            }
            preview_stage = 2
        });

        title_color_field.addEventListener('click', function() {
            if (preview_stage === 0) {
                $('#accent-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            if (preview_stage === 2) {
                $('#icon-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            preview_stage = 1
        });

        text_color_field.addEventListener('click', function() {
            if (preview_stage === 0) {
                $('#accent-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            if (preview_stage === 2) {
                $('#icon-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            preview_stage = 1
        });

        feedback_icon_field.addEventListener('click', function() {
            if (preview_stage === 0) {
                $('#accent-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            if (preview_stage === 2) {
                $('#icon-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            preview_stage = 1
        });
        primary_color_field.addEventListener('click', function() {
            if (preview_stage === 0) {
                $('#accent-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            if (preview_stage === 2) {
                $('#icon-color-preview').fadeOut();
                $('#bit-colors-preview').fadeIn();
            }
            preview_stage = 1
        });




        
        function packageRequest(form_request) {
            let request = new FormData();
            let page;
            console.log(form_request)
            if (form_request === 'updateInfo') {
                let gender = $('#gender-field').val();
                console.log(gender)
                let bio = $('#bio-field').val();
                let motto = $('#motto-field').val();
                console.log("update_info")
                page=1;
                console.log(page)
                request.append('page', page);
                request.append('motto', motto);
                request.append('gender', gender);
                request.append('bio', bio);
                console.log(request)
            } 
            if (form_request === 'updatePrivacy') {
                let name_visibility = $('#name-check').val();
                let message_availability = $('#message-check').val();
                let publicity = $('#public-check').val();
                let search_visibility = $('#visibility-check').val();
                if (search_visibility === 'on') {
                    search_visibility = true;
                } else {
                    search_visibility = false;
                }
                let followers_enabled = $('#toggle-followers').val();
                if (followers_enabled === 'on') {
                    followers_enabled = true;
                } else {
                    followers_enabled = false;
                }
                page=2;
                request.append('page', page);
                request.append('name_visibility', name_visibility);
                request.append('message_availability', message_availability);
                console.log(message_availability)
                request.append('publicity', publicity);
                request.append('search_visibility', search_visibility)
                request.append('followers_enabled', followers_enabled)
            }
            if (form_request === 'updateCustom') {
                console.log("Redirecting...")

                
            }
            console.log(page)
            yb_sendRequest(request, page)
            
        }

        function yb_sendRequest(request, page) {
            console.log(page)
            let cookie = document.cookie;
            let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
            
            $.ajax(
                {
                    type: 'POST',
                    contentType: false,
                    // The following is necessary so jQuery won't try to convert the object into a string
                    processData: false,
                    headers: {

                        'X-CSRFToken': csrfToken,
                    },
                    url: '/onboarding/',
                    data: request,
        
                    success: function(response) {
                        console.log('Successfully Updated Information')
                        if (page === 3) {
                            window.location.href = `${base_url}/profile/customize/`;
                        }
                    }

                }
            )

        }


    
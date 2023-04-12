
    if (button_name === "like"){
        $.ajax(
        {
            type:"POST",
            headers: {
                'X-CSRFToken': csrfToken
              },
            url: "/bitstream/like/",
            data: {
                bit_id: catid 
            },
            success: function(data){
                let json_file = data;

                console.log(json_file.icon_color);
                if (json_file.action === 'like') {
                    let like_count = json_file.like_count
                    let dislike_count = json_file.dislike_count

                    dislike_count = dislike_count.toString();
                    like_count = like_count.toString();
                    $('#like' + catid).css("background-color", json_file.accent_color);
                    $('#like-icon-'+catid).css("fill", json_file.icon_color);
                    $('#dislike' + catid).css("background-color", "rgba(0,0,0,0)");
                    $('#active-dislike-icon-' + catid).css("fill", "white");
                    $('#dislike-icon-' + catid).css("fill", "white");
                    $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                    $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                    let to_user = json_file.to_user;
                    let from_user = json_file.from_user;
                    let type = 1;
                    parent.Notify(type, from_user, to_user);
                } else {
                    let like_count = json_file.like_count
                    let dislike_count = json_file.dislike_count

                    dislike_count = dislike_count.toString();
                    like_count = like_count.toString();
                    $('#like' + catid).css("background-color", "rgba(0,0,0,0)");
                    $('#active-like-icon-' + catid).css("fill", "white");
                    $('#like-icon' + catid).css("fill", "white");
                    $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                    $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);                   
                }

            }


        });
    }

    if (button_name === "dislike"){
        $.ajax(
            {
                type:"POST",
                headers: {
                    'X-CSRFToken': csrfToken
                  },
                url: "/bitstream/dislike/",
                data: {
                    bit_id: catid
                },
                success: function(data){
                    let json_file = data;
                    if (json_file.action === 'dislike') {
                        let like_count = json_file.like_count
                        let dislike_count = json_file.dislike_count
                        dislike_count = dislike_count.toString();
                        like_count = like_count.toString();
                        $('#dislike' + catid).css("background-color", json_file.accent_color);
                        $('#dislike-icon-'+catid).css("fill", json_file.icon_color);
                        $('#like' + catid).css("background-color", "rgba(0,0,0,0)");
                        $('#active-like-icon-' + catid).css("fill", "white");
                        $('#like-icon-' + catid).css("fill", "white");
                        $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                        $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);  
                    } else {
                        let like_count = json_file.like_count
                        let dislike_count = json_file.dislike_count
                        dislike_count = dislike_count.toString();
                        like_count = like_count.toString();
                        $('#dislike' + catid).css("background-color", "rgba(0,0,0,0)"); 
                        $('#dislike-icon-' + catid).css("fill", "white");
                        $('#like-count' + catid).replaceWith(`<p id="like-count${catid}" class="counter" style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">${like_count}</p>`);
                        $('#dislike-count' + catid).replaceWith(`<p id="dislike-count${catid}" class="counter" style="grid-column: 4; color: lightgreen; margin-top: auto; margin-bottom: auto;">${dislike_count}</p>`);
                        $('#active-dislike-icon-' + catid).css("fill", "white");                            
                    }
                }

            }
        )
    }

from django.utils import timezone

#               feed/builders.py
#               11/11/2022
#               Yourbit, LLC

#Description: Stores functions for constructing and managing HTML snippets


#Functions for assembling snippets, information must be passed as a list
#This build bit function returns an html output


##############################
#                            #
#---------Bit Builder--------#
#                            #
##############################
def BuildBit(bit_elements):

#Information
    information = bit_elements.get('information') #Gets the bit information dictionary
    
    #Bit information
    bit_id = information.get('bit_id') #Gets bit ID
    time = information.get('time') #Gets time for bit
    position = information.get('position') #Gets position in feed
    bit_type = information.get('bit_type') #Gets the bit tpe

    #User information
    profile_image = information.get('profile_image') #Gets profile image
    name = information.get('name') #Gets users name
    username = information.get('username') #Gets users username

#Text Content
    text_content = bit_elements.get('bit_text') #Gets the bit_text dictionary
    
    #Check if there is title
    has_title = text_content.get('is_title')
    if has_title:
        title = text_content.get('title') #Gets the bit title
        is_title = 'block'
    else: 
        is_title = 'none'
        title = None
    body = text_content.get('body') #Gets the bit body

#Bit Video
    if bit_type == 'video':
        bit_video = bit_elements.get('bit_video') #Gets the video dictionary
        video_thumbnail = bit_video.get('video_thumbnail') #Gets video thumnail to attach until bit is on screen
        video = bit_video.get('video') #Gets the video associated with this video bit

#Bit Photo

    if bit_type == 'photo':
        photos = []
        bit_photos = bit_elements.get('bit_photos')
        
        for photo in bit_photos:
            photos.append(photo)

#Interactions
    interaction_data = bit_elements.get('interaction_data')
    
    is_liked = interaction_data.get("is_liked")

    is_disliked = interaction_data.get('is_disliked')
    
    like_count = interaction_data.get('like_count')

    dislike_count = interaction_data.get('dislike_count')
    
    comment_count = interaction_data.get('comment_count')

#Customizations
    customization_data = bit_elements.get('customization_data')

    title_color = customization_data.get('title_color')

    text_color = customization_data.get('text_color')

    accent_color = customization_data.get('accent_color')

    feedback_icon_color = customization_data.get('feedback_icon_color')

    background_color = customization_data.get("background_color")

    paragraph_align = customization_data.get("paragraph_align")

#Extensions
    if bit_type == 'video_link':
        extend_widget = bit_elements.get("extend_widget")

    
    #Build and append chatbits
    if bit_type == 'chat':

        #Contains profile image and user information
        bit_header = f"""
            <div class="post-wrapper" data-type="{bit_type}" data-background = "{background_color}" data-position="{position}" id = "chat-post-wrapper" style="background-color: {background_color} ">
                <div id="chat-bit-name-date">
                    <div class="chat-bit-profile-picture-link" data-username = "{username}"><img style="border-color: {accent_color}" class="chat-bit-profile-picture" src="{profile_image}"></div>
                    <p id="chat-bit-user-info"><strong id="chat-user-name" style="color:{title_color};">{name}</strong> <small style="color:{text_color};">@{username}</small> </p>
                    <p id="chat-bit-time-label" style="color:white;">{time: %B %d, %Y}<br><small>@{time:%I:%M %p}</small></p>
                </div>"""

        #Title for a bit
        bit_title = f"""
            <div id="chat-bit-title" style="display:{is_title};">
                    <hr>
                        <h3 style="color:{title_color};">
                            {title}
                        </h3>
                    <hr>
                </div>
        """
        bit_body = f"""
            <div id="chat-bit-display-description" style="color:{text_color}; text-align:{paragraph_align}">
                    <p>{body}</p>
                </div>
        """
        bit_interactions = f"""
            <div id="feed-bit-comment-container"></div>
            <span class="post-background-link" ></span>
            <form method='POST' id="chat-bit-feedback-container" class = "post-interaction-container">

                <button type="button" class="feedback-icon" name = "like" id="like{bit_id}" data-catid="{bit_id}" style="background-color: {is_liked};"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg></button>

                <!--Like Counter on Chats-->
                <p id="like-count{bit_id}" class="counter"  style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">{ like_count }</p>

                <button type="button" class="feedback-icon" name = "dislike" id="dislike{bit_id}" data-catid="{bit_id}" style="background-color: {is_disliked};">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="dislike-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                        </svg>
                    </button>

                <p id="dislike-count{bit_id}" class="counter" style="grid-column: 4; color: lightred; margin-top: auto; margin-bottom: auto;">{ dislike_count }</p>
                
                <button type="button" class="feedback-icon" name = "share" id="share-post-button" href="#" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg></button>
                
                <p id="share-count" class="counter">0</p>
                
                <button type="button" class="feedback-icon" name = "show_comment" id="comment-post-button" href="#" data-catid="{bit_id}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>
                
                <p id="comment-count{bit_id}" class="counter">{ comment_count }</p>
                
                <button type = "button" class="feedback-icon" name = "donate" id="donate-post-button" href="#" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg></button>
            </form>
        """
        bit_comments = f"""
            <div id="field-write-comment">
                    
                <input type="text" placeholder="Write Comment" id="field-write-comment{bit_id}" class="write-comment-field-text">
                
                <a id="write-comment-button" data-catid="{bit_id}" class="send-comment" name="send_comment" style="background-color: rgba(255, 255, 255, 0.5)"><svg fill="{text_color}" style="display: block; margin: auto; position: relative;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg></a>
            </div>
            <p class = "comments-display-label" id="comments-display-label{bit_id}" style="display:none;"><b>Comments:</b></p>
            <div class = "chat-comment-display-container" id="chat-comment-display-container{bit_id}" style="display: none;">
                
            </div>
        </div>
        """
        new_bit = bit_header + bit_title + bit_body + bit_interactions + bit_comments
        
    
    if bit_type == 'photo':
        #Placeholder
        print('photobit')
        #Html for photobit
        
        #Contains user information and profile picture
        bit_header = f"""
            <div class="post-wrapper" data-position="{position}" id = "photo-post-wrapper" data-background = "{background_color}" style="background-color:{background_color}">
                <div id="photo-user-name">
                    <a class="chat-bit-profile-picture-link" data-username = "{username}"><img class="chat-bit-profile-picture" src="{profile_image}" style="border-color: {accent_color}"></a>
                    <p id="photo-user-name-text" style="color: {title_color}"><strong>{name}</strong> <small style="color:{text_color}">@{username}</small></p>
                </div>
        """
        bit_image = ''
        
        for photo in photos:
            bit_image+=(f"""
                <img src="{ photo }" id="photobit" class='attached-photo'/>
            """)

        bit_info = f"""
            <div id="photo-info" style="text-align:center;">
                <h4 id="photo-caption" style="color:{title_color}"> {title}</h4>
                <p id="photo-description" style="padding-top: 10px; padding-bottom: 10px; color:{text_color}"> {body}</p>
            </div>       
        """

        bit_interactions = f"""
            <div id="feed-bit-comment-container"></div>
            <span class="post-background-link" ></span>
            <form method='POST' id="chat-bit-feedback-container" class = "post-interaction-container">

                <button type="button" class="feedback-icon" name = "like" id="like{bit_id}" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg></button>

                <!--Like Counter on Chats-->
                <p id="like-count{bit_id}" class="counter"  style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">{ like_count }</p>

                <button type="button" class="feedback-icon" name = "dislike" id="dislike{bit_id}" data-catid="{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="dislike-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                        </svg>
                    </button>

                <p id="dislike-count{bit_id}" class="counter" style="grid-column: 4; color: lightred; margin-top: auto; margin-bottom: auto;">{ dislike_count }</p>
                
                <button type="button" class="feedback-icon" name = "share" id="share-post-button" href="#" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg></button>
                
                <p id="share-count" class="counter">0</p>
                
                <button type="button" class="feedback-icon" name = "show_comment" id="comment-post-button" href="#" data-catid="{bit_id}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>
                
                <p id="comment-count{bit_id}" class="counter">{ comment_count }</p>
                
                <button type = "button" class="feedback-icon" name = "donate" id="donate-post-button" href="#" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/></svg></button>
            </form>
        """
        bit_comments = f"""
            <div method="POST" id="field-write-comment" style="grid-row: 5;">
                    
                    <input type="text" placeholder="Write Comment" id="field-write-comment{bit_id}" class="write-comment-field-text">
                    <a id="write-comment-button" data-catid="{bit_id}" class="send-comment" name="send_comment" style="background-color: rgba(255, 255, 255, 0.5)"><svg fill="{text_color}" style="display: block; margin: auto; position: relative;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg></a>
                </div>
                <p class = "comments-display-label" id="comments-display-label{bit_id}" style="display:none; grid-row: 6;"><b>Comments:</b></p>
                <div class = "chat-comment-display-container" id="chat-comment-display-container{bit_id}" style="display: none; grid-row:7;">

                </div>
            </div>
        
        """
        #concatenate all above
        new_bit = bit_header + bit_image + bit_info + bit_interactions + bit_comments


    if bit_type == 'video':
        #Placeholder
        print('videobit')
        #Html for videobit
        #header
        bit_header=f"""
            <div class="post-wrapper" id = "video-post-wrapper" style="background-color:{ background_color }">
        """
        bit_video=f"""
            <video src="{ video }" width="100%" id="videobit" playsinline controls></video>              
        """
        #info

        bit_info=f"""
        <h3 id="video-title"> {title}</h3>
            <p onclick="ShowDescription('video-description{bit_id}')" id="video-show-description-button">Show Description</p>
            <p class="video-caption" id="video-description{bit_id}" style = "display: none;"> {body}</p>


        """

        #interactions
        bit_interactions = f"""

            <form method='POST' id="chat-bit-feedback-container" class = "post-interaction-container">
            
                <button type="button" class="feedback-icon-active" style="background-color: {accent_color};" data-catid="{bit_id}" name = "like" id="like{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="active-like-icon-{bit_id}" style="fill:{feedback_icon_color}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                    </svg>
                </button>
            
                <button type="button" class="feedback-icon" name = "like" id="like{bit_id}" data-catid="{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="like-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                    </svg>
                </button>
            
                <!--Like Counter on Chats-->
                <p id="like-count{bit_id}" class="counter"  style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">{ like_count }</p>
                
                
                    <button type="button" style="background-color: {accent_color};" data-catid="{bit_id}" class="feedback-icon-active" name = "dislike" id="dislike{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="active-dislike-icon-{bit_id}" style="fill:{feedback_icon_color};" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                        </svg>
                    </button>
                
                    <button type="button" class="feedback-icon" name = "dislike" id="dislike{bit_id}" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg></button>
                
                <p id="dislike-count{bit_id}" class="counter" style="grid-column: 4; color: lightred; margin-top: auto; margin-bottom: auto;">{ dislike_count }</p>
                <button type="button" class="feedback-icon" name = "share" id="share-post-button" href="#" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg></button>
                <p id="share-count" class="counter">0</p>
                <button type="button" class="feedback-icon" name = "show_comment" id="comment-post-button" href="#" data-catid="{bit_id}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>
                <p id="comment-count{bit_id}" class="counter">{ comment_count }</p>
                <button type = "button" class="feedback-icon" name = "donate" id="donate-post-button" href="#" data-catid="{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/>
                    </svg>
                </button>
            </form>
        
        """

        #comments
        bit_comments = f"""
            <div method="POST" id="field-write-comment" style="grid-row: 5;">
                    
                    <input type="text" placeholder="Write Comment" id="field-write-comment{bit_id}" class="write-comment-field-text">
                    <a id="write-comment-button" data-catid="{bit_id}" class="send-comment" name="send_comment" style="background-color: rgba(255, 255, 255, 0.5)"><svg fill="{text_color}" style="display: block; margin: auto; position: relative;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg></a>
                </div>
                <p class = "comments-display-label" id="comments-display-label{bit_id}" style="display:none; grid-row: 6;"><b>Comments:</b></p>
                <div class = "chat-comment-display-container" id="chat-comment-display-container{bit_id}" style="display: none; grid-row:7;">

                </div>
            </div>
        
        """
        #concatenate all above
        new_bit = bit_header + bit_video + bit_info + bit_interactions + bit_comments
        
        


    if bit_type == 'video_link':
        #placeholder
        print('VideoBit(external)')
        #html for videobit
        #header
        bit_header = f"""
            <div class="post-wrapper" id = "chat-post-wrapper" data-position = "{position}" data-background = "{background_color}" style="background-color:{background_color};">
                <div id="chat-bit-name-date">
                    <div class="chat-bit-profile-picture-link" data-username = "{username}"><img style="border-color: {accent_color}" class="chat-bit-profile-picture" src="{profile_image}"></div>
                    <p id="chat-bit-user-info"><strong id="chat-user-name" style="color:{title_color};">{name}</strong> <small style="color:{text_color};">@{username}</small> </p>
                    <p id="chat-bit-time-label"><small>{ time }</small></p>
                </div>
                <span class="post-background-link" href=""></span>

        """
        #info

        #body
        bit_body = f"""
            <div id="chat-bit-title"><hr><h3 style="color:{title_color}; display:{is_title}">{ title }<h3><hr></div>
                <div id="chat-bit-display-description" style="color:{text_color}; max-height: 300px;"><p>{body}<br>{extend_widget}</p>
            </div>
        """

        #interactions
        bit_interactions = f"""
            <form method='POST' id="chat-bit-feedback-container" class = "post-interaction-container">
            
                <button type="button" class="feedback-icon-active" style="background-color: {accent_color};" data-catid="{bit_id}" name = "like" id="like{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="active-like-icon-{bit_id}" style="fill:{feedback_icon_color}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                    </svg>
                </button>
            
                <button type="button" class="feedback-icon" name = "like" id="like{bit_id}" data-catid="{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="like-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                    </svg>
                </button>
            
                <!--Like Counter on Chats-->
                <p id="like-count{bit_id}" class="counter"  style="grid-column: 2; color: lightgreen; margin-top: auto; margin-bottom: auto;">{ like_count }</p>
                
                
                    <button type="button" style="background-color: {accent_color};" data-catid="{bit_id}" class="feedback-icon-active" name = "dislike" id="dislike{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path id="active-dislike-icon-{bit_id}" style="fill:{feedback_icon_color};" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                        </svg>
                    </button>
                
                    <button type="button" class="feedback-icon" name = "dislike" id="dislike{bit_id}" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg></button>
                
                <p id="dislike-count{bit_id}" class="counter" style="grid-column: 4; color: lightred; margin-top: auto; margin-bottom: auto;">{ dislike_count }</p>
                <button type="button" class="feedback-icon" name = "share" id="share-post-button" href="#" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 23Q5.175 23 4.588 22.413Q4 21.825 4 21V10Q4 9.175 4.588 8.587Q5.175 8 6 8H9V10H6Q6 10 6 10Q6 10 6 10V21Q6 21 6 21Q6 21 6 21H18Q18 21 18 21Q18 21 18 21V10Q18 10 18 10Q18 10 18 10H15V8H18Q18.825 8 19.413 8.587Q20 9.175 20 10V21Q20 21.825 19.413 22.413Q18.825 23 18 23ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16Z"/></svg></button>
                <p id="share-count" class="counter">0</p>
                <button type="button" class="feedback-icon" name = "show_comment" id="comment-post-button" href="#" data-catid="{bit_id}" ><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14H18V12H6ZM6 11H18V9H6ZM6 8H18V6H6ZM22 22 18 18H4Q3.175 18 2.588 17.413Q2 16.825 2 16V4Q2 3.175 2.588 2.587Q3.175 2 4 2H20Q20.825 2 21.413 2.587Q22 3.175 22 4ZM4 4V16Q4 16 4 16Q4 16 4 16H18.825L20 17.175V4Q20 4 20 4Q20 4 20 4H4Q4 4 4 4Q4 4 4 4ZM4 4V17.175V16Q4 16 4 16Q4 16 4 16V4Q4 4 4 4Q4 4 4 4Q4 4 4 4Q4 4 4 4Z"/></svg></button>
                <p id="comment-count{bit_id}" class="counter">{ comment_count }</p>
                <button type = "button" class="feedback-icon" name = "donate" id="donate-post-button" href="#" data-catid="{bit_id}">
                    <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M11.025 21V18.85Q9.7 18.55 8.738 17.7Q7.775 16.85 7.325 15.3L9.175 14.55Q9.55 15.75 10.288 16.375Q11.025 17 12.225 17Q13.25 17 13.963 16.538Q14.675 16.075 14.675 15.1Q14.675 14.225 14.125 13.712Q13.575 13.2 11.575 12.55Q9.425 11.875 8.625 10.938Q7.825 10 7.825 8.65Q7.825 7.025 8.875 6.125Q9.925 5.225 11.025 5.1V3H13.025V5.1Q14.275 5.3 15.088 6.012Q15.9 6.725 16.275 7.75L14.425 8.55Q14.125 7.75 13.575 7.35Q13.025 6.95 12.075 6.95Q10.975 6.95 10.4 7.438Q9.825 7.925 9.825 8.65Q9.825 9.475 10.575 9.95Q11.325 10.425 13.175 10.95Q14.9 11.45 15.788 12.537Q16.675 13.625 16.675 15.05Q16.675 16.825 15.625 17.75Q14.575 18.675 13.025 18.9V21Z"/>
                    </svg>
                </button>
            </form>
        """
        #comments
        bit_comments = f"""
                <div method="POST" id="field-write-comment" style="grid-row: 5;">
                    
                    <input type="text" placeholder="Write Comment" id="field-write-comment{bit_id}" class="write-comment-field-text">
                    <a id="write-comment-button" data-catid="{bit_id}" class="send-comment" name="send_comment" style="background-color: rgba(255, 255, 255, 0.5)"><svg fill="{text_color}" style="display: block; margin: auto; position: relative;" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19.05 7.975 18.25Q7.725 17.525 7.513 16.775Q7.3 16.025 7.175 15.275L6 16.075Q6 16.075 6 16.075Q6 16.075 6 16.075ZM10 18H14Q14.45 17 14.725 15.562Q15 14.125 15 12.625Q15 10.15 14.175 7.937Q13.35 5.725 12 4.525Q10.65 5.725 9.825 7.937Q9 10.15 9 12.625Q9 14.125 9.275 15.562Q9.55 17 10 18ZM12 13Q11.175 13 10.588 12.412Q10 11.825 10 11Q10 10.175 10.588 9.587Q11.175 9 12 9Q12.825 9 13.413 9.587Q14 10.175 14 11Q14 11.825 13.413 12.412Q12.825 13 12 13ZM18 19.05V16.075Q18 16.075 18 16.075Q18 16.075 18 16.075L16.825 15.275Q16.7 16.025 16.488 16.775Q16.275 17.525 16.025 18.25ZM12 1.975Q14.475 3.775 15.738 6.55Q17 9.325 17 13Q17 13 17 13Q17 13 17 13L19.1 14.4Q19.525 14.675 19.763 15.125Q20 15.575 20 16.075V22L15.025 20H8.975L4 22V16.075Q4 15.575 4.238 15.125Q4.475 14.675 4.9 14.4L7 13Q7 13 7 13Q7 13 7 13Q7 9.325 8.262 6.55Q9.525 3.775 12 1.975Z"/></svg></a>
                </div>
                <p class = "comments-display-label" id="comments-display-label{bit_id}" style="display:none; grid-row: 6;"><b>Comments:</b></p>
                <div class = "chat-comment-display-container" id="chat-comment-display-container{bit_id}" style="display: none; grid-row:7;">

                </div>
            </div>
        
        """
        
        #concatenate all above
        new_bit = bit_header + bit_body + bit_interactions + bit_comments
    

    

    return new_bit

###################################
#                                 #
#---------ListItem Builder--------#
#                                 #
###################################               

def BuildListItem(connection_data):
    item_keys = connection_data.get('keys')
    items = connection_data.get('connections')

    context = connection_data.get('context')
    
    connection_list = ''

    for key in item_keys:

        item = items.get(key)

        background_color = item.get('background_color')

        image = item.get('image')

        name = item.get('name')

        handle = item.get('handle')

        link = item.get('link')

        html_item = f"""

`        <div class='full-result' style="background-color: {background_color}">
            <div class = 'full-result-image-container'>
                <img class='full-result-image' src="{image}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>{name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@{handle}</small>
                </p>
            
            </div>
            <a class='profile-search-link' href="{link}"></a>

        </div>`
        
        """
        connection_list += item

    return connection_list

def BitResult():
    background_color = ''
    search_list = ''

    html_item = f"""

    <div class='full-result' style="background-color: {background_color}">
        <div class = 'full-result-image-container'>
            <img class='full-result-image' src="{image}">
        </div>
        <div class='full-result-name-container'>
        
        </div>
        <a class='profile-search-link' href=""></a>

    </div>
    
    """

    return search_list

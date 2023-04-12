import random

#Dialog processors improve the Yourbit experience by providing more random and life like UI prompts
this_object = ''
this_user = ''
that_user = ''

random_delete_response = [
    f"{this_object} has been obliterated.", 
    f"{this_object} was successfully vaporized.", 
    f"{this_object} was shredded from existence.", 
    f"{this_object} banished to the void.",
    f"{this_object} deleted successfully!",
    f"{this_object} is in the trash.",
    f"{this_object} is out of here!",
    f"{this_object} is lost to mankind.",
    f"{this_object} is gone from yourbit.",
    f"{this_object} has been deorbited.",
    f"{this_object} has been neutralized.",
    f"{this_object} deleted, that was a close one right?",
    
    ]

random_like_notification = [
    f"{that_user} liked that.",
    f"{that_user} approves.",
    f"{that_user} aggrees"
    f"Your bit has met {that_user}'s standards of satisfaction",
    
]

random_comment_notification = [
    f"{that_user} had something to say about your recent bit.",
    f"{that_user} commented on your bit.",
    f"Looks like you sparked some conversation, {that_user} has provided input."
]
random_publish_response = [
    "Bit Submitted.",
    "Off it goes.",
    "Deep words, man.",
    "Now you've said what you need to say, what's next?",
    "Congratulations. Your words now reverberate through the vast and infinite intricaces of the cyber-cosmos.",
    "I totally felt that.",
    "This could be your next big thing.",
    "That... That gave me a whole new perspective on life. And I'm not even alive.",
    '"And then," said the user, "and then I went outside..." The end',
    "I truly believe in this one.",
    "Story of my life lol.",

]

random_create_bit_phrases = [
    "What's up",
    "Got something to say?",
    "How's it going today?",
    "Tell the world what's on your mind today.",
    f"You know what the world needs? An inspiring philosopher like yourself, {this_user}. What say you?",
    "What's on your mind",
    f"Hello, Internet. My name is {this_user} this is what I have to say!",
    "Make your voice heard",
    "Let it out.",
    "Awaiting transmission...",
    "Insert 2 cents here. \n\n(That was a figure of speech, it's free to create a bit)",
    "Just a PSA, this is not the search bar.",
    "Another PSA, THIS IS NOT A MESSAGE!",
    "And the question of the day is... \n\n I got nothin'",
    "Did you learn anything at work today?",
    "The internet is here if you need to talk-- well sometimes.",
]

#General, all day, randomizer chooses between timed and general
random_welcome_phrases_general = [
    f"Glad to see you back. A day without {this_user} is a day without sunshine!",
    "Welcome to cyberspace. It's up to you, which of the infinite paths you take, which lie before you.",
    "If you haven't yet, check up on your Privacy Settings and ensure they're up to your code.",
    "What joys await beyond this screen!",
    f"Welcome back, {this_user}!",
]

#Morning 4am-11am
random_welcome_phrases_morning = [
    "Well good morning, sunshine! Welcome to Yourbit.",
    "Look at you early bird! (This isn't twitter by the way)",
    "Rise and Shine! Time to get online!",
    f"{this_user}! Has anyone told you, you look stunning in the mornings, share a picture with your friends!",
    "Shouldn't you be getting ready for work? \n\n I'm just pushing your buttons. Push mine!",
]
 #Noon/Afternoon 11am-4pm
random_welcome_phrases_noon = [
    "Exploring the depths of CyberSpace during lunch are we?",


]

#Late night 12am-4am
random_welcome_phrases_late = [
    "Can't sleep, eh. Well, we're here 24 hours a day. But I'd reccomend some good rest from time to time",
    "Eliminate the blue light, make sure your filter is on at night",
    "Day's just getting started, technically, am I right?",
    "Good morning to the early birds, and good night to the night owls!",
    "I can read your mind, you're in bed, can't sleep, looking for something to doze off to. \n\n (...and adjusting feed algorithms)",
    "Welcome to Yourbit, you look tired, arranging videos of counting sheep.",
    "Welcome to Yourbit! My day ends at 4am as well--3:59:59.99. Then right back at it at 4am!",

]

no_bits_found = [
    "Well, this is embarassing, I couldn't find any bits.",
    "Looks empty to me.",
    "Where did everybody go?",
    "And in 3, 2... eh... I got nothing.",
    "So, uh, funny story. I couldn't find any bits.",
    "No bits found for applied filters",
    "This is awkward, try changing some filters and see what happens",
    "There ain't nothing here bro.",
    "NOTHING TO SEE HERE!",
    "I could be mistaken, but I couldn't find any bits. Try adjusting filter params.",
        
]

no_friends_found = [
    "Ah, yes, I see right here it says you have no friends. You should search for some. (Bottom Right)",
    "Either you're queries need calibration, or you need some friends in your life. Lets add some.",


]

def getDialogue(action, this_object, this_user, that_user):
    if action == 'delete':
        this_selection = random.randrange(0, len(random_delete_response)+1)
        this_dialogue = random_delete_response[this_selection]

    if action == 'create-bit':
        this_selection = random.randrange(0, len(random_create_bit_phrases)+1)
        this_dialogue = random_create_bit_phrases[this_selection]

    if action == 'login':
        this_selection = random.randrange(0, len(random_welcome_phrases_general))
        this_dialogue = random_welcome_phrases_general[this_selection]

    if action == 'no_friends':
        this_selection = random.randrange(0, len(no_friends_found))
        this_dialogue = no_friends_found[this_selection]

    return this_dialogue
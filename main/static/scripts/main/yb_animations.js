function yb_animationSequencer(duration, element_set, delay, animation_name){
    //This function is used to animate a set of elements in sequence. The animation is applied to each element in the set with a delay between each animation.
    //The function takes the following parameters:
    //duration: The duration of the animation in milliseconds.
    //element_set: A list of elements to be animated.
    //delay: The delay between each animation in milliseconds.
    //animation_name: The name of the animation to be applied.

    let index = 0;
    let total_elements = element_set.length;

    function animateNext() {
        if (index < total_elements) {
            element_set[index].classList.add(animation_name);
            index++;
            setTimeout(animateNext, delay);
        }
    }

    setTimeout(animateNext, duration);
}

function yb_classSequencer(duration, element_set, delay, class_name){
    //This function is used to add a class to a set of elements in sequence. The class is added to each element in the set with a delay between each addition.
    //The function takes the following parameters:
    //duration: The duration of the animation in milliseconds.
    //element_set: A list of elements to be animated.
    //delay: The delay between each animation in milliseconds.
    //class_name: The name of the class to be applied.

    let index = 0;
    let total_elements = element_set.length;

    function addClassNext() {
        if (index < total_elements) {
            element_set[index].classList.add(class_name);
            index++;
            setTimeout(addClassNext, delay);
        }

        //Set timeout to remove class when animation is done
        if (index >= total_elements) {
            setTimeout(function() {
                for (let i = 0; i < total_elements; i++) {
                    element_set[i].classList.remove(class_name);
                }
            }, duration);
        }
    }

    setTimeout(addClassNext, duration);
}
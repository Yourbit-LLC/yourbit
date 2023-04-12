function createCommunity(callback) {
    let new_community = new FormData();
    let community_name = document.getElementById('mobile-community-name');
    let community_handle = document.getElementById('mobile-community-handle');
    new_community.append('name', community_name);
    new_community.append('handle', community_handle);
    callback(new_community);

}

function initializeCommunity(new_community) {
    let html = requestPostHtml(new_community, '/community/create/')
    $('#content-container').html(html);
    
}
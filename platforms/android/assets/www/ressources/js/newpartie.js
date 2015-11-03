$(document).ready(function(){
    $('.loader').slideDown(200);

    var val = {
        'token': localStorage.getItem('token')
    };

    $.ajax({
        url: adresseAjax + 'connect/friends',
        type: 'POST',
        data: val,
        success: function (json, statut) { // success est toujours en place, bien sûr !
            $('.loader').slideUp(200);
            console.log(json);
            if(json.friend.length > 0) {
                for (var i = 0; i < json.friend.length; i++) {

                    var friend = '<li class="collection-item avatar">'+
                    '<i class="mdi-action-account-circle circle light-blue accent-2"></i>'+
                    '<span class="title">' + json.friend[i].pseudo +'</span>'+
                    '<a href="/connect/launchpartie/'+ json.friend[i].id +'" class="secondary-content waves-effect light-blue darken-1 btn-large">Défier</a>'+
                    '</li>';
                    $('.collection').append(friend);
                }
                $('.collapsible').collapsible({
                    accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                });

            }else{
                Materialize.toast('Vous n\'avez pas encore d\'amis', 4000)
            }
        },

        error: function (result, statut, erreur) {
            $('.loader').slideUp(200);
            Materialize.toast('Erreur de communication avec le serveur', 4000)
        }
    });
});
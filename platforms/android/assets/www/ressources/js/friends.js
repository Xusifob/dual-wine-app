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
                    var friend = '<li data-player="' + json.friend[i].id + '">' +
                        '<div class="collapsible-header"><i class="mdi-action-account-circle"></i>' + json.friend[i].pseudo +
                        '</div>' +
                        '<div class="collapsible-body center-align">' +
                    /* '<p>Nombre de parties jouées : 34<br>' +
                        'Nombre de parties gagnés : 18 <br>' +
                        'Nombre de parties perdues : 12 <br>' +
                        'Nombre de parties à égalité : 7</p>' + */
                        '<a href="/connect/play/' + json.friend[i].id + '" class="waves-effect light-blue darken-1 btn-large margin-bottom-25">Défier</a>' +
                        '<a href="" data-user="' + json.friend[i].id + '" class="waves-effect light-blue darken-1 btn-large margin-bottom-25 deleteplayer">Supprimer</a>' +
                        '</div>' +
                        '</li>';

                    $('#players').append(friend);
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

$('body').on('click','.deleteplayer',function(){

    localStorage.setItem('player-delete',$(this).attr('data-user'));
    showConfirm();
    return false;


});


function showConfirm() {
    navigator.notification.confirm(
        'Êtes vous sur de vouloir supprimer votre ami?',  // message
        onConfirm,                // callback to invoke with index of button pressed
        'Suppression',            // title
        'Oui,Annuler'          // buttonLabels
    );
}

function onConfirm(buttonIndex) {
    console.log(buttonIndex);

    var usr = localStorage.getItem('player-delete');
    localStorage.removeItem('player-delete');

    if(buttonIndex == 1){
        router.navigate('/connect/deletefriend/' + usr);
        return false;
    }else{
        return false;
    }

}


$('form[name="searchFriend"]').submit(function(){

    var val = {
        'pseudo': $('#pseudo').val(),
        'token': localStorage.getItem('token')
    };

    $.ajax({
        url: adresseAjax + 'connect/findfriend',
        type: 'POST',
        data: val,
        success: function (json, statut) { // success est toujours en place, bien sûr !
            $('.loader').hide();
            console.log(json);
            if(json.friend){
                Materialize.toast( $('#pseudo').val() + ' a bien été ajouté a votre liste d\'amis' , 4000)
                router.navigate('/connect/reloadamis');
            }else{
                Materialize.toast(  $('#pseudo').val() + " n'a pas été trouvé" , 4000)
            }

        },

        error: function (result, statut, erreur) {
            $('.loader').hide();
            Materialize.toast('Erreur de communication avec le serveur', 4000)
        }
    });
    return false;
});



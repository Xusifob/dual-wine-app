$(document).ready(function(){

    $('.loader').slideDown(200);

    $('#pseudo').val(localStorage.getItem('pseudo'));
    $('#email').val(localStorage.getItem('email'));

    // Requete Ajax
    $.ajax({
        url : adresseAjax + 'connect/profil',
        type : 'POST',
        data : {'token': localStorage.getItem('token') },
        success : function(json, statut){
            console.log(json.classement);
            $('.loader').slideUp(200);
            $('#score').html(json.score);
            $('#classement').html(json.classement);

        },

        error : function(result, statut, erreur){
            $('.loader').slideUp(200);
            Materialize.toast('Erreur de communication avec le serveur', 4000)
        }

    });

});


$('form[name="modifier"]').submit(function() {

    var val = {
        'oldpassword' : $('#oldpassword').val(),
        'newpassword' : $('#newpassword').val(),
        'token': localStorage.getItem('token')
    };

    // Requete Ajax
    $.ajax({
        url : adresseAjax + 'connect/profilupdate',
        type : 'POST',
        data : val,
        success : function(json, statut){
            console.log(json);
            if(json.update){
                Materialize.toast('Mot de passe réinitialisé', 4000)
            }else {
                Materialize.toast('Ancien mot de passe entré incorrect', 4000)
            }

        },

        error : function(result, statut, erreur){
            Materialize.toast('Erreur de communication avec le serveur', 4000)
        }

    });

    return false;
});
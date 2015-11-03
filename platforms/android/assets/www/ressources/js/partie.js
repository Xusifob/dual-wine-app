// Gestion du timer
var time = 100;
var answer = false;
var nbpoint = 0;
var nbqst = 0;


$(document).ready(function(){
    if(AfficheQst()) {
        timerdown();
    }
});

function timerdown(){
    if(time > 0 && answer == false) {
        time = time-1;
        $('.determinate').css('width',time + '%');
        setTimeout(timerdown,100);
    }else if(time == 0){
        EndPartie(false);
    }
}


$('#partie .card').on('click',function(){
    answer = true;
    var reponse = $(this).attr('data-reponse');
    EndPartie(reponse);

});

$('body').on('click','#suivant',function(){
    return false;
});


function EndPartie(reponse){
    nbqst++;
    console.log('Nb qst : ',nbqst);
    console.log('Nb bonne rep : ',nbpoint);
    $('#partie .card').each(function () {
        $(this).removeClass('blue lighten-2');
        if ($(this).attr('data-reponse') == 'true')
            $(this).addClass('green');
        else
            $(this).addClass('red darken-2');
    })
    if(reponse == 'true') {
        $("#modal-title").html('Bravo !');
        nbpoint++;
    }
    else
        $("#modal-title").html('Oups !');
    var reponse_txt = $('div[data-reponse="true"] span').html();
    $("#modal-txt").html('Bonne réponse : ' + reponse_txt);
    $('#modal').openModal({
        complete: closeModal
    });
}

// action à la fermeture de la modale
function closeModal() {
    if(nbqst < 3) {
        $('#partie .card').each(function () {
            if ($(this).attr('data-reponse') == 'true')
                $(this).removeClass('green');
            else
                $(this).removeClass('red darken-2');

            $(this).addClass('blue lighten-2');
        });
        AfficheQst();

        answer = false;
        time = 100;
        timerdown();
    }
    else{
        console.log('fini');
        var val = {
            'token': localStorage.getItem('token'),
            'id' : idPartie,
            'scoreJoueur' : nbpoint
        };

        $.ajax({
            url: adresseAjax + 'connect/finishplay',
            type: 'POST',
            data: val,
            success: function (json, statut) { // success est toujours en place, bien sûr !
                $('.loader').slideUp(200);
                if(json.partie){
                    Materialize.toast('Partie terminée !', 4000);
                    router.navigate('/connect/accueil');

                }else{
                    Materialize.toast('Une erreur est survenue', 4000);
                    router.navigate('/connect/accueil');
                }
            },

            error: function (result, statut, erreur) {
                $('.loader').slideUp(200);
                Materialize.toast('Erreur de communication avec le serveur', 4000)
                Router.navigate('/connect/accueil');
            }
        });

    }
}



function AfficheQst(){

    var qst = {};
    if(tour.question1 != null && tour.question2 != null && tour.question3 != null){
        switch(nbqst) {
            case 0 :
                qst.nom = tour.question1.nom;

                qst.rep = [
                    [
                        b = true,
                        txt = tour.question1.vrai
                    ],
                    [
                        b = false,
                        txt = tour.question1.faux1
                    ],
                    [
                        b = false,
                        txt = tour.question1.faux2
                    ],
                    [
                        b = false,
                        txt = tour.question1.faux3
                    ]
                ];
                break;
            case
            1
            :
                qst.nom = tour.question2.nom;
                qst.rep = [
                    [
                        b = true,
                        txt = tour.question2.vrai
                    ],
                    [
                        b = false,
                        txt = tour.question2.faux1
                    ],
                    [
                        b = false,
                        txt = tour.question2.faux2
                    ],
                    [
                        b = false,
                        txt = tour.question2.faux3
                    ]
                ];
                break;
            case
            2
            :
                qst.nom = tour.question3.nom;
                qst.rep = [
                    [
                        b = true,
                        txt = tour.question3.vrai
                    ],
                    [
                        b = false,
                        txt = tour.question3.faux1
                    ],
                    [
                        b = false,
                        txt = tour.question3.faux2
                    ],
                    [
                        b = false,
                        txt = tour.question3.faux3
                    ]
                ];
                break;
        }



        qst.rep.sort(function() { return 0.5 - Math.random() });

        console.log(qst.rep);

        // J'affiche la question
        $('#question').html(qst.nom);

        // J'affiche les réponses
        for(var i = 0;  i<4; i++) {
            // Je gère la bonne réponse
            $('#card-' + i)
                .attr('data-reponse', qst.rep[i][0])
                .attr('data-question', nbqst);

            // J'affiche le texte
            $('#card-'+ i +' .card-title').html(qst.rep[i][1]);
            console.log(qst.rep[i][1]);
        }
        return true;
    } else{
        Materialize.toast('Aucune question n\'a été trouvé', 4000);
        router.navigate('/connect/accueil');
        return false;
    }
}
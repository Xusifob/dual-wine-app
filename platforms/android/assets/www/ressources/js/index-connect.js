$(document).ready(function(){
    $('.loader').slideDown(200);

    var val = {
        'token': localStorage.getItem('token')
    };

    $.ajax({
        url: adresseAjax + 'connect/allpartie',
        type: 'POST',
        data: val,
        success: function (json, statut) { // success est toujours en place, bien sûr !
            $('.loader').slideUp(200);
            console.log(json);
            if(json.start.length > 0) {
                // J'affiche les parties pas commencés
                for (var i = 0; i < json.start.length; i++) {
                    var joueur = json.start[i].joueur;
                    var userId = localStorage.getItem('id');

                    if(userId == json.start[i].joueur[0].id){
                        var joueurAdverse = json.start[i].joueur[1];
                        if(joueurAdverse.id == json.start[i].firstPlayer) {
                            joueurAdverse.score = json.start[i].score1;
                            joueurAdverse.tour = json.start[i].tour1;
                        }else{
                            joueurAdverse.score = json.start[i].score2;
                            joueurAdverse.tour = json.start[i].tour2;
                        }
                    }else{
                        var joueurAdverse = json.start[i].joueur[0];
                        if(joueurAdverse.id == json.start[i].firstPlayer) {
                            joueurAdverse.score = json.start[i].score1;
                            joueurAdverse.tour = json.start[i].tour1;
                        }else{
                            joueurAdverse.score = json.start[i].score2;
                            joueurAdverse.tour = json.start[i].tour2;
                        }
                    }
                    if(joueurAdverse.id == json.start[i].firstPlayer) {
                        var partie = '<li class="">' +
                            '<div class="collapsible-header"><i class="mdi-action-account-circle"></i>Défier ' + joueurAdverse.pseudo +
                            '<span class="badge">Nouvelle demande</span>' +
                            '</div>' +
                            '<div class="collapsible-body center-align" style="display: none;">' +
                            '<p>Nouvelle partie</p>' +
                            '<a href="/connect/play/' + json.start[i].id + '" class="waves-effect green btn-large margin-bottom-25">Accepter</a>' +
                            '<a href="/connect/refuse/' + json.start[i].id + '" class="waves-effect red darken-2 btn-large margin-bottom-25">Refuser</a>' +
                            '</div>' +
                            '</li>';

                    }else{
                        var partie = '<li class="">' +
                            '<div class="collapsible-header"><i class="mdi-action-account-circle"></i>Défier ' + joueurAdverse.pseudo +
                            '<span class="badge">En attente de réponse</span>' +
                            '</div>' +
                            '<div class="collapsible-body center-align" style="display: none;">' +
                            '<p>En attente de réponse</p>' +
                            '<a href="/connect/refuse/' + json.start[i].id + '" class="waves-effect red darken-2 btn-large margin-bottom-25">Annuler</a>' +
                            '</div>' +
                            '</li>';
                    }
                    $('#new').append(partie);

                }
            }else {
                $('#defi-new').remove();
                $('#new').remove();
            }


            if(json.inProgress.length > 0){
                // J'affiche les parties en cours
                for (var i = 0; i < json.inProgress.length; i++) {
                    var userId = localStorage.getItem('id');

                    if(userId == json.inProgress[i].joueur[0].id){
                        var joueurAdverse = json.inProgress[i].joueur[1];
                        var joueur = json.inProgress[i].joueur[0];

                        if(joueurAdverse.id == json.inProgress[i].firstPlayer) {
                            joueurAdverse.score = json.inProgress[i].score1;
                            joueurAdverse.tour = json.inProgress[i].tourj1;
                            joueurAdverse.first = true;

                            joueur.score = json.inProgress[i].score2;
                            joueur.tour = json.inProgress[i].tourj2;
                            joueur.first = false;
                        }else{
                            joueurAdverse.score = json.inProgress[i].score2;
                            joueurAdverse.tour = json.inProgress[i].tourj2;
                            joueurAdverse.first = false;

                            joueur.score = json.inProgress[i].score1;
                            joueur.tour = json.inProgress[i].tourj1;
                            joueur.first = true;
                        }
                    }else{
                        var joueurAdverse = json.inProgress[i].joueur[0];
                        var joueur = json.inProgress[i].joueur[1];

                        if(joueurAdverse.id == json.inProgress[i].firstPlayer) {
                            joueurAdverse.score = json.inProgress[i].score1;
                            joueurAdverse.tour = json.inProgress[i].tourj1;
                            joueurAdverse.first = true;

                            joueur.score = json.inProgress[i].score2;
                            joueur.tour = json.inProgress[i].tourj2;
                            joueur.first = false;
                        }else{
                            joueurAdverse.score = json.inProgress[i].score2;
                            joueurAdverse.tour = json.inProgress[i].tourj2;
                            joueurAdverse.first = false;

                            joueur.tour = json.inProgress[i].tour1;
                            joueur.tour = json.inProgress[i].tourj1;
                            joueur.first = true;
                        }
                    }


                    var play = false;


                    console.log('Joueur : ', joueur);

                    // Si c'est le premier joueur
                    if (joueur.first) {
                        // Il joue dans le cas ou son tour est impaire et égal au tour de l'autre
                        if (joueur.tour % 2 == 1 && joueur.tour == joueurAdverse.tour) {
                            var play = true;
                            // Ou dans le cas ou son tour est paire et inférieur au tour de l'autre
                        } else if (joueur.tour % 2 == 0 && joueur.tour < joueurAdverse.tour) {
                            var play = true;
                        }
                        // Si c'est pas le premier joueur
                    } else {
                        // Il joue dans le cas ou son tour est impaire et inférieur au tour de l'autre
                        if (joueur.tour % 2 == 1 && joueur.tour < joueurAdverse.tour) {
                            var play = true;
                            // Ou dans le cas ou son tour est paire et égal au tour de l'autre
                        } else if (joueur.tour % 2 == 0 && joueur.tour == joueurAdverse.tour) {
                            var play = true;
                        }
                    }

                    console.log('Play : ' + play);

                    if(play) {
                        var partie = '<li class="">' +
                            '<div class="collapsible-header"><i class="mdi-action-account-circle"></i>Partie contre ' + joueurAdverse.pseudo +
                            '<span class="badge">C\'est ton tour</span>' +
                            '</div>' +
                            '<div class="collapsible-body center-align" style="display: none;">' +
                            '<p>Score ' + joueur.score + '-' + joueurAdverse.score + '<br></p>' +
                            '<a href="/connect/play/' + json.inProgress[i].id + '" class="waves-effect light-blue darken-1 btn-large margin-bottom-25">Jouer</a>' +
                            '</div>' +
                            '</li>';
                    }else{
                        var partie = '<li class="">' +
                            '<div class="collapsible-header"><i class="mdi-action-account-circle"></i>Défier ' + joueurAdverse.pseudo +
                            '<span class="badge">En attente</span>' +
                            '</div>' +
                            '<div class="collapsible-body center-align" style="display: none;">' +
                            '<p>Score ' + joueur.score + '-' + joueurAdverse.score + '<br></p>' +
                            '</div>' +
                            '</li>';
                    }

                    $('#inProgress').append(partie);
                }
            }
            else {
                $('#defi-inProgress').remove();
                $('#inProgress').remove();
            }

            if(json.done.length > 0) {

                // J'affiche les parties en cours
                for (var i = 0; i < json.done.length; i++) {
                    var userId = localStorage.getItem('id');


                    if(userId == json.done[i].joueur[0].id) {
                        var JoueurAdverse = json.done[i].joueur[1];
                        var Joueur = json.done[i].joueur[0];

                    }else{
                        var JoueurAdverse = json.done[i].joueur[0];
                        var Joueur = json.done[i].joueur[1];
                    }

                    if(userId == json.done[i].firstPlayer){
                        Joueur.score = json.done[i].score1;
                        JoueurAdverse.score = json.done[i].score2;
                    }else{
                        Joueur.score = json.done[i].score1;
                        JoueurAdverse.score = json.done[i].score2;
                    }

                    var Partie = '<li>' +
                        '<div class="collapsible-header"><i class="mdi-action-account-circle"></i>Partie contre ' + JoueurAdverse.pseudo;

                    if(Joueur.score > JoueurAdverse.score) {
                        Partie += '<span class="badge">Gagné</span>';
                    }else{
                        Partie += '<span class="badge">Perdue</span>';
                    }

                    Partie +='</div>' +
                    '<div class="collapsible-body center-align"><p>Score '+ Joueur.score +'-' + JoueurAdverse.score +'</p>' +
                    '<a href="/connect/launchpartie/'+ JoueurAdverse.id +'" class="waves-effect light-blue darken-1 btn-large margin-bottom-25">Rejouer</a>' +
                    '</div>' +
                    '</li>';

                    $('#done').append(Partie);
                }
            }
            else{
                $('#defi-done').remove();
                $('#done').remove();
            }

            $('.collapsible').collapsible({
                accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            });
        },

        error: function (result, statut, erreur) {
            $('.loader').slideUp(200);
            Materialize.toast('Erreur de communication avec le serveur', 4000)
        }
    });
});

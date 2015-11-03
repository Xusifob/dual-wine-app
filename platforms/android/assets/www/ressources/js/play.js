$(document).ready(function(){

    for (var i = 0; i < categories.length; i++) {
        $('#card-' + i + ' .card-title').html(categories[i].nom);
        $('#card-' + i + ' a').attr('href','/connect/partie/' + partie + '-' + categories[i].id);

    }


});


function AlgorithmeElo(ScoreJ1,ScoreJ2,nbpartieJ1,nbPartieJ2,W1,W2){

    // Coefficient K
    var K1 = CalculK(nbpartieJ1);
    var K2 = CalculK(nbPartieJ2);

    D1 = ScoreJ1 - ScoreJ2;

    // Calcul des probabilités
    var pD1 = 1/(1+10^(-D1/400));
    var pD2 = 1- pD1;

    // Calcul des scores
    ScoreJ1 = ScoreJ1 + K1*(W1 - pD1 );
    ScoreJ2 = ScoreJ2 + K2*(W2 - pD2 );

    return {
        ScoreJ1 : ScoreJ1,
        ScoreJ2 : ScoreJ2
    }
}


function CalculK(nbPartie){
    var K = 0;
    if(nbPartie<15) {
        K = 40;
    }else if(nbPartie<30){
        K = 30
    }else if(nbPartie<40){
        K = 20
    }else{
        K = 10;
    }

    return K;
}
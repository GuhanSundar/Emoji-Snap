//defined platers
//settings
var roundsToWin=3;
var countdownFrom=5;
var newRoundStartsIn=4000;
var newRoundStartsInFromSnap=3000;
var pcCallsIn = 2000;
var noticeOnTime=1200;
var countdownSpeed=400;
var noticeDelay = 1000;

//Timers
var newRoundTimer=undefined;
var pcCallSnapTimer = undefined;
var countdownTimer = undefined;


//define players
var user ={
    name: 'user',
    roundsWon: 0,
    currentEmoji: undefined
};

var pc ={
    name: 'pc',
    roundsWon: 0,
    currentEmoji: undefined
};

//define our emojis
var emojis = [' ⚓️ ', ' 🚀 ', ' 🎯',  '🍬', '🐳' , '🤡', '😎'];
var joker='🤡';
var startEmoji='❓';

//define state
var currentRound = 0;
var count = 5;

//HTML IDs
var instructionsElem;
var countdownElem;
var snapBtn;
var startBtn;
var userEmojiElem;
var pcEmojiElem;
var currentRoundElem;
var noticeElem;
var resetButton;


var start = function(){
    userEmojiElem = document.getElementById('userEmoji');
    noticeElem=document.getElementById('notice');
    snapBtn = document.getElementById('snap-btn');
    startBtn = document.getElementById('start-btn');
    currentRoundElem = document.getElementById("current-round");
    pcEmojiElem = document.getElementById('pcEmoji');
    userEmojiElem.innerText=startEmoji;
    pcEmojiElem.innerText=startEmoji;
    countdown();
    instructionsElem = document.getElementById('instruct');
    instructionsElem.classList.add('hide');
    startBtn.classList.add('hide');
    snapBtn.classList.remove('hide');
    document.getElementById('user-score').innerText=0;
    document.getElementById('pc-score').innerText=0;
    setTimeout(function(){
        instructionsElem.parentNode.removeChild(instructionsElem);
        startBtn.parentNode.removeChild(startBtn);
    },510);
}

//event listeners 


var countdown=function(){
    startBtn.addEventListener('click',function(){start();});
    snapBtn.addEventListener('click',function(){snap();});
    if(count!=0){
        console.log('count: '+ count);
        countdownElem = document.getElementById('countdown');
        countdownElem.innerText = count;
        countdownElem.classList.remove('hide');
    }

    if(count<=0){
        count=countdownFrom;
        countdownElem.classList.add('hide');
        startNextRound();
        return;
    }
    else{
        countdownTimer=setTimeout(countdown,countdownSpeed);
    }
    count--;

}

var startNextRound = function(){
    //Incrememt the round
    currentRound++;
    currentRoundElem.innerText=currentRound;
    console.log('Round: '+currentRound);
    //pc and user to be assigned random Emoji each
    pc.currentEmoji=getRandomEmoji();
    pcEmojiElem.innerText=pc.currentEmoji;
    user.currentEmoji=getRandomEmoji();
    userEmojiElem.innerText=user.currentEmoji;
    if(isAMatch())
    {        pcCallSnapTimer=setTimeout(function(){
            snap(true);}, pcCallsIn);
    }

    newRoundTimer=setTimeout(countdown,newRoundStartsIn);
    console.log('Emojis',user.currentEmoji,'vs',pc.currentEmoji);
}

var isAMatch = function(){
    if(pc.currentEmoji==joker || user.currentEmoji==joker){
        return true;
}
    return pc.currentEmoji==user.currentEmoji;
}

var getRandomEmoji = function() {
    var randomNumber=Math.round(Math.random() * (emojis.length-1));
    return emojis[randomNumber];
}

var createNewNotice = function(noticeText,persist,delay){
    var newNotice = document.createElement('div');
    newNotice.innerHTML='<span>'+noticeText+'</span>';

    if(!delay){delay=0;}
    newNotice.classList.add('hide');

    noticeElem.appendChild(newNotice);
    setTimeout(function(){
        newNotice.classList.remove('hide');
    },10+delay);
    if(!persist)
    {
    setTimeout(function() {
        newNotice.classList.add('hide');
        setTimeout(function(){
            noticeElem.removeChild(newNotice);
        },260);
    },noticeOnTime+delay);
}
}

var snap=function(pcCalledSnap){
    //compare between the two emojis
    //if it's a joker, then snap is true
    //if snap is true then user/pc gets +1 to roundsWon
    //if user gets it wrong then pc gets +1 to roundsWon
    //Notify what happened
    if(pc.currentEmoji == undefined || user.currentEmoji == undefined){
        return false;
    }
    

    clearTimeout(newRoundTimer);

    var snap=isAMatch();

    createNewNotice('Snap by'+(pcCalledSnap?'🤖':'🤵'),false,0);
    console.group('Snap Called by: '+(pcCalledSnap?'PC':'User'));

    //pc called
    if(pcCalledSnap)
    {
        if(snap){
            pc.roundsWon++;
            document.getElementById('pc-score').innerText=pc.roundsWon;
            console.log('PC won the round');
            createNewNotice('🤖 Won the round',false,noticeDelay);
        }
        else{
            user.roundsWon++;
            document.getElementById('user-score').innerText=user.roundsWon;
            createNewNotice('🤖 Lost the round');
            console.log('PC lost the round',false,noticeDelay);
        }
    }
    //user called
    else
    {
        if(snap){
            user.roundsWon++;
            document.getElementById('user-score').innerText=user.roundsWon;
            createNewNotice('🤵 Won the round',false,noticeDelay);
            console.log('User won the round');
        }
        else{
            pc.roundsWon++;
            document.getElementById('pc-score').innerText=pc.roundsWon;
            createNewNotice('🤵 Lost the round',false,noticeDelay);
            console.log('User lost the round');
        }
    }

    console.log('User :'+user.roundsWon+'PC: '+pc.roundsWon);

    pc.currentEmoji=undefined;
    user.currentEmoji=undefined;

    if(user.roundsWon==roundsToWin){
        console.log('User won the game!');
        createNewNotice('🤵 Won the game!',true,noticeDelay*2);
    }
    else if(pc.roundsWon==roundsToWin){
        console.log('Pc won the game!');
        createNewNotice('🤖 Won the game!',true,noticeDelay*2);
    }
    else {
    newRoundTimer=setTimeout(countdown,newRoundStartsInFromSnap);
    }
    console.groupEnd();
}
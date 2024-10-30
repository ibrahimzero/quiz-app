//select th elements
let countSpan=document.querySelector('.quiz-info .count span');
let bulletContainer=document.querySelector('.bullets .spans')
let currntIndex=0;
let quizArea=document.querySelector('.quiz-area');
let answerArea=document.querySelector('.answers-area');
let submitBtn=document.querySelector('.submit-button');
let rightanswer=0;
let bullets=document.querySelector('.bullets');
let resultsContainer=document.querySelector('.results');
let countDownInterval;
let countDownElement=document.querySelector('.countdown')
// function to get the questions
function getQuestions(){
    let myREquest=new XMLHttpRequest();
    myREquest.onreadystatechange=function(){
        if(this.readyState===4&& this.status===200){
            let questionesobj=JSON.parse(this.responseText)
            let questionCount=questionesobj.length;
            createBUllets(questionCount);
            //add data
            addData(questionesobj[currntIndex],questionCount);
            countDown(5,questionCount)

            submitBtn.onclick =()=>{
                //get right answer
                let theRightAnswer=questionesobj[currntIndex].right_answer;
                currntIndex++;
                checkAnswer(theRightAnswer,questionCount);
                //remove previos question
                quizArea.innerHTML='';
                answerArea.innerHTML='';
                addData(questionesobj[currntIndex],questionCount);
                
                //handel bullets class
                handleBullets();
                clearInterval(countDownInterval)
                countDown(5,questionCount)
                //show result
                showResult(questionCount)

            }
        }
    };
    myREquest.open("GET","questiones.json",true);
    myREquest.send();
}
getQuestions();
function createBUllets(num){
    countSpan.innerHTML=num;
   
    //create spans 
    for(let i=0; i<num; i++){
        //create span of th bullet
        let bullet=document.createElement('span');
        if(i===0){
            bullet.className='on'
        }
        bulletContainer.appendChild(bullet);
        
    }
}
function addData(obj,count){
    if(currntIndex < count){
        let h2 = document.createElement('h2');
        let h2Text=document.createTextNode(obj.title);
        h2.appendChild(h2Text);
        quizArea.appendChild(h2);
        //creat answers
    for(let i=1; i<=4; i++){
        //creat main answer div 
        let mainDiv = document.createElement('div');
        mainDiv.className="answer";
        let radio=document.createElement('input');
        radio.name='question';
        radio.type='radio';
        radio.id=`answer_${i}`;
        radio.dataset.answer=obj[`answer_${i}`];
        //make first option selected
        if(i===1){
            radio.checked=true
        }
        
        let theLable=document.createElement('label');
        theLable.htmlFor=`answer_${i}`;
        let theLableText=document.createTextNode(obj[`answer_${i}`]);
        theLable.appendChild(theLableText);
        //add input + label to main div
        mainDiv.appendChild(radio);
        mainDiv.appendChild(theLable);
        answerArea.appendChild(mainDiv)
    
    }
    }
  

}
function checkAnswer(rAnswer,count){
let answers=document.getElementsByName('question');
let ChoosenAnswer;
for(let i=0; i<answers.length; i++){
    if(answers[i].checked){
        ChoosenAnswer=answers[i].dataset.answer;

    }
}
if(rAnswer==ChoosenAnswer){
    rightanswer++;
    
}

}
function handleBullets(){
    let bulletsSpans=document.querySelectorAll('.bullets .spans span ');
    let arrayOfSpans=Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currntIndex===index){
            span.className='on';
        }
    })
}
function showResult(count){
    let theResults;
if(currntIndex === count){
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    bullets.remove();
    if(rightanswer>(count/2)&&rightanswer<count){
    theResults = `<span class="good">Good</span>, ${rightanswer} from ${count} is Good`;
    }else if(rightanswer=== count){
        theResults = `<span class="perfect">perfect</span>, all answers is good `;
    }else{
        theResults = `<span class="bad">bad</span>, ${rightanswer} from ${count} is bad`; 
    }
    resultsContainer.innerHTML=theResults;
}
}
//timer function
function countDown(duration,count){
    if(currntIndex<count){
        let minutes,seconds;
        countDownInterval=setInterval(function(){
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);
            minutes=minutes < 10 ? `0${minutes}`:minutes;
            seconds=seconds < 10 ?`0${seconds}`:seconds;
            countDownElement.innerHTML=`${minutes}:${seconds}`;
            if(--duration<0){
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        },1000)
        
    }
}
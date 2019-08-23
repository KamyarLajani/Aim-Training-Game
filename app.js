function mode(e){
  if(e.className != 'active mode'){
    document.querySelectorAll('.modes .mode')[0].className = 'mode';
    document.querySelectorAll('.modes .mode')[1].className = 'mode';
    e.className = 'active mode';
    app.$data.mode = e.innerText;
  }
  else {
    e.className = 'active mode';
    app.$data.mode = e.innerText;
  }
 
}

function sensitivity(e){
  if(e.className != 'active sensitivity'){
    document.querySelectorAll('.sensitivities .sensitivity')[0].className = 'sensitivity';
    document.querySelectorAll('.sensitivities .sensitivity')[1].className = 'sensitivity';
    document.querySelectorAll('.sensitivities .sensitivity')[2].className = 'sensitivity';
    e.className = 'active sensitivity';
    app.$data.sensitivity = e.innerText;
  }
  else {
    e.className = 'active sensitivity';
    app.$data.sensitivity = e.innerText;
  }
 
}

function align(e){
  if(e.className != 'active align'){
    document.querySelectorAll('.alignBtn .align')[0].className = 'align';
    document.querySelectorAll('.alignBtn .align')[1].className = 'align';
    e.className = 'active align';
    app.$data.btnAlign = e.innerText;
  }
  else {
    e.className = 'active align';
    app.$data.btnAlign = e.innerText;
  }
  
}


var app = new Vue({

    el: '#app',
    data: {
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      scoresCount: 0,
      finalScores: 0,
      started: false,
      finished: false,
      mode: 'Easy',
      sensitivity: 'Medium',
      sensitivitySpeed: 1.7,
      btnAlign: 'Left'
      
    },
    methods: {
      
      startGame: function(){
          this.fullscreen();
          this.started = true;
          
        
          let circuleContainer = document.querySelector('.circules');
          let id = 0, X1=0, Y1=0, X2=0, Y2=0, arrX=[], arrY=[];
          let container = document.querySelector('.container');
          let fireBtn = document.querySelector('.fireBtn');
          let aim = document.getElementById('scopeTarget');
          function resized(){
          // reassigning to get new window width and height when user resized the window
          id = 0, X1=0, Y1=0, X2=0, Y2=0, arrX=[], arrY=[];
        
          aim.style.left = `${(window.innerWidth/2)-30}px`;
          aim.style.top = `${(window.innerHeight/2)-30}px`;
          
          if(app.$data.btnAlign == 'Left'){
            fireBtn.style.left = '20px';
            
          }
          else {
            
            fireBtn.style.left = `${(window.innerWidth)-70}px`;
          }
          fireBtn.style.top = `${window.innerHeight-80}px`;
          container.style.height = `${window.innerHeight-10}px`;
          container.style.width = `${window.innerWidth-10}px`;
          let index;
          index = 0;
          for(let val= 60; val< parseInt(container.style.width.replace('px',''))-60; val+=60){
            arrX[index] = val;
        
            index++;
          }
          index = 0;
          for(let val= 60; val< parseInt(container.style.height.replace('px',''))-60; val+=60){
            arrY[index] = val;
            index++;
          }
        
          }
        
          resized();
        
          window.addEventListener('resize', resized);
          
          let speed, sensitivity;
          switch(this.mode){
            case 'Easy':
            speed = 2000;
            break;
            default:
            speed = 1500;

          }
          switch(this.sensitivity){
            case 'Low':
            this.sensitivitySpeed = 1.7;
            break;
            case 'Medium':
            this.sensitivitySpeed = 2.2;
            break;
            default:
            this.sensitivitySpeed = 3.5;

          }
          let interval
            setTimeout(()=>{
                interval = setInterval(createCircles, speed);
            }, 2000);
            let counter = 0;
            function createCircles(){
              X1 = Math.floor((Math.random() * arrX.length));
              Y1 = Math.floor((Math.random() * arrY.length));
              X2 = Math.floor((Math.random() * arrX.length));
              Y2 = Math.floor((Math.random() * arrY.length));
              
              if(counter < 30){
                if(id < 1){
                  circuleContainer.innerHTML += `<span class="hitMe" style="left:${arrX[X1]}px; top:${arrY[Y1]}px" id="${id}"></span>
                                                <span class="hitMe" style="left:${arrX[X2]}px; top:${arrY[Y2]}px" id="${id+1}"></span>`;
                  id++;
                  counter++;
                }
                else {
                  id= 0;
                  circuleContainer.innerHTML = '';
                }
              }
              else {
                clearInterval(interval);
                container.style.display =  'none';
                app.$data.finalScores = app.$data.scoresCount;
                app.$data.scoresCount = 0;
                  setTimeout(() => {
                    app.$data.finished = true;
                    document.exitFullscreen();
                  }, 1000);
                
              }
              
            }
        
      },

      fullscreen: function(){
        
        let aim = document.getElementById('scopeTarget');
        let container = document.querySelector('.container');
        container.requestFullscreen();
        this.fire();
        aim.style.left = `${(window.innerWidth/2)-30}px`;
        aim.style.top = `${(window.innerHeight/2)-30}px`;
      },
      fire: function(){
        let Audio = document.querySelector('.fireAudio');
        Audio.currentTime = 0; 
        Audio.volume = 0.1; 
        Audio.play();
      },
      hit(){
        let Audio = document.querySelector('.hitAudio');
        Audio.volume = 0.7;
        Audio.currentTime = 0;
        Audio.play();
      },
      mouseMove(e){
        this.x = e.offsetX;
        this.y = e.offsetY;
        let scopeTarget = document.getElementById("scopeTarget");
        scopeTarget.style.left = `${this.x}px`;
        scopeTarget.style.top = `${this.y}px`;
      },
      mouseDown: function(){
        this.fire();
        var ele = document.querySelectorAll('.hitMe');
        let container = document.querySelector('.circules');
        if(ele[0] !== null){
          for(i=0; i< ele.length; i++){
            if(this.x+10 >= parseInt(ele[i].style.left.replace('px','')) && 
            this.x+20 < parseInt(ele[i].style.left.replace('px',''))+40 && 
            this.y+10 >= parseInt(ele[i].style.top.replace('px','')) && 
            this.y+20 < parseInt(ele[i].style.top.replace('px',''))+40) {
              this.hit();
              this.scoresCount++;
              container.removeChild(ele[i]);
            }
         
          }
        }
      },
      touchStart: function(e){
        
        let aim = document.getElementById('scopeTarget');
        let rect = e.target.getBoundingClientRect();
        let fingersLength = e.targetTouches.length;
        let lastFingerx = 0, lastFingerY = 0;
        if(fingersLength > 1){
          
          this.x = Math.ceil(e.targetTouches[0].pageX - rect.left);
          this.y = Math.ceil(e.targetTouches[0].pageY - rect.top);
          lastFingerX = Math.ceil(e.touches[fingersLength-1].pageX - rect.left);
          lastFingerY = Math.ceil(e.touches[fingersLength-1].pageY - rect.left);
          this.fireBtn(lastFingerX, lastFingerY);
        }
        else {
          this.x = Math.ceil(e.changedTouches[0].pageX - rect.left);
          this.y = Math.ceil(e.changedTouches[0].pageY - rect.top);
        }
        
        this.left = aim.style.left;
        this.top = aim.style.top;
        

      },
      touchMove(e){
        let aim = document.getElementById('scopeTarget');
        let rect = e.target.getBoundingClientRect();
        let fingersLength = e.targetTouches.length;
        
        if(fingersLength > 1){
           x = e.targetTouches[0].pageX - rect.left;
           y = e.targetTouches[0].pageY - rect.top;   
        }
        else {
           x = e.changedTouches[0].pageX - rect.left;
           y = e.changedTouches[0].pageY - rect.top;
        }
        aim.style.left = `${parseInt(this.left.replace('px',''))+ Math.round((x-this.x)*this.sensitivitySpeed)}px`;
        aim.style.top = `${parseInt(this.top.replace('px',''))+ Math.round((y-this.y)*this.sensitivitySpeed)}px`;
        
      },
      fireBtn: function(lastFingerX, lastFingerY){
        let aim = document.getElementById('scopeTarget');
        let ele = document.querySelectorAll('.hitMe');
        let container = document.querySelector('.circules');
        let fireBtn = document.querySelector('.fireBtn');
        if(lastFingerX >= parseInt(fireBtn.style.left.replace('px','')) && 
          lastFingerX < parseInt(fireBtn.style.left.replace('px',''))+50 && 
          lastFingerY >= parseInt(fireBtn.style.top.replace('px','')) && 
          lastFingerY < parseInt(fireBtn.style.top.replace('px',''))+50) {
          this.fire();
         
          if(ele[0] !== null){
            for(i=0; i < ele.length; i++){
                
              if(parseInt(aim.style.left.replace('px',''))+10 >= parseInt(ele[i].style.left.replace('px','')) && 
                parseInt(aim.style.left.replace('px',''))+20 < parseInt(ele[i].style.left.replace('px',''))+40 && 
                parseInt(aim.style.top.replace('px',''))+20 >= parseInt(ele[i].style.top.replace('px','')) && 
                parseInt(aim.style.top.replace('px',''))+10 < parseInt(ele[i].style.top.replace('px',''))+40) {
                  
                  this.hit();
                  this.scoresCount++;
                  container.removeChild(ele[i]);
                          
                }
                    
              }
            }
        }
        
      }

      }
});
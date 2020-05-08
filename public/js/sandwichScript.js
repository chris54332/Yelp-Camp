(() =>{
  let newSandwichForm = document.getElementById('new-sandwich');
  let formElements = document.getElementsByName('form-el');

  newSandwichForm.addEventListener('submit', (evnt) =>{
    console.log("this thing working?");
    for( let i = 0; i < 4; i++){
      if(formElements[i] = ''){
        evnt.preventDefault();
        console.log("TETSTETWTSEF");
        alert("FILL IN ALL THE FIELDS");
      }
    }
  });

})();
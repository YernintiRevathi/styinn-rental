// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) { 
        //checkValidity() is a method of a form (or an individual form element) 
        // that checks whether all validation rules are satisfied.
        event.preventDefault()
        event.stopPropagation()
        //Events in the browser bubble up through parent elements.

            // Suppose you have:

            // <div id="parent">
            //     <button id="child">Click</button>
            // </div>
            // parent.addEventListener("click", () => {
            //     console.log("Parent clicked");
            // });

            // child.addEventListener("click", (event) => {
            //     console.log("Button clicked");
            // });

            // Clicking the button prints:

            // Button clicked
            // Parent clicked
            //Because the click event first happens on the button, then bubbles up to its parent.
        //stopPropagation() → Prevents the submit event from bubbling to parent elements 
        // or other submit handlers that might react to it.
      }

      form.classList.add('was-validated')
        //adds Bootstrap's validation class. Bootstrap then displays:

        //Green borders for valid inputs.
        //Red borders and error messages for invalid inputs.

        //Without this class, Bootstrap won't show the validation feedback 
        //even if checkValidity() returns false.
    }, false)
  })
})()

const searchBar=document.querySelector(".search-bar");
// console.log("searchBar",searchBar);
searchBar.addEventListener("submit",(e)=>{
  e.preventDefault();
  // console.log("e",e);
  const searchInput=searchBar.querySelector(".search-input");
  // console.log("input",searchInput.value);
  const query=searchInput.value.trim();
  window.location.href=`/listings?search=${encodeURIComponent(query)}`;
})
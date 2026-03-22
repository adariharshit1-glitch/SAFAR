let input = document.getElementById('email')
        let next = document.getElementById('nxt')
       

        input.addEventListener('keyup', () => {
            if (input.value !== "") {
               next.disabled=false; 
            } else {
                next.disabled = true;
            }
        });
       
const formDelete = document.querySelector('#form-delete')

formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm('Deseja Deletar?') 
        if(!confirmation) {
            event.preventDefault
        }
    
})



const formCreate = document.querySelector('.button')

formCreate.addEventListener('submit', (event) =>{
    const confirm = confirm("eseja se Registrar? ")
    if(!confirm) {
        event.preventDefault()
    }
})
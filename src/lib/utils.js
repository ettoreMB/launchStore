module.exports = {
    age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)
    
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
    
        if(month < 0 || month == 0 && today.getDate() <= birthDate.getDate()) {
            age = age - 1
        }
    
        return age
    },

    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hours = date.getHours()
        const minutes = date.getMinutes()

        return {
            day: `${day}/${month}`,
            month,
            year,
            hours: `${hours}h${minutes}`,
            minutes,
            iso: `${day}/${month}/${year}`,
            birthday: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }

    },

    formatPrice(price){
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price/100);
    },
    formatCpfCnpj(value) {
        value = value.replace(/\D/g, "")

        if(value.length >14) {
          value.splice(0,-1)
        }

        //check if is cnpj  - 11.222.333/0001-1
        if(value.length > 11) {
          // enter 1122233300011
          value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5")
          // return 11.222.333/0001-1
          value = value.substr(0,17)
        } else { // CPF 123.123.123-62
          //enter 12312312362
          value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/,"$1.$2.$3-$4")
        }
        return value
      },

      formatCep(value) {
        value = value.replace(/\D/g, "")
        value = value.replace(/(\d{5})(\d)/, "$1-$2")
        value = value.substr(0,9)
        
        return value
      }
}


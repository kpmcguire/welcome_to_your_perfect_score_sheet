let fence_selector = 'fence-active'
let house_selector = 'house:not(.empty)'
let development_selector = 'development'
let amount_selector = 'amount'
let ok_to_save = false

document.querySelectorAll('.park-row').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.park')) {
      update_parks()
      update_total()
      save_all()

    }
  })
})

document.querySelectorAll('#pools-container').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.pool-input')) {
      update_pools()
      update_total()
      save_all()
    }
  })
})

document.querySelectorAll('.temp-row').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.temp')) {
      update_temps()
      update_total()
      save_all()
    }
  })
})

document.querySelectorAll('.development-row').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.development-input')) {
      update_investments()
      update_total()
      save_all()
    }
  })
})

document.querySelectorAll('.row').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.fence-input')) {
      let el = event.target

      if (el.parentNode.parentNode.classList.contains('fence-active')) {
        el.parentNode.parentNode.classList.remove('fence-active')
      } else {
        el.parentNode.parentNode.classList.add('fence-active')
      }
      update_developments(fence_selector, house_selector, development_selector, amount_selector)
    }
    if (event.target.matches('.house input')) {
      let el = event.target

      if (el.value && el.parentNode.classList.contains('empty')) {
        el.parentNode.classList.remove('empty')
      } else {
        el.parentNode.classList.add('empty')
        el.parentNode.classList.remove('gloop')
      }
      update_developments(fence_selector, house_selector, development_selector, amount_selector)
    }
    update_total()
    save_all()
  })
})

document.querySelectorAll('#city-plans-container').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.city-plan-score-input')) {
      update_city_plans()
      update_total()
      save_all()
    }
  })
})

document.getElementById('temp-score').addEventListener('change', function(event) {
  update_total()
  save_all()
})

document.querySelectorAll('#bis-container').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.bis-input')) {
      update_bis()
      update_total()
      save_all()
    }
  })
})

document.querySelectorAll('#permit-refusal-container').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.permit-refusal-input')) {
      update_permit_refusals()
      update_total()
      save_all()
    }
  })
})

document.querySelectorAll('.temp-winners').forEach(function (element) {
  element.addEventListener('change', function (event) {
    if (event.target.matches('.temp-winner')) {
      save_all()
    }
  })
})

document.getElementById('town-name').addEventListener('change', function(event){
  save_all()
})

window.addEventListener('DOMContentLoaded', (event) => {
  restore_all()
})

function update_developments(fence_selector, house_selector, development_selector, amount_selector) {

  let potential_development = document.querySelectorAll(`.${fence_selector} + .${house_selector}`)
  let numbers = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }


  potential_development.forEach(function (element) {

    var next = []
    next.push(element)

    while (element.nextElementSibling && !element.nextElementSibling.matches(`.${fence_selector}`)) {
      next.push(element = element.nextElementSibling)
    }

    next.forEach(function (element) {
      element.classList.add('gloop')
    })
  })


  let rescan_potential_development = document.querySelectorAll(`.${fence_selector} + .${house_selector}`)

  rescan_potential_development.forEach(function (element) {

    let next = []

    next.push(element)

    while (element.nextElementSibling && !element.nextElementSibling.matches(`.${fence_selector}`)) {
      next.push(element = element.nextElementSibling)
    }

    let remove_it
    let house_count = 0
    let empty_count = 0

    next.forEach(function (meltiment) {

      if (meltiment.matches(`.${house_selector}`)) {
        house_count++
      }

      if (meltiment.classList.contains(`empty`)) {
        empty_count++
      }

      if (house_count > 6 || empty_count > 0) {
        remove_it = true
      }

    })

    if (remove_it == true) {
      next.forEach(function (element) {
        element.classList.remove('gloop')
      })
    }

    for (var key in numbers) {
      if (numbers.hasOwnProperty(key)) {
        if (house_count == key && !remove_it) {
          numbers[key]++
        }
      }
    }
  })

  let output = ""
  for (var key in numbers) {
    if (numbers.hasOwnProperty(key)) {
      output += `<div id='houses-${key}-developments'>${numbers[key]}</div>`
    }
    document.getElementById(`developments`).innerHTML = output
  }

  // let houses_with_pools = document.querySelectorAll(`.${house_selector}.pool`).length

  // if (houses_with_pools) {
  //   document.getElementById('pools').innerHTML = houses_with_pools
  // } else {
  //   document.getElementById('pools').innerHTML = 0
  // }

  update_investments()
}

function update_pools() {
  let pools = document.querySelectorAll('#pools-container')

  pools.forEach(function (el) {
    let id = el.id
    let pool_score = []

    el.querySelectorAll('.pool-input').forEach(function (elm) {
      if (elm.checked) {
        pool_score.push(Number(elm.value))
      }
    })

    let highest = Math.max.apply(Math, pool_score)
    document.getElementById(`score-${id}`).innerHTML = highest
  })
}

function update_parks() {
  let park_rows = document.querySelectorAll('.park-row')

  park_rows.forEach(function (el) {
    let id = el.id
    let park_score = []

    el.querySelectorAll('.park').forEach(function (elm) {
      if (elm.checked) {
        park_score.push(Number(elm.value))
      }
    })

    let highest = Math.max.apply(Math, park_score)
    document.getElementById(`score-${id}`).innerHTML = highest
  })

  let scores = document.querySelectorAll('.park-score')

  let total_score = 0

  scores.forEach(function(el){
    total_score += Number(el.innerHTML)
  })

  document.getElementById('park-total').innerHTML = total_score
}

function update_temps() {
  let temp_rows = document.querySelectorAll('.temp-row')

  temp_rows.forEach(function (el) {
    let id = el.id
    let temp_score = 0

    el.querySelectorAll('.temp').forEach(function (elm) {
      if (elm.checked) {
        temp_score++
      }
    })
    document.getElementById(`score-${id}`).innerHTML = temp_score
  })
}

function update_investments() {
  let investment_rows = document.querySelectorAll('.development-row')

  investment_rows.forEach(function (el) {
    let id = el.id
    let investment_score = []

    el.querySelectorAll('.development-input').forEach(function (elm) {
      if (elm.checked) {
        investment_score.push(Number(elm.value))
      }
    })

    let highest = Math.max.apply(Math, investment_score)
    let id_to_num = id.slice(-1)
    let multiple = document.getElementById(`houses-${id_to_num}-developments`).innerHTML
    
    if (multiple === null) {
      multiple = 1
    } else {
      multiple = Number(multiple)
    }

    document.getElementById(`score-${id}`).innerHTML = (highest * multiple)
  })
}

function update_bis() {
  let bis_rows = document.querySelectorAll('#bis-container')

  bis_rows.forEach(function (el) {
    let id = el.id
    let bis_score = []

    el.querySelectorAll('.bis-input').forEach(function (elm) {
      if (elm.checked) {
        bis_score.push(Number(elm.value))
      }
    })

    let highest = Math.max.apply(Math, bis_score)
    document.getElementById(`score-${id}`).innerHTML = highest*-1
  })
}

function update_permit_refusals() {
  let permit_refusal_rows = document.querySelectorAll('#permit-refusal-container')

  permit_refusal_rows.forEach(function (el) {
    let id = el.id
    let permit_refusal_score = []

    el.querySelectorAll('.permit-refusal-input').forEach(function (elm) {
      if (elm.checked) {
        permit_refusal_score.push(Number(elm.value))
      }
    })

    let highest = Math.max.apply(Math, permit_refusal_score)
    document.getElementById(`score-${id}`).innerHTML = highest*-1
  })
}

function update_city_plans() {
  let city_plans = document.querySelectorAll(".city-plan-score-input")
  let city_plans_score = 0
  city_plans.forEach(function(el){
    city_plans_score += Number(el.value)
  })
  document.getElementById('city-plans-total').innerHTML = city_plans_score
}

function update_total() {

  let totals = document.querySelectorAll('.total-sub')

  total_score = 0

  totals.forEach(function(el){
    if(el.tagName == 'INPUT') {
      total_score += Number(el.value)
    } else {
      total_score += Number(el.innerHTML)
    }
  })

  document.getElementById('total-score').innerHTML = total_score

}



function save_all() {
  if (ok_to_save) {

    localStorage.clear()

    let all_text_inputs = {}
    let all_checkbox_inputs = {}

    document.querySelectorAll('input[type="text"]').forEach(function(input){
      all_text_inputs[input.id] = input.value
    })

    document.querySelectorAll('input[type="checkbox"]').forEach(function(input){
      all_checkbox_inputs[input.id] = input.checked
    })  

    let all_text_inputs_json = JSON.stringify(all_text_inputs)
    let all_checkbox_inputs_json = JSON.stringify(all_checkbox_inputs)

    localStorage.setItem('all_checkboxes', all_checkbox_inputs_json)
    localStorage.setItem('all_texts', all_text_inputs_json)
  }

}

function restore_all() {
  let checks = JSON.parse(localStorage.getItem('all_checkboxes'))

  for (let [key, value] of Object.entries(checks)) {

    let elm = document.getElementById(`${key}`)

    if (elm.checked == false && value == true) {
      elm.checked = value
      elm.dispatchEvent(new Event('change', { bubbles: true }))
    } else {
      elm.checked = value
    }
  }

  let texts = JSON.parse(localStorage.getItem('all_texts'))

  for (let [key, value] of Object.entries(texts)) {

    let elm = document.getElementById(`${key}`)

    elm.value = value
    elm.dispatchEvent(new Event('change', { bubbles: true }))

  }

  ok_to_save = true
}

function reset_all() {
  document.querySelectorAll('input[type="text"]').forEach(function(input){
    input.value = ''
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })

  document.querySelectorAll('input[type="checkbox"]').forEach(function(input){
    if (input.checked && input.disabled == false) {
      input.checked = false
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  update_developments(fence_selector, house_selector, development_selector, amount_selector)
  update_parks()
  update_temps()
  update_investments()
}

document.getElementById('reset').addEventListener('click', function (event) {
  event.preventDefault()
  if (window.confirm("Do you really want to reset?")) {
    reset_all()
  }  
})





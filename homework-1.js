const readline = require('node:readline')

function ticketPrice(category) {
  switch (category) {
    case 1:
      return 300
    case 2:
      return 500
    case 3:
      return 900
    default:
      return 0
  }
}

function maxTickets(budget, price) {
  if (!Number.isFinite(budget) || !Number.isFinite(price) || price <= 0) {
    return 0
  }

  let count = 0
  let remaining = budget

  while (remaining >= price) {
    remaining -= price
    count += 1
  }

  return count
}

function printTicketResult(category, budget) {
  const price = ticketPrice(category)

  if (price === 0) {
    console.log('неизвестная категория')
    return
  }

  const count = maxTickets(budget, price)
  console.log(`Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`)
}

function deliveryPrice(distance, total) {
  if (total >= 3000 || distance <= 3) {
    return 0
  }

  if (distance <= 10) {
    return 200
  }

  return 200 + 25 * (distance - 10)
}

function printDelivery(distance, total) {
  const price = deliveryPrice(distance, total)
  console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${price} руб.`)
}

function printSteps(height) {
  let builtCount = 0

  for (let step = 1; step <= height; step += 1) {
    if (step === 4) {
      continue
    }

    if (step > 10) {
      console.log('Дальше лестница не построена')
      break
    }

    console.log(`Ступень ${step}`)
    builtCount += 1
  }

  console.log(`Всего построено: ${builtCount}`)
}

async function main() {
  const input = readline.createInterface({ input: process.stdin })
  const lines = input[Symbol.asyncIterator]()

  async function ask(prompt) {
    process.stdout.write(prompt)
    const line = await lines.next()

    if (line.done) {
      throw new Error('ввод завершён')
    }

    return line.value.trim()
  }

  async function askNumber(prompt) {
    const answer = await ask(prompt)
    const value = Number(answer)

    if (answer === '' || !Number.isFinite(value) || value < 0) {
      throw new Error('некорректные данные')
    }

    return value
  }

  console.log('Выберите задачу:')
  console.log('1 — билетная касса')
  console.log('2 — доставка заказа')
  console.log('3 — лестница')

  try {
    const choice = await ask('Ваш выбор: ')

    switch (choice) {
      case '1': {
        const category = Number(await ask('Категория билета: '))
        const budget = await askNumber('Бюджет: ')
        printTicketResult(category, budget)
        break
      }
      case '2': {
        const distance = await askNumber('Расстояние: ')
        const total = await askNumber('Сумма заказа: ')
        printDelivery(distance, total)
        break
      }
      case '3': {
        const height = await askNumber('Высота лестницы: ')

        if (!Number.isSafeInteger(height)) {
          throw new Error('некорректные данные')
        }

        printSteps(height)
        break
      }
      default:
        console.log('такой задачи нет')
    }
  } catch (error) {
    console.log(error.message)
    process.exitCode = 1
  } finally {
    input.close()
  }
}

main()

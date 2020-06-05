let scripts = Array.from(document.scripts).filter(x => x.parentElement.localName === 'body')

let codes = []

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function main() {
  await asyncForEach(scripts, async (d) => {
    let code = ''

    if (d.innerText) {
      code = d.innerText
    } else {
      code = await (await fetch(d.src)).text()
    }
    
    codes.push(code)
  })

  console.log(codes)
}

main()
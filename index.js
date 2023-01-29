"use strict";

let rangeStorage = document.querySelector("#sliderStorage");
let outputStorage = document.querySelector("#demo");
let rangeTranser = document.querySelector("#sliderTransfer");
let outputTranser = document.querySelector("#demo2");


let storage = +rangeStorage.value;
let transfer = +rangeTranser.value;

outputStorage.innerHTML = `${storage}GB`;
outputTranser.innerHTML = `${transfer}GB`;

const spanResult = document.querySelectorAll(".result");
let memory = document.querySelectorAll('input[type=radio][name="memory"]');
let type = document.querySelectorAll('input[type=radio][name="type"]');

let disk, options;

memory.forEach((item) => {
  if (item.checked) {
    disk = item.value;
  }
});

type.forEach((item) => {
  if (item.checked) {
    options = item.value;
  }
});

let yValues = [
  backblaze(storage, transfer),
  bunny(storage, transfer, disk),
  scaleway(storage, transfer, options),
  vultr(storage, transfer),
  0,
];


let lists = Array.from(document.querySelectorAll(".chart span"));

showResult(storage, transfer, disk, options);

function changedSpanRes(spanResult, res, dataAttr) {
  spanResult.forEach((item) => {
    if (item.dataset.resultName === dataAttr) {
      item.textContent = `${res}\$`;
      console.log(item);
    }
  });
}

function backblaze(Storage, Transfer) {
  let priceStorage = 0.005;
  let priceTransfer = 0.01;
  let minPay = 7;
  let totalPrice = Storage * priceStorage + Transfer * priceTransfer;
  totalPrice = totalPrice > minPay ? totalPrice : minPay;
  changedSpanRes(spanResult, totalPrice, "backblaze");
  return totalPrice;
}

function bunny(Storage, Transfer, disk) {
  let priceStorage = disk === "HDD" ? 0.01 : 0.02;
  let priceTransfer = 0.01;
  let maxPay = 10;
  let totalPrice = Storage * priceStorage + Transfer * priceTransfer;
  totalPrice = totalPrice > maxPay ? maxPay : totalPrice;
  changedSpanRes(spanResult, totalPrice, "bunny");
  return totalPrice;
}

function scaleway(Storage, Transfer, options) {
  let k;
  let priceStorage;
  if (options === "Multy") {
    k = 6;
    priceStorage = Storage > 75 ? 0.06 : 0;
  } else {
    k = 3.75;
    priceStorage = Storage > 75 ? 0.03 : 0;
  }
  let priceTransfer = Transfer > 75 ? 0.02 : 0;
  let totalPrice = Storage * priceStorage + Transfer * priceTransfer - k;
  totalPrice = totalPrice < 0 ? 0 : totalPrice;
  changedSpanRes(spanResult, totalPrice, "scaleway");
  return totalPrice;
}

function vultr(Storage, Transfer) {
  let priceStorage = 0.01;
  let priceTransfer = 0.01;
  let minPay = 5;
  let totalPrice = Storage * priceStorage + Transfer * priceTransfer;
  totalPrice = totalPrice < minPay ? minPay : totalPrice;
  changedSpanRes(spanResult, totalPrice, "vultr");
  return totalPrice;
}

function showResult(storage, transfer, disk, options) {
  yValues = [
    backblaze(storage, transfer),
    bunny(storage, transfer, disk),
    scaleway(storage, transfer, options),
    vultr(storage, transfer),
  ];

  let indexColor = yValues.indexOf(Math.min(...yValues));
  let indexesMin = yValues.map((item, index, arr) => {
    if (item === arr[indexColor]) {
      return index;
    }
  });

  let newColors = ["gray", "gray", "gray", "gray"];
  indexesMin.forEach((item, index) => {
    newColors[item] = "red";
  });

  lists.forEach((item, i) => {
    item.style.height = `${yValues[i]}%`;
    item.style.backgroundColor = `${newColors[i]}`;
  });
}


document
  .querySelector(".rangeslider")
  .addEventListener("input", ({ target }) => {
    let element = target.closest("input");
    if (element) {
      rangeStorage = document.querySelector("#sliderStorage");
      rangeTranser = document.querySelector("#sliderTransfer");
      outputStorage.innerHTML = `${element.value}GB`;

      storage = element.value;
      transfer = rangeTranser.value;

      showResult(storage, transfer, disk, options);
    }
  });

document
  .querySelector(".rangeslider2")
  .addEventListener("input", ({ target }) => {
    let element = target.closest("input");
    if (element) {
      rangeStorage = document.querySelector("#sliderStorage");
      rangeTranser = document.querySelector("#sliderTransfer");
      outputTranser.innerHTML = `${element.value}GB`;

      storage = rangeStorage.value;
      transfer = element.value;

      showResult(storage, transfer, disk, options);
    }
  });

const memoryRadio = document.querySelector(".memory");
memoryRadio.addEventListener("change", ({ target }) => {
  const radio = target.closest("input[type='radio']");
  if (radio) {
    disk = radio.value;
    showResult(storage, transfer, disk, options);
  }
});

const typeRadio = document.querySelector(".type");
typeRadio.addEventListener("change", ({ target }) => {
  const radio = target.closest("input[type='radio']");
  if (radio) {
    options = radio.value;
    showResult(storage, transfer, disk, options);
  }
});

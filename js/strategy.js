let RCI = (values, period) => {
  let result = [];
  for (let i = 0; i < period - 1; i++) {
    result.push(NaN);
  }
  for (let end = period - 1; end < values.length; end++) {
    let start = end - period + 1;
    let target = values.slice(start, end + 1);
    let target_sorted = values.slice(start, end + 1).sort((a, b) => {
      return b - a;
    });
    let i = 0;
    let d = 0;
    while (i < period) {
      let time_rank = period - i;
      let price_rank = target_sorted.indexOf(target[i]) + 1;
      d = d + (time_rank - price_rank) * (time_rank - price_rank);
      i += 1;
    }
    let rci = (6 * d) / (period * (period * period - 1));
    rci = (1 - rci) * 100;
    result.push(rci);
  }
  return result;
};

let RSI = (values, period) => {
  let result = [];
  for (let i = 0; i < period; i++) {
    result.push(NaN);
  }
  for (let end = period; end < values.length; end++) {
    let sumGain = 0;
    let sumLoss = 0;
    let j = end - period + 1;
    while (j < end + 1) {
      let difference = values[j] - values[j - 1];
      if (difference >= 0) {
        sumGain += difference;
      } else {
        sumLoss -= difference;
      }
      j += 1;
    }

    let relativeStrength = sumGain / sumLoss;
    let rsi = 100.0 - 100.0 / (1 + relativeStrength);
    result.push(rsi);
  }
  console.log(result);

  return result;
};

//シグナル配列を返す関数
var Signal = function (mArray, pLow, pHigh, dma) {
  var result = [0];
  for (let i = 1; i < mArray.length; i++) {
    //インジケータがpLow以下になれば買い
    if (mArray[i - 1] > pLow && mArray[i] <= pLow) {
      result.push(1);
      //インジケータがpHigh以上になれば売り
    } else if (mArray[i - 1] < pHigh && mArray[i] >= pHigh) {
      result.push(-1);
    } else {
      result.push(0);
    }
  }

  //シグナル発生をDMAパラメータ分だけ遅らせる
  if (dma > 0) {
    for (let j = 1; j < dma + 1; j++) {
      result.unshift(0);
      result.pop();
    }
  }
  return result;
};

//分析対象のデータ群を設定する関数
var getDataSet = function (mArray, p1, pLow, pHigh, dma) {
  var rawdata = mArray;
  var ind = RSI(rawdata, p1);
  var sigarr = Signal(ind, pLow, pHigh, dma);
  return [rawdata, ind, sigarr];
};

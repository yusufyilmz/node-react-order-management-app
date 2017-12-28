
String.prototype.ara = function () {
  if (this.search(arguments[0]) == -1) return [this] // virgül yoksa tek elemanlı bir diziye dön
  for (var i = 0; i < this.length; i++) if (this.charAt(i) == ',') break
  return [this.substring(0, i), this.substring(i + 1)] // virgül varsa virgülden öncesini ve virgülden sonrasını içeren iki elemanlı bir diziye dön
}

const basamak = [
  [0, '', '', '', 'bin', ''],
  [1, 'Bir', 'On', 'Yüz', 'Bin', 'On'],
  [2, 'İki', 'Yirmi', 'İki Yüz', 'İki Bin', 'Yirmi'],
  [3, 'Üç', 'Otuz', 'ÜçYüz', 'ÜçBin', 'Otuz'],
  [4, 'Dört', 'Kırk', 'Dört Yüz', 'DörtBin', 'Kırk'],
  [5, 'Beş', 'Elli', 'BeşYüz', 'BeşBin', 'Elli'],
  [6, 'Altı', 'Altmış', 'AltıYüz', 'AltıBin', 'Altmış'],
  [7, 'Yedi', 'Yetmiş', 'YediYüz', 'YediBin', 'Yetmiş'],
  [8, 'Sekiz', 'Seksen', 'SekizYüz', 'SekizBin', 'Seksen'],
  [9, 'Dokuz', 'Doksan', 'DokuzYüz', 'DokuzBin', 'Doksan']
]

function convertNumberPart(A) {
  var netice = [] // yazıya çevirdiklerimiz bunun içinde yer alacak
  for (var t = 0; t < A.length; t++) {
    var dizi = [] // her rakamın karşılığı olan kelime bunun içine gelecek
    for (var n = 0, b = A[t].length; n < A[t].length; n++ , b--) {
      for (var i = 0; i < 10; i++) {
        if (A[t].charAt(n) == basamak[i][0]) dizi[dizi.length] = basamak[i][b]
      }
    }
    netice[netice.length] = dizi.join('')  // dizi isimli dizinin elemanları arasına boşluk koy, netice dizisine ata
  }

  if (netice.length == 1) {
    var lastResult = netice + "TürkLirası"
    return lastResult;
  }

  var lastResult = netice.join('TürkLirası')
  lastResult += 'Kuruş'

  return lastResult
}

export function convertNumber(number) {

  var A = number.split('.') // el.value ara fonksiyonunda this ile temsil edilecek. A bir dizi. Çünkü fonksiyon diziye dönüyor.
  if (A.length == 1 && A[0] == 0) return 'SıfırTürkLirası'
  const res = convertNumberPart(A)

  console.log(res)
  return res
}

export function getDateOptions() {
  var options = {
    weekday: "short", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  return options;
}

export function getInvoiceDateOptions() {
  var options = {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  };

  return options;
}

export function getCustomStyle() {

  const customStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };
  return customStyle;
}


export function getCollapseCustomStyle() {

  var customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '500px', // <-- This sets the height
      overlfow: 'scroll' // <-- This tells the modal to scrol
    }
  };

  return customStyles;
}



export function camelize(str) {
  // var camelizedStr =  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
  //   if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
  //   return index == 0 ? match.toLowerCase() : match.toUpperCase();
  // });

  // return capitalizeFirstLetter(camelizedStr);
  // return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

  if (str != undefined && str != "") {

    var tempstr = str.toLowerCase();
    var words = tempstr.split(" ");

    var convertedstr = words.map(function (i) {
      if (i != undefined && i != "") {
        return i[0].toUpperCase() + i.substring(1)
      }
      else {
        return "";
      }
    }).join(" ");
    return convertedstr;
  }
}


function capitalize(string, a) {

  console.log(string);
  var tempstr = string.toLowerCase();
  console.log(tempstr);

  if (a == false || a == undefined)
    return tempstr.replace(tempstr[0], tempstr[0].toUpperCase());
  else {
    return tempstr.split(" ").map(function (i) { return i[0].toUpperCase() + i.substring(1) }).join(" ");
  }
}


// export function decamelize(str) {
//   return str.replace(/([A-Z])/g, ' $1')
//     // uppercase the first character
//     .replace(/^./, function(str){ return str.toUpperCase(); });
// }


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getOrderStatusOptions() {
  return [
    { value: '0', label: 'Not specified' },
    { value: '2', label: 'Ödeme tamamlandı' },
    { value: '3', label: 'Paket hazırlanıyor' },
    { value: '4', label: 'Kargoya verildi' },
    { value: '5', label: 'Teslim edildi' },
    { value: '6', label: 'İptal edildi' },
    { value: '7', label: 'Ücret iade edildi' },
    { value: '8', label: 'Ödeme hatası' },
    { value: '10', label: 'Banka ödemesi bekliyor' },

  ]
}


export function getPlatformOptions() {
  return [
    { value: '1', label: 'Presta' },
    { value: '2', label: 'N11' },

  ]
}

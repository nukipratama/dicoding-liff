const seblakPrice = 10000;
const batagorPrice = 15000;
const thaiteaPrice = 8000;
const kopiPrice = 10000;
var seblak, batagor, thaitea, kopi;
var total = 0;
$(document).on("change", "input", function () {
   seblak = parseInt($("#seblak").val());
   batagor = parseInt($("#batagor").val());
   thaitea = parseInt($("#thaitea").val());
   kopi = parseInt($("#kopi").val());
   makanan, minuman = 0;
   var makanan = seblak + batagor;
   var minuman = thaitea + kopi;
   total = (seblak * seblakPrice) + (batagor * batagorPrice) + (thaitea * thaiteaPrice) + (kopi * kopiPrice);
   $('#total').html(total);
   $('#makanan').html(makanan);
   $('#minuman').html(minuman);
});

function printPesanan(profileName) {
   var pesanan = 'Hai ' + profileName + '! Terima Kasih telah menggunakan Pesankeun.' +
      ' Rincian Pesanan : ';
   if (total == 0) {
      return null;
   } else {
      if (seblak != 0) {
         pesanan += seblak + ' Seblak Uhuy ';
      }
      if (batagor != 0) {
         pesanan += batagor + ' Batagor Uhuy ';
      }
      if (thaitea != 0) {
         pesanan += thaitea + ' Thai Tea Bohay ';
      }
      if (kopi != 0) {
         pesanan += kopi + ' Es Kopi Susu ';
      }
   }
   pesanan += '. Total Harga : Rp ' + total;
   return pesanan;
}
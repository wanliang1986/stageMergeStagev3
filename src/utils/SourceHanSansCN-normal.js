﻿import { jsPDF } from 'jspdf';
var font =
var callAddFont = function () {
  this.addFileToVFS('SourceHanSansCN-normal.ttf', font);
  this.addFont('SourceHanSansCN-normal.ttf', 'SourceHanSansCN', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont]);
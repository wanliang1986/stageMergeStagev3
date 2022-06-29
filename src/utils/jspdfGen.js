import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './SourceHanSansCN-normal';

export const exportGenPdf = (val) => {
  // 默认导出为a4纸张，纵向，单位为毫米
  const doc = new jsPDF();
  doc.setFont('SourceHanSansCN', 'normal');
  doc.setFontSize(30);
  doc.text('收费明细', 10, 10);

  doc.setFontSize(12);
  doc.autoTable({
    head: [['基本信息', '', '', '']],
    body: [
      ['公司名称:', val.companyName, '职位名称:', val.jobTitle],
      ['候选人:', val.candidateName],
    ],
    headStyles: {
      fontSize: 20,
      fontStyle: 'bold',
    },
    styles: {
      font: 'SourceHanSansCN', //字体，如果不配置，表格中的中文仍会乱码
      textColor: [0, 0, 0],
      halign: 'left',
      cellWidth: 45,
    },
    //设置table的主题
    theme: 'plain',
    //Y轴开始位置为200
    startY: 20,
    lineWidth: 1,
  });

  doc.autoTable({
    head: [['offer信息', '', '', '']],
    body: [
      ['签订日期:', val.signingDate, '预计入职日期:', val.estimateOnboardDate],
      ['币种/类型:', val.salaryPdf],
    ],
    headStyles: {
      fontSize: 20,
      fontStyle: 'bold',
    },
    styles: {
      font: 'SourceHanSansCN', //字体，如果不配置，表格中的中文仍会乱码
      textColor: [0, 0, 0],
      halign: 'left',
      cellWidth: 45,
    },
    //设置table的主题
    theme: 'plain',
    //Y轴开始位置为200
    startY: 60,
  });

  doc.autoTable({
    head: [['收费信息', '', '', '']],
    body: [
      ['可收费总计:', val.resAmount, '收费比率:', `${val.rate}%`],
      ['最终收费账单金额:', val.resAmount],
    ],
    headStyles: {
      fontSize: 20,
      fontStyle: 'bold',
    },
    styles: {
      font: 'SourceHanSansCN', //字体，如果不配置，表格中的中文仍会乱码
      textColor: [0, 0, 0],
      halign: 'left',
      cellWidth: 45,
    },
    //设置table的主题
    theme: 'plain',
    //Y轴开始位置为200
    startY: 100,
  });

  doc.save('收费明细.pdf');
};

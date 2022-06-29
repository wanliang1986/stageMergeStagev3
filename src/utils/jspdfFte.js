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
      ['入职日期:', val.onboardDate, '试用期结束:', val.warrantyEndDate],
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
    head: [['薪资结构', '', '', '']],
    body: [
      [
        '基本薪资:',
        val.BASE_SALARY_PDF,
        '入职奖金:',
        `${val.RETENTION_BONUS_PDF}`,
      ],
      [
        '保留奖金:',
        val.SIGN_ON_BONUS_PDF,
        '年度奖金:',
        `${val.ANNUAL_BONUS_PDF}`,
      ],
      [
        '搬迁费用:',
        val.RELOCATION_PACKAGE_PDF,
        '额外费用:',
        `${val.EXTRA_FEE_PDF}`,
      ],
      [
        '薪资总计:',
        val.TotalBill_PDF,
        '收费部分总计:',
        `${val.TotalBillCharge_PDF}`,
      ],
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

  doc.autoTable({
    head: [['收费信息', '', '', '']],
    body: [
      ['收费比率:', val.FeeRatio_PDF, '最终收费账单金额:', val.FeeAmount_PDF],
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
    startY: 155,
  });

  doc.save('收费明细.pdf');
};
